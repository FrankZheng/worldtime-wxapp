// pages/schedule/schedule.js
const log = require('../../utils/log.js');
const repo = require('../../repository/repository.js');
const util = require('../../utils/util.js');
const DSTUtil = require('../../utils/DSTUtil.js');
const datetime_util = require('./datetime_util');

function formatDate(date) {
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  let timeStr = util.sprintf("{0}/{1}/{2}", 
    util.formatNumber(month),
    util.formatNumber(day),
    util.formatNumber(year));
  return timeStr;
}

function formatTime(date) {
  let hour = date.getHours();
  let minute = date.getMinutes();
  let timeStr = util.sprintf("{0}:{1}", 
    util.formatNumber(hour), 
    util.formatNumber(minute));
  return timeStr;
}

function setUpPickerForCity(city) {
  //for picker
  let localDate = city.pickerDate;
  let year = localDate.getFullYear();
  let month = localDate.getMonth() + 1; //0 start
  let day = localDate.getDate(); // 1 start
  let hour = localDate.getHours(); //1 start
  let minute = localDate.getMinutes(); //1 start
  let [years, months, days, hours, minutes] = [datetime_util.years(year), datetime_util.months, datetime_util.days(year, month), datetime_util.hours, datetime_util.minutes];
  city.dtPickerRange = [years, months, days, hours, minutes];
  city.dtPickerIndex = [0, month-1, day-1, hour, minute];
}


function processCityList(cityList, refreshDate=false, offset=0) {
  let now = new Date();
  let cities = cityList;
  cities.forEach(function (city) {
    city.displayName = util.toTitleCase(city.displayName);
    //calculate time
    if(refreshDate) {
      let [localDate, timezoneOffset] = DSTUtil.localDateForCity(city, now);
      city.localDate = localDate;
    }
    if(offset > 0) {
      city.localDate = new Date(city.localDate.getTime() + offset);
    }
    let localDate = city.localDate;
    city.localDateStr = formatDate(localDate);
    city.localTimeStr = formatTime(localDate);
    city.pickerDate = new Date(localDate.getTime());
    setUpPickerForCity(city);
    city.selected = false;
  });
  return cities;
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cities: []
  },

  selectedIdx: -1,

  onCityItemTap: function (e) {
    let index = e.currentTarget.dataset.index;
    log("onCityItemTap, {0}", index);
    if( index == this.selectedIdx ) {
      return;
    }
    let prevSelected = this.selectedIdx;
    this.selectedIdx = index;

    if(prevSelected >= 0) {
      //clear prev selected
      let city = this.data.cities[prevSelected];
      city.selected = false;
    }
    let city = this.data.cities[index];
    city.selected = true;
    this.setData({cities:this.data.cities});
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    log("onLoad")
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
    log("onShow")
    let cities = processCityList(repo.loadCities(), true);
    this.setData({cities:cities});
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    log("onHide")
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    log("onUnload")
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
  
  },

  bindDatetimeChange: function(e) {
    log("bindDatetimeChange, {0}", e.detail.value);
    let city = this.data.cities[this.selectedIdx];
    let [years, months, days, hours, minutes] = city.dtPickerRange;
    let [yearIdx, month, day, hour, minute] = e.detail.value;
    let year = years[yearIdx];
    let prevDate = city.localDate;
    let updateDate = new Date();
    updateDate.setFullYear(year);
    updateDate.setMonth(month);
    updateDate.setDate(day+1);
    updateDate.setHours(hour);
    updateDate.setMinutes(minute);
    let offset = updateDate.getTime() - prevDate.getTime();
    let cities = processCityList(this.data.cities, false, offset);
    city.selected = true;
    this.setData({cities:this.data.cities});
  },

  bindDatetimeColumnChange: function(e) {
    let column = e.detail.column;
    let value = e.detail.value;
    log("bindDatetimeColumnChange, column:{0} value:{1}", e.detail.column, e.detail.value);
    let city = this.data.cities[this.selectedIdx];
    if (column == 1) {
      //if change month, change days accordingly 
      city.pickerDate.setMonth(value);
      setUpPickerForCity(city);
      this.setData({cities: this.data.cities});
    }

  }

})

