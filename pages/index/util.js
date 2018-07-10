const util = require('../../utils/util.js');

const formatTime = (date) => {
  let hour = date.getHours();
  let isAM = false;
  if (hour <= 12) {
    isAM = true;
  } else if (hour == 12) {
    isAM = false;
  } else {
    // > 12
    isAM = false;
    hour = hour - 12;
  }
  //change to 12 clock mechanism
  /*
  let hour = date.getHours();
  let isAM = true;
  if (hour >= 12 && hour < 24) {
    isAM = false;
  }
  if (hour == 0 || hour == 24) {
    hour = 12;
  }
  */

  const minute = date.getMinutes();
  let timeStr = util.sprintf("{0}:{1}",
    util.formatNumber(hour),
    util.formatNumber(minute));
  return [timeStr, isAM];
}

module.exports = {
  formatTime : formatTime
}

if (require.main == module) {
  console.log("run util.js");
  let now = new Date();
  now.setHours(12);
  let [timeStr, isAM] = formatTime(now);
  console.log("{0} {1}", timeStr, isAM);

}