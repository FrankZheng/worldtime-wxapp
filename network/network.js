
let debug = false;

const post = (url, data, success, fail) => {
  
  wx.showLoading({
    title : "Loading",
    mask: true
  });
  wx.request({
    url: url,
    data: data,
    header: {
      'Content-Type': 'application/json'
    },
    success: res => {
      if (debug) {
        console.log("network header" );
      }

    },
    fail: res => {
      wx.showToast({
        title: 'Request Timeout',
        icon: 'loading',
        duration: 2000
      });
    },
    complete: () => {

    }
  });
}

module.exports = {
  debug: debug,
  post : post
}