

const KEY_CITIES = "city_list"; //for storage


const loadCities = () => {
  return wx.getStorageSync(KEY_CITIES);
}

const saveCities = (cities) => {
  wx.setStorageSync(KEY_CITIES, cities);
}

const saveCity = (city) => {
  let cities = loadCities();
  cities.push(city);
  saveCities(cities);
}


module.exports = {
  loadCities: loadCities,
  saveCities: saveCities,
  saveCity: saveCity
}