// pages/search/search.js
const log = require('../../utils/log.js');
const util = require('../../utils/util.js');
const repo = require('../../repository/repository.js');
const requests = require('../../network/requests.js');

const searchCityByFuzzyName = requests.searchCityByFuzzyName;

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

    if(inputVal.length == 0) {
      return;
    }

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
    // net.post(SEARCH_API_URL, {
    //   name: name
    // }, data => {
    //   log("get search result: {0}", data);
    //   let result = processSearchResult(data);
    //   log("result is {0}", result);
    //   this.setData({
    //     searchResult : result
    //   });
    // }, e => {
    //   log("failed to search city by {0}", name);
    // });
    searchCityByFuzzyName({
      name: name
    }, (data, error) => {
      if(error) {
        log("failed to search city by {0}", name);
      } else {
        log("get search result: {0}", data);
        let result = processSearchResult(data);
        log("result is {0}", result);
        this.setData({
          searchResult : result
        });
      }
    })
  },

  onSearchResultItemTap: function(e) {
    let index = e.currentTarget.dataset.index;
    let city = this.data.searchResult[index];
    log("select {0}, {1}", index, city);
    if (!city.added) {
      repo.saveCity(city);
      wx.navigateBack(); 
    }
  }

});


const processSearchResult = result => {
  let savedCities = repo.loadCities();
  //log("savedCities, {0}", savedCities);

  result.forEach( city => {
    //process city fields
    city.displayName = util.toTitleCase(city.displayName);

    let geonameId = city.geonameId;
    let finded = savedCities.filter ( savedCity => {
      return savedCity.geonameId == geonameId;
    });
    if (finded.length > 0) {
      city.added = true;
    } else {
      city.added = false;
    }
  });
  return result;
};


