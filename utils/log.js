const formatString = (formatStr, args) => {
  return formatStr.replace(/{(\d+)}/g, function (match, number) {
    return typeof args[number] != 'undefined'
      ? args[number]
      : match;
  });
}

const log = (format, ...args) => {
  let msg = formatString(format, args);
  console.log(msg);
}

module.exports = log;