import locationService from "../services/location";
import JWT_Claims from "../helpers/jwt_claims";
import routerAsyncWrap from "../helpers/async_wrapper";

const getAsyncAllStates = routerAsyncWrap( async(req, res, next) =>{
    let states = await locationService.getAsyncAllStates();
    res.json(states);
});

const getAsyncCities = routerAsyncWrap( async(req, res, next) =>{
    let stateId = req.params.stateId;
    let cities = await locationService.getAsyncAllCities(stateId);
    res.json(cities);
});

const getAsyncCitiesByName = routerAsyncWrap( async(req, res, next) =>{
    let cityName = req.body.cityName;
    let PageNumber = req.body.PageNumber;
    let pageSize = req.body.pageSize;

    let cities = await locationService.getAsyncCitiesByName(cityName, PageNumber, pageSize);
    res.json(cities);
});

const getAsyncCitiesByNameForState = routerAsyncWrap( async(req, res, next) =>{
    let cityName = req.body.cityName;
    let PageNumber = req.body.PageNumber;
    let pageSize = req.body.pageSize;
    let stateId = req.body.stateId;

    let cities = await locationService.getAsyncCitiesByNameForState(cityName, stateId, PageNumber, pageSize);
    res.json(cities);
});

const addUserCity = routerAsyncWrap( async(req, res, next) => {
    let cityId = req.body.cityId;
    let userId = JWT_Claims.getUserIdFromToken(req);

    let result = await locationService.addAsyncUserCity(cityId, userId);
    res.json(result);
});

const addUpdateUserCity =  routerAsyncWrap( async(req, res, next) => {
    let cityId = req.body.cityId;
    let userId = JWT_Claims.getUserIdFromToken(req);

    let result = await locationService.addUpdateAsyncUserCity(cityId, userId);
    res.json(result);
});

const addUpdateUserJobCity =  routerAsyncWrap( async(req, res, next) => {
    let cityId = req.body.cityId;
    let userId = JWT_Claims.getUserIdFromToken(req);

    let result = await locationService.addUpdateAsyncUserJobCity(cityId, userId);
    res.json(result);
});

const addUpdateUserJobCityList = routerAsyncWrap( async(req, res, next) => {
    let cityIds = req.body.cityIds;
    let userId = JWT_Claims.getUserIdFromToken(req);

    let result = await locationService.addUpdateAsyncUserJobCityList(cityIds, userId);
    res.json(result);
});

const getUserCity = routerAsyncWrap( async(req, res, next) =>{
    let userId = JWT_Claims.getUserIdFromToken(req);
    let cities = await locationService.getAsyncUserCity(userId);
    res.json(cities);
});

const getUserJobCity = routerAsyncWrap( async(req, res, next) =>{
    let userId = JWT_Claims.getUserIdFromToken(req);
    let cities = await locationService.getAsyncUserJobCity(userId);
    res.json(cities);
});

module.exports = {
    getAsyncAllStates,
    getAsyncCities,
    getAsyncCitiesByName,
    getAsyncCitiesByNameForState,
    addUserCity,
    addUpdateUserCity,
    addUpdateUserJobCity,
    addUpdateUserJobCityList,
    getUserJobCity,
    getUserCity
};