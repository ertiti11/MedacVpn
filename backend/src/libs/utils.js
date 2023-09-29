var colors = require('colors');

colors.enable()


const success = (message) => {
  console.log(message.green);
};

const error = (message) => {
  console.log(message.red);
};

module.exports = { success, error };
