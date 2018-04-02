const logUtil = require('../utils/log.js');
const utils = require('../utils/util.js');

const CONTENT_TYPE_KEY = "Content-Type";
const CONTENT_TYPE_JSON = "application/json";

let debug = true;


const log = (fmt, ...args) => {
  if (debug) {
    logUtil(fmt, ...args);
  }
}

const COMMON_HEADER = {
  CONTENT_TYPE_KEY: CONTENT_TYPE_JSON
}

//TODO: wrap some error class, which include error code / error message
//TODO: wrap some response class, which include HTTP statusCode, data and headers

const post = (url, data, completion) => {
  log("send post request, url:{0}, data:{1}", url, data);

  // wx.showLoading({
  //   title : "Loading",
  //   mask: true
  // });

  let header = COMMON_HEADER; 

  wx.request({
    method: 'POST',
    url: url,
    data: data,
    header: header,
    success: res => {
      log("response, statusCode:{0}, header:{1}, data:{2}", res.statusCode, res.header, res.data);
      if (res.statusCode != 200) {
        let errorMsg = utils.sprintf("Error Response, Status Code:{0}", res.statusCode);
        completion(null, errorMsg);
        return;
      }
      //check header
      let contentType = res.header[CONTENT_TYPE_KEY];
      if (contentType == null || contentType.search(CONTENT_TYPE_JSON) == -1) {
        let errorMsg = utils.sprintf("Error Response, Wrong Content-Type:{0}", contentType);  
        completion(null, errorMsg);
        return;
      }
      
      //TODO: check if data is json format
      completion(res.data, null);
      

    },
    fail: res => {
      log("request failed:{0}", res);
      // wx.showToast({
      //   title: 'Request Timeout',
      //   icon: 'loading',
      //   duration: 2000
      // });
      completion(null, res);
      
    },
    complete: () => {
      log("request complete");
    }
  });
}

module.exports = {
  debug: debug,
  post : post
}