//index.js
const util = require('../../utils/util.js');
const log = require('../../utils/log.js');

const app = getApp()

//const DEFAULT_CITY_URL = 'http://localhost:3000/api/defaultCities';
const DEFAULT_CITY_URL = 'https://xqlabserv.com/api/defaultCities';

const KEY_CITIES = "city_list"; //for storage
const KEY_DEFAULT_CITIES_LOADED = "default_cities_loaded"; 

Page({
  data: {
    state: 0,
    cities: []
  },
  onLoad: function() {
    log("onLoad");
    if (!wx.getStorageSync(KEY_DEFAULT_CITIES_LOADED)) {
      this.loadDefaultCities(cities => {
        this.reloadCities(cities);
        this.saveCities(cities);
        wx.setStorageSync(KEY_DEFAULT_CITIES_LOADED, true);
      });
    } else {
      let cities = this.loadCities();
      cities = processCityList(cities);
      this.reloadCities(cities);
    }
    
  },

  loadDefaultCities: function(success, fail) {
    log("load default cities from server");
    wx.request({
      url: DEFAULT_CITY_URL,
      method: 'POST',
      success: res => {
        //TOOD: check if res is expected
        //Content-Type
        //status code
        //json format, etc
        let cities = processCityList(res.data);
        success(cities);
      },
      fail: function (err) {
        console.log(err);
        fail();
      }
    });
  },

  saveCities: function(cities) {
    log("saveCities");
    wx.setStorageSync(KEY_CITIES, cities);
  },

  loadCities: function() {
    log("loadCities");
    let cities = wx.getStorageSync(KEY_CITIES);
    return cities;
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
    log("onAddTap");
    let cities = this.data.cities;
    let remainedCities = [];
    cities.filter(city => {
      if(!city.checked) {
        remainedCities.push(city);
      }
    });
    this.reloadCities(remainedCities);
    this.saveCities(remainedCities);
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
  let localTimezoneOffset = now.getTimezoneOffset() / 60; //minutes
  //console.log(util.formatTime(now));
  let nowTime = now.getTime();
  let cities = cityList;
  cities.forEach(function (city) {
    city.name = util.toTitleCase(city.displayName);
    //calculate time
    let timezoneOffset = localTimezoneOffset + city.timezone; //hours
    let localTime = nowTime + timezoneOffset * 60 * 60 * 1000;
    city.localTimeStr = util.formatTime(new Date(localTime));
    city.dayLabel = buildDayLabel(nowTime, timezoneOffset);
    city.hourLabel = buildHourLabel(timezoneOffset);
  });
  return cities;
}

/*
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
*/