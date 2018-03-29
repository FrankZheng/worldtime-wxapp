
const KEY_DEFAULT_CITIES_LOADED = "default_cities_loaded"; 


const put = (key, value) => {
  wx.setStorageSync(key, value);
}

const get = (key, defaultValue = null) => {
  let value = wx.getStorageSync(key);
  return value == null ? value : defaultValue;
}



module.exports = {
  get defaultCitiesLoaded() {
    return get(KEY_DEFAULT_CITIES_LOADED, false);
  },

  set defaultCitiesLoaded(loaded) {
    put(KEY_DEFAULT_CITIES_LOADED, loaded);
  }
  
}

