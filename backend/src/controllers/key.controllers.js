const {shell} = require("../libs/os.js")
const path = require("path");
const createKey = async (req, res) => {
  const cmd = await shell("whoami");
  res.json({ message: cmd });
};


module.exports = { createKey };