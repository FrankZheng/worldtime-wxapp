
const sprintf = (formatStr, ...args) => {
  return formatStr.replace(/{(\d+)}/g, function (match, number) {
    let typeStr = typeof args[number];
    if (typeStr != 'undefined') {
      let arg = args[number];
      if (typeStr == 'object') {
        return JSON.stringify(arg);
      } else {
        return arg;
      }
    } else {
      return match;
    }
  });
}


const formatDateTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatTime = date => {
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return [hour, minute, second].map(formatNumber).join(':')
}


const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const toTitleCase = str => {
  return str.replace(/\w\S*/g, txt => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  })
}



module.exports = {
  formatDateTime : formatDateTime,
  formatTime : formatTime,
  toTitleCase : toTitleCase,
  sprintf : sprintf
}


Date.prototype.getWeekOfMonth = function(exact) {
  let month = this.getMonth()
      , year = this.getFullYear()
      , firstWeekday = new Date(year, month, 1).getDay()
      , lastDateOfMonth = new Date(year, month + 1, 0).getDate()
      , offsetDate = this.getDate() + firstWeekday - 1
      , index = 0 // start index at 0 or 1, your choice
      , weeksInMonth = index + Math.ceil((lastDateOfMonth + firstWeekday - 7) / 7)
      , week = index + Math.floor(offsetDate / 7)
  ;
  if (exact || week < 2 + index) return week;
  return week === weeksInMonth ? index + 5 : week;
};


if (require.main == module) {
  console.log("run util.js");
  let now = new Date();
  let iWeek = now.getWeekOfMonth(true);
  console.log("iWeek: " + iWeek);

}


