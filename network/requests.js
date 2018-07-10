const net = require('./network.js');
const log = require('../utils/log.js');

const PRODUCT_BASER_URL = "https://xqlabserv.com/api/";
const DEV_BASE_URL = "http://localhost:5000/api/";

const DEFAULT_CITIES_URL = "defaultCities";
const SEARCH_CITY_URL = "searchCityByFuzzyName";

const DEFAULT_PAGE_SIZE = 20;
const DEFAULT_PAGE_NUM = 1;

let useDev = false;

const baseURL = () => {
    return useDev ? DEV_BASE_URL : PRODUCT_BASER_URL;
}

const loadDefaultCities = (completion) => {
    if (completion == null) {
        log("MUST pass completion");
        return;
    }
    let url = baseURL() + DEFAULT_CITIES_URL;
    net.post(url, {}, completion);
};


const searchCityByFuzzyName = (params, completion) => {
    if (!params || !params.name ) {
        log("Invalid arguments");
        return;
    }
    if (completion == null) {
        log("MUST pass completion");
        return;
    }

    let url = baseURL() + SEARCH_CITY_URL;
    let data = {
        name : params.name,
        pageNum : params.pageNum || DEFAULT_PAGE_NUM,
        pageSize : params.pageSize || DEFAULT_PAGE_SIZE
    };
    net.post(url, data, completion);
};


module.exports = {
    loadDefaultCities : loadDefaultCities,
    searchCityByFuzzyName : searchCityByFuzzyName,
}




