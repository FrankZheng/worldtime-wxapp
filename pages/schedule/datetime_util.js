const years = function(year) {
  let years = [year, year+1];
  // for (let i = 0 ; i < years.length ; i++) {
  //   years[i] = years[i] + 'Y';
  // }
  return years;
}

function months() {
  //for english
  let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months;
}

function isLeapYear(year) {
    if (year % 100 == 0 && year % 400 == 0) {
        return true;
    } 
    if (year % 100 != 0 && year % 4 == 0) {
        return true;
    }
    return false;
}

const days = function(year, month) {
    let days = [];
    let end = 0;
    switch(month) {
        case 1:
        case 3:
        case 5:
        case 7:
        case 8:
        case 10:
        case 12:
            end = 31;
            break;
        case 4:
        case 6:
        case 9:
        case 11:
            end = 30;
            break;
        case 2:
            end = isLeapYear(year) ? 29 : 28;
            break;
        default:
            break;
    }
    for (let i = 1; i <= end; i++) {
        days.push(i + 'D');
    }
    return days;
}

function hours() {
    let hours = []
    for (let i = 0 ; i <= 23; i++) {
        hours.push(i + 'H');
    }
    return hours;
}

function minutes() {
    let minutes = [];
    for (let i = 0 ; i <= 59; i++) {
        minutes.push(i + 'M');
    }
    return minutes;
}

module.exports = {
    years : years,
    months : months(),
    days : days,
    hours : hours(),
    minutes : minutes()
  }
