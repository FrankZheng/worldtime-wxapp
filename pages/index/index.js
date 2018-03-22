//index.js
const util = require('../../utils/util.js')

const app = getApp()

const DEFAULT_CITY_URL = 'http://localhost:3000/api/defaultCities';

Page({
  data: {
    topBarState: 0,
    cities: []
  },
  onLoad: function() {
    console.log("onLoad");
    wx.request({
      url: DEFAULT_CITY_URL,
      method: 'POST',
      success: res => {
        let cities = processCityList(res);
        this.setData({
          cities: cities
        })
      },
      fail: function (err) {
        console.log(err);
      }
    })
  },
  onCancelTap: function() {
    console.log("onCancelTap");
    this.setTopBarState(0);
  },
  onEditTap: function() {
    console.log("onEditTap");
    this.setTopBarState(1);
  },
  onAddTap: function() {
    console.log("onAddTap");
    this.setTopBarState(2);
  },
  onDeleteTap: function() {
    console.log("onAddTap");
  },
  setTopBarState: function(newState) {
    console.log("setTopBarState, new:" + newState + " old:" + this.data.topBarState);
    this.setData({
      topBarState : newState
    })
  }
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

function processCityList(res) {
  console.log(res.data);
  let now = new Date();
  let localTimezoneOffset = now.getTimezoneOffset() / 60; //minutes
  //console.log(util.formatTime(now));
  let nowTime = now.getTime();
  let cities = res.data;
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