const { SECRET } = require("../config.js");
const jwt = require("jsonwebtoken");

async function createAccessToken(payload) {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, SECRET, { expiresIn: "1d" }, (err, token) => {
      if (err) reject(err);
      resolve(token);
    });
  });
}




module.exports = { createAccessToken };