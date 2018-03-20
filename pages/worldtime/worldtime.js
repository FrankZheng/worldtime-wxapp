// pages/worldtime/worldtime.js
const util = require('../../utils/util.js')

const DEFAULT_CITY_URL = 'http://localhost:3000/defaultCities';

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
  //console.log(res.data);
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

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cities : []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    wx.request({
      url: DEFAULT_CITY_URL,
      method: 'POST',
      success:function(res) {
        let cities = processCityList(res);
        that.setData({
          cities : cities
        })
      },
      fail:function(err) {
        console.log(err);
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})