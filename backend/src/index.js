const app = require("./app.js");
const  connectDB  = require("./db.js");

connectDB();
const server = app.listen(3000);


module.exports = { app, server };