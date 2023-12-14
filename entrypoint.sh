#!/bin/bash
set -e

# Renombrar la interfaz a eth0
ip link set dev "$(ip link | awk -F: '$0 !~ "lo|vir|wl|^[^0-9]"{print $2;getline}')" name eth0

# Ejecutar el comando o script original del contenedor
exec "$@"