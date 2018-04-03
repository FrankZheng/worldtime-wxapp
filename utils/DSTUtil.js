//DST (Day saving time) utilities

const util = require('../utils/util.js');
const log = require('../utils/log.js');


const transDate = (dateStr, timezone) => {
    //"2018-03-11 02:00:00 GMT-03:30"
    let sign = timezone > 0 ? "+" : "-";
    let tz = Math.abs(timezone);
    let hour = Math.floor(tz);
    let minutes = Math.floor((tz - hour) * 60);
    let str = util.sprintf("{0} GMT{1}{2}:{3}", dateStr, sign, 
        hour < 10 ? '0' + hour : hour, 
        minutes == 0 ? minutes + '0' : minutes);
    return new Date(str);
}

const DST_Settings = [
    { 
        /*
        https://en.wikipedia.org/wiki/Daylight_saving_time_in_the_United_States
        In the U.S., daylight saving time starts on the second Sunday in March and ends on the first Sunday in November, 
        with the time changes taking place at 2:00 a.m. local time. With a mnemonic word play referring to seasons, 
        clocks "spring forward, fall back"—that is, in springtime the clocks are moved forward from 2:00 a.m. to 3:00 a.m. 
        and in fall they are moved back from 2:00 a.m. to 1:00 a.m. 
        Daylight saving time lasts for a total of 34 weeks (238 days) every year, about 65% of the entire year.
        */
        countryCode : "US",
        excludeStateNames : ["Arizona", "Hawaii"],
        DSTDates: {
            2018 : ["2018-03-11 02:00:00", "2018-11-04 02:00:00"],
            2019 : ["2018-03-10 02:00:00", "2018-11-03 02:00:00"],
            2020 : ["2018-03-08 02:00:00", "2018-11-01 02:00:00"]
        },
        DSTOffset : 1, //hours 
        isDSTFunc : function(date, timezone) {
            //here date is the local date of the city
            let year = date.getFullYear();
            let dstDates = this.DSTDates[year];
            if (dstDates) {
                let startDate = transDate(dstDates[0], timezone);
                let endDate = transDate(dstDates[1], timezone);
                return (date >= startDate && date <= endDate);
            }
            return false;
        }
    },
    {
        countryCode : "US",
        excludeStateNames : ["Arizona", "Hawaii"],
        isDSTFunc : (now_, city) => {
            return true;
        }
    }
];
    


const DSTCheck = (city, _date) => {
    let date = _date || new Date(); 
    for( let i = 0 ; i < DST_Settings.length ; i++) {
        let setting = DST_Settings[i];
        if (setting.countryCode == city.countryCode) {
            if(!setting.excludeStateNames.includes(city.stateName)) {
                return [setting.isDSTFunc(date, city.timezone), setting.DSTOffset];
            }
            break;
        }
    }
    return [false, null];
}

// get city's local time according to its timezone
const localDateForCity = (city, _date) => {
    let date = _date || new Date();

    //need check if city use DST for now.
    //if use DST, local time + 1 hour
    let millsPerHour = 60 * 60 * 1000;
    let localTime = date.getTime() + city.timezone * millsPerHour;
    let localDate = new Date(localTime);
    let [isDST, dstOffset] = DSTCheck(city);
    if(isDST) {
        localDate = new Date(localTime + dstOffset * millsPerHour);
    }

    return localDate;
}

module.exports = {
    localDateForCity : localDateForCity
};


if (require.main == module) {
    console.log("run DSTUtil.js");
    let dateStr = "2018-03-11 02:00:00";
    console.log(transDate(dateStr, -8));

    let city1 = {
        name : "San Francisco",
        countryCode : "US",
        timezone : -8,
        countryName : "United States",
        stateName : "California"
    };

    let city2 = {
        name : "honolulu",
        countryCode : "US",
        timezone : -10,
        countryName : "United States",
        stateName : "Hawaii"
    };

    [city1, city2].forEach( function(city) {
        let [isDST, offset] = DSTCheck(city);
        let localDate = localDateForCity(city);
        log("city: {0}, isDST:{1}, DST_offset:{2}, localDate:{3}", city.name, isDST, offset, localDate);
    });
  
  }