// pages/search/search.js
const log = require('../../utils/log.js');
const net = require('../../network/network.js');
const util = require('../../utils/util.js');

const SEARCH_API_URL = 'https://xqlabserv.com/api/searchCityByFuzzyName';

const INPUT_TIMEOUT = 1000; //ms

const app = getApp();

let searchTimer = null;



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
      inputVal: "",
      searchResult: []
    });
  },

  inputTyping: function (e) {
    let inputVal = e.detail.value;
    this.setData({
      inputVal: inputVal
    });

    //TODO: send api to search
    if (searchTimer) {
      clearTimeout(searchTimer);
    }

    searchTimer = setTimeout(()=> {
      log("search timeout");
      this.searchCities(inputVal);
    }, INPUT_TIMEOUT); 

  },

  searchCities: function(name) {
    net.post(SEARCH_API_URL, {
      name: name
    }, data => {
      log("get search result: {0}", data);
      this.setData({
        searchResult : data
      });
    }, e => {
      log("failed to search by {0}", name);
    });
  },

  processSearchResult: function(result) {
    result.forEach()
  } 

})


