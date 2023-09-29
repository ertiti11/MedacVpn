const Log = require("../models/log.model.js");
const { success } = require("../libs/utils.js");

const Logger = (req) => {
  req = req.split(" - ");

  const newLog = new Log({
    ip: req[0],
    method: req[1],
    url: req[2],
    status: req[3],
    contentLength: req[4],
    responseTime: req[5],
  });
  newLog.save();
};


module.exports = { Logger };