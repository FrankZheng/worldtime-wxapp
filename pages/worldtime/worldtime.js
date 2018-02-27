// pages/worldtime/worldtime.js
const util = require('../../utils/util.js')


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
      url: 'http://localhost:5000',
      success:function(res) {
        //console.log(res.data);
        var now = new Date();
        var localTimezoneOffset = now.getTimezoneOffset() / 60;
        console.log(util.formatTime(now));
        var nowTime = now.getTime();
        var cities = res.data;
        cities.forEach(function(city) {
          var timezoneOffset = localTimezoneOffset + city.timezone_offset; //hours
          var localTime = nowTime + timezoneOffset * 60 * 60 * 1000;
          city.localTimeStr = util.formatTime(new Date(localTime));
          city.name = util.toTitleCase(city.name);
          city.dayLabel = "Today";
          city.hourLabel = "16 hrs behind";
        });
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