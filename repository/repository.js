

const KEY_CITIES = "city_list"; //for storage


const loadCities = () => {
  return wx.getStorageSync(KEY_CITIES) || []
}

const saveCities = (cities) => {
  wx.setStorageSync(KEY_CITIES, cities);
}

const saveCity = (city) => {
  let cities = loadCities();
  cities.push(city);
  saveCities(cities);
}

const findCityByGeonameId = (geonameId) => {
  let cities = loadCities();
  cities.filter( city => {
    return city.geonameId == geonameId;
  });
  //should be only one
  return cities.length == 0 ? null : cities[0];
}

module.exports = {
  loadCities: loadCities,
  saveCities: saveCities,
  saveCity: saveCity
}