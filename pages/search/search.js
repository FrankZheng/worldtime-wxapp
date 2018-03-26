// pages/search/search.js
const SEARCH_API_URL = 'https://xqlabserv.com/api/searchCityByFuzzyName';


const app = getApp();


Page({

  data: {
    inputShowed: false,
    inputVal: "",
    searchResult: []
  },
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    let inputVal = e.detail.value;
    this.setData({
      inputVal: inputVal
    });

    //TODO: send api to search

  }
})