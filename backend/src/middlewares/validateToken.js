const jwt = require("jsonwebtoken");
const { SECRET } = require("../config.js");



const authRequired = (req, res, next) => {
  const { token } = req.cookies;

  if (!token) return res.status(401).json({ message: "unauthorized" });

  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.status(401).json({ message: "unauthorized" });
    req.user = user;
  });

  next();
};



module.exports = { authRequired };