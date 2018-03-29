const util = require('./util.js');

const log = (format, ...args) => {
  let msg = util.sprintf(format, ...args);
  console.log(msg);
}

module.exports = log;