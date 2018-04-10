//index.js
const util = require('../../utils/util.js');
const log = require('../../utils/log.js');
const net = require('../../network/network.js');
const repo = require('../../repository/repository.js');
const prefs = require('../../preference/preference.js');
const requests = require('../../network/requests.js');
const DSTUtil = require('../../utils/DSTUtil.js');

const loadDefaultCities = requests.loadDefaultCities;

const app = getApp()

Page({
  data: {
    state: 0,
    cities: []
  },

  loadingCities : false,

  onLoad: function() {
    log("onLoad");
    if (!prefs.defaultCitiesLoaded) {
      this.loadDefaultCities(cities => {
        this.reloadCities(cities);
        repo.saveCities(cities);
        prefs.defaultCitiesLoaded = true; 
      });
    }
  },

  onShow: function() {
    log("onShow");
    if (!this.loadingCities) {
      let cities = this.loadCities();
      cities = processCityList(cities);
      this.reloadCities(cities);
    }
  },

  onHide: function() {
    log("onHide");
  },

  onUnLoad: function() {
    log("onUnLoad");
  },

  loadDefaultCities: function(success, fail) {
    log("load default cities from server");
    this.loadingCities = true;
    loadDefaultCities((data, error) => {
      this.loadingCities = false;
      if (error) {
        if (fail != null) {
          fail();
        }
      } else {
        let cities = processCityList(data);
        success(cities);  
      }
    });
  },

  saveCities: function(cities) {
    log("saveCities");
    repo.saveCities(cities);
  },

  loadCities: function() {
    log("loadCities");
    return repo.loadCities();
  },

  onCityItemTap: function(e) {
    let index = e.currentTarget.dataset.index;
    log("onCityItemTap, index:" + index);
    if (this.data.state == 1) {
      let cities = this.data.cities; 
      let city = cities[index];
      city.checked = !city.checked;
      this.reloadCities(cities);
    }
  },

  reloadCities:function(cities) {
    this.setData({
      cities:cities
    });
  },

  onCancelTap: function() {
    log("onCancelTap");
    this.setState(0);
  },

  onEditTap: function() {
    log("onEditTap");
    this.setState(1);
  },

  onAddTap: function() {
    log("onAddTap");
    //this.setState(2);
    wx.navigateTo({
      url: '../search/search',
    })
  },

  onDeleteTap: function() {
    log("onDeleteTap");
    //TODO: add confirm dialog

    wx.showModal({
      title: '',
      content: 'Delete Clock Selected?',
      confirmText: "Delete",
      cancelText: "Cancel",
      success: res => {
          if (res.confirm) {
            let cities = this.data.cities;
            let remainedCities = [];
            cities.filter(city => {
              if(!city.checked) {
                remainedCities.push(city);
              }
            });
            this.reloadCities(remainedCities);
            this.saveCities(remainedCities);
            //change state
            this.setState(0);
          } else {
              log("User cancel deleting.");
          }
      }
    });
  },

  setState: function(newState) {
    log("setState, new:" + newState + " old:" + this.data.state);
    this.setData({
      state : newState
    })
  },
})



function buildDayLabel(nowTime, offset) {
  let date = new Date(nowTime);
  let hours = date.getHours() + offset;
  if (hours < 0) {
    return "Yesterday";
  } else if (hours > 24) {
    return "Tomorrow";
  } else {
    return "Today";
  }
}

function buildHourLabel(offset) {
  if (offset == 0) {
    return "Local Time";
  } else if (offset < 0) {
    return -offset + " hrs bebind";
  } else {
    return offset + " hrs ahead";
  }
}

function processCityList(cityList) {
  //console.log(res.data);
  let now = new Date();
  //console.log(util.formatTime(now));
  let cities = cityList;
  cities.forEach(function (city) {
    city.displayName = util.toTitleCase(city.displayName);
    //calculate time
    let [localDate, timezoneOffset] = DSTUtil.localDateForCity(city, now);
    city.localTimeStr = util.formatTime(localDate, false);
    city.dayLabel = buildDayLabel(now.getTime(), timezoneOffset);
    city.hourLabel = buildHourLabel(timezoneOffset);
  });
  return cities;
}

