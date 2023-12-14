#!/bin/bash

# Secure WireGuard server installer
# https://github.com/angristan/wireguard-install

RED='\033[0;31m'
ORANGE='\033[0;33m'
GREEN='\033[0;32m'
NC='\033[0m'

function newClient() {
        # Client configuration
        echo ""
        echo "Client configuration"
        echo ""
        echo "El nombre del cliente debe consistir en caracteres alfanuméricos. También puede incluir guiones bajos (_) o guiones (-) y no debe exceder los 15 caracteres."

        until [[ ${CLIENT_NAME} =~ ^[a-zA-Z0-9_-]+$ && ${CLIENT_EXISTS} == '0' && ${#CLIENT_NAME} -lt 16 ]]; do
                read -rp "Nombre del cliente: " -e CLIENT_NAME
                CLIENT_EXISTS=$(grep -c -E "^### Cliente ${CLIENT_NAME}\$" "/etc/wireguard/wg0.conf")

                if [[ ${CLIENT_EXISTS} != 0 ]]; then
                        echo ""
                        echo -e "${ORANGE}Ya se creó un cliente con el nombre especificado, elige otro nombre.${NC}"
                        echo ""
                fi
        done

        for DOT_IP in {2..254}; do
                DOT_EXISTS=$(grep -c "${SERVER_WG_IPV4::-1}${DOT_IP}" "/etc/wireguard/wg0.conf")
                if [[ ${DOT_EXISTS} == '0' ]]; then
                        break
                fi
        done

        if [[ ${DOT_EXISTS} == '1' ]]; then
                echo ""
                echo "La subred configurada admite solo 253 clientes."
                exit 1
        fi

        BASE_IP=$(echo "$SERVER_WG_IPV4" | awk -F '.' '{ print $1"."$2"."$3 }')
        until [[ ${IPV4_EXISTS} == '0' ]]; do
                read -rp "Cliente WireGuard IPv4: ${BASE_IP}." -e -i "${DOT_IP}" DOT_IP
                CLIENT_WG_IPV4="${BASE_IP}.${DOT_IP}"
                IPV4_EXISTS=$(grep -c "$CLIENT_WG_IPV4/32" "/etc/wireguard/wg0.conf")
                
                if [[ ${IPV4_EXISTS} != 0 ]]; then
                        echo ""
                        echo -e "${ORANGE}Ya se creó un cliente con la IPv4 especificada, elige otra IPv4.${NC}"
                        echo ""
                fi
        done

        BASE_IP=$(echo "$SERVER_WG_IPV6" | awk -F '::' '{ print $1 }')
        until [[ ${IPV6_EXISTS} == '0' ]]; do
                read -rp "Cliente WireGuard IPv6: ${BASE_IP}::" -e -i "${DOT_IP}" DOT_IP
                CLIENT_WG_IPV6="${BASE_IP}::${DOT_IP}"
                IPV6_EXISTS=$(grep -c "${CLIENT_WG_IPV6}/128" "/etc/wireguard/wg0.conf")

                if [[ ${IPV6_EXISTS} != 0 ]]; then
                        echo ""
                        echo -e "${ORANGE}Ya se creó un cliente con la IPv6 especificada, elige otra IPv6.${NC}"
                        echo ""
                fi
        done

        # Genera el par de claves para el cliente
        CLIENT_PRIV_KEY=$(wg genkey)
        CLIENT_PUB_KEY=$(echo "${CLIENT_PRIV_KEY}" | wg pubkey)
        CLIENT_PRE_SHARED_KEY=$(wg genpsk)

        HOME_DIR="/home/wireguard" # Puedes cambiar esto al directorio del usuario si lo prefieres

        # Crea el archivo de configuración del cliente y agrega el servidor como peer
        echo "[Interface]


PrivateKey = ${CLIENT_PRIV_KEY}
Address = ${CLIENT_WG_IPV4}/32,${CLIENT_WG_IPV6}/128
DNS = ${CLIENT_DNS_1},${CLIENT_DNS_2}

[Peer]
PublicKey = ${SERVER_PUB_KEY}
PresharedKey = ${CLIENT_PRE_SHARED_KEY}
Endpoint = ${SERVER_PUB_IP}:${SERVER_PORT}
AllowedIPs = 0.0.0.0/0,::/0" >"${HOME_DIR}/${SERVER_WG_NIC}-client-${CLIENT_NAME}.conf"

        # Agrega el cliente como peer en el servidor
        echo -e "\n### Cliente ${CLIENT_NAME}
[Peer]
PublicKey = ${CLIENT_PUB_KEY}
PresharedKey = ${CLIENT_PRE_SHARED_KEY}
AllowedIPs = ${CLIENT_WG_IPV4}/32,${CLIENT_WG_IPV6}/128" >>"/etc/wireguard/wg0.conf"

        wg syncconf "${SERVER_WG_NIC}" <(wg-quick strip "${SERVER_WG_NIC}")

        # Genera un código QR si qrencode está instalado
        if command -v qrencode &>/dev/null; then
                echo -e "${GREEN}\nAquí tienes el archivo de configuración del cliente como un código QR:\n${NC}"
                qrencode -t ansiutf8 -l L <"${HOME_DIR}/${SERVER_WG_NIC}-client-${CLIENT_NAME}.conf"
        fi

        echo ""
        echo "La configuración del cliente se ha guardado en: ${HOME_DIR}/${SERVER_WG_NIC}-client-${CLIENT_NAME}.conf"
        echo "Puedes descargar este archivo mediante SCP o SFTP o utilizar un lector QR (si está instalado) para obtener la configuración del cliente."

}





























# Verifica que el script se esté ejecutando como root
if [ "${EUID}" -ne 0 ]; then
        echo "Debes ejecutar este script como root."
        exit 1
fi

# Obtén la dirección IPv4 y IPv6 pública del servidor
SERVER_PUB_IP=$(curl -4 ifconfig.co 2>/dev/null)
SERVER_PUB_IPV6=$(curl -6 ifconfig.co 2>/dev/null)

# Obtiene la dirección IPv4 de DNS
echo ""
read -rp "Ingresa la dirección IPv4 de tu servidor DNS preferido: " -e -i "1.1.1.1" CLIENT_DNS_1

# Obtiene la dirección IPv6 de DNS
read -rp "Ingresa la dirección IPv6 de tu servidor DNS preferido (opcional): " -e CLIENT_DNS_2

# Detecta la interfaz de red y la dirección IP del servidor
SERVER_WG_NIC=$(ls /etc/wireguard/ | grep -oE "[a-zA-Z0-9_-]+\.conf" | cut -f1 -d".")
SERVER_WG_IPV4=$(grep "Address =" "/etc/wireguard/${SERVER_WG_NIC}.conf" | awk '{ print $3 }')
SERVER_WG_IPV6=$(grep "Address =" "/etc/wireguard/${SERVER_WG_NIC}.conf" | awk '{ print $4 }')
SERVER_PORT=$(grep "ListenPort =" "/etc/wireguard/${SERVER_WG_NIC}.conf" | awk '{ print $3 }')
SERVER_PUB_KEY=$(wg show "${SERVER_WG_NIC}" public-key)

# Ejecuta la función newClient
newClient