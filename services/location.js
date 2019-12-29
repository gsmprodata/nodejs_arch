import modelsPg from "../models_sql";
const pagination = require("../helpers/pagination_helper");
const serviceRequired = require("../helpers/service_require");
const httpCodes = serviceRequired.httpCodes;
const Op = serviceRequired.sequelizeOp;
const ResponseSchema = require("../helpers/helper_class/response_schema");

const getAsyncAllStates = async() => {
    let response = new ResponseSchema();

    try{
        let result = await modelsPg.State.findAll({attributes : ["state_name", "id"]});
        response.status_code = httpCodes.OK;
        response.result = result;
    }
    catch(err){
        response.result = err;
        response.status_code = httpCodes.METHOD_FAILURE;
    }

    return response;
};

const getAsyncAllCities = async(stateId) => {
    let response = new ResponseSchema();

    try{
        let result = await modelsPg.City.findAll({
            attributes : ["city_name", "id"],
            where: {
                stateId: stateId
              }
            });
        response.status_code = httpCodes.OK;
        response.result = result;
    }
    catch(err){
        response.result = err;
        response.status_code = httpCodes.METHOD_FAILURE;
    }
    
    return response;
};

const getAsyncCitiesByName = async(cityName, pageNumber, pageSize) => {
    
    let response = new ResponseSchema();
    let pageDetails =  pagination.getPagintionDetails(pageNumber, pageSize);

    try{
        let result = await modelsPg.City.findAll({
            attributes : ["city_name", "id"],
            where: {
                city_name: {
                    [Op.iLike] : `${cityName}%`
                }
            },
            offset : pageDetails.offset,
            limit : pageDetails.limit
        });
        response.status_code = httpCodes.OK;
        response.result = result;
    }
    catch(err){
        response.result = err;
        response.status_code = httpCodes.METHOD_FAILURE;
    }

    return response;
};

const getAsyncCitiesByNameForState = async(cityName, stateId, pageNumber, pageSize) => {
    
    let response = new ResponseSchema();
    let pageDetails =  pagination.getPagintionDetails(pageNumber, pageSize);

    try{
        let result = await modelsPg.City.findAll({
            attributes : ["city_name", "id"],
            where: {
                city_name: {
                    [Op.iLike] : `${cityName}%`
                },
                stateId : stateId
            },
            offset : pageDetails.offset,
            limit : pageDetails.limit
        });
        response.status_code = httpCodes.OK;
        response.result = result;
    }
    catch(err){
        response.result = err;
        response.status_code = httpCodes.METHOD_FAILURE;
    }

    return response;
};

const addAsyncUserCity = async(cityId, userId) => {
    
    let response = new ResponseSchema();

    try{
        let user = {
            userId : userId,
            cityId : cityId,
            isActive : true
        };
        let userCity = await modelsPg.UserCity.create(user);
        if (userCity!== undefined){
            response.result = `User added Successfuly with userCityId -- ${userCity.id}` ;
            response.status_code = httpCodes.OK;
        }
        else{
            response.result = "User not added";
            response.status_code = httpCodes.FORBIDDEN;
        }
    }
    catch(err){
        response.result = err;
        response.status_code = httpCodes.METHOD_FAILURE;
    }

    return response;
};

const findExistsUserCity = async(cityId, userId) => {
    let result = {
        ucExists : false,
        isActive : false
    };
    try{
        let data = await modelsPg.UserCity.findOne({
            limit: 1,
            attributes : ["isActive", "id", "cityId"],
            where : {
                userId : userId
            }
            });
        if(data !== undefined){
            result = {
                ucExists : true,
                isActive : data.isActive,
                ucId : data.id,
                userCityData : data
            };
        }
        else{
            result = {
                ucExists : false
            };
        }
    }
    catch(err){
        result = {
            ucExists : false
        };
    }
    return result;
};

const UpdateUserCity = async(cityId, data, isCityChanged) => {
    let result = {};
    let response = {};
    let params = {isActive : true};
    try{
        if(isCityChanged === true){
            params.cityId = cityId;
        }
        result = await data.update(params);

        if(result !== undefined){
            response.result = `User updated Successfuly with userCityId -- ${result.id}` ;
            response.status_code = httpCodes.OK;
        }
        else{
            response.result = "UserCity not updated";
            response.status_code = httpCodes.FORBIDDEN;
        }
        
    }
    catch(err){
        response.result = `Exception occured ---- ${err}`;
        response.status_code = httpCodes.FORBIDDEN;
    }
    return response;
};

const addUpdateAsyncUserCity = async(cityId, userId) => {
    
    let response = new ResponseSchema();

    try{
        let data  = await findExistsUserCity(cityId, userId);

        if(data.ucExists !== undefined && data.ucExists === true){

            if(data.isActive === false){
                if(data.userCityData.cityId != cityId){
                    response = await UpdateUserCity(cityId, data.userCityData, true);
                }else{
                    response = await UpdateUserCity(cityId, data.userCityData, false);
                }
            }
            else{
                if(data.userCityData.cityId != cityId){
                    response = await UpdateUserCity(cityId, data.userCityData, true);
                }
                else{
                    response.result = "no update required";
                    response.status_code = httpCodes.CONFLICT;
                }
            }
        }
        else{
            let user = {
                userId : userId,
                cityId : cityId,
                isActive : true
            };
            let userCity = await modelsPg.UserCity.create(user);

            if (userCity!== undefined){
                response.result = `User added Successfuly with userCityId -- ${userCity.id}` ;
                response.status_code = httpCodes.OK;
            }
            else{
                response.result = "User not added";
                response.status_code = httpCodes.FORBIDDEN;
            }
        }
    }
    catch(err){
        response.result = err;
        response.status_code = httpCodes.METHOD_FAILURE;
    }

    return response;
};

const findUserJobCity = async(cityId, userId) => {
    let result = {
        isExists : false
    };
    try{
        let data = await modelsPg.UserJobCity.findOne({
            limit: 1,
            attributes : ["isActive", "id", "cityId"],
            where : {
                userId : userId,
                cityId : cityId
            }
            });
        if(data !== undefined){
            result = {
                isExists : true,
                isActive : data.isActive,
                Id : data.id,
                userCityJobData : data
            };
        }
    }
    catch(err){
        result = {
            isExists : false
        };
    }
    return result;
};

const UpdateUserJobCity = async(data) => {
    let result = {};
    let response = {};
    let params = {isActive : true};
    try{
        result = await data.update(params);

        if(result !== undefined){
            response.result = `User updated Successfuly with userCityJobId -- ${result.id}` ;
            response.status_code = httpCodes.OK;
        }
        else{
            response.result = "UserJobCity not updated";
            response.status_code = httpCodes.FORBIDDEN;
        }
        
    }
    catch(err){
        response.result = `Exception occured ---- ${err}`;
        response.status_code = httpCodes.FORBIDDEN;
    }
    return response;
};

const addUpdateAsyncUserJobCity = async(cityId, userId) => {
    
    let response = new ResponseSchema();

    try{
        let data  = await findUserJobCity(cityId, userId);

        if(data.isExists === true){
            if(data.isActive === false){
                response = await UpdateUserJobCity(data.userCityJobData);
            }
            else{
                response.result = "no update required";
                response.status_code = httpCodes.CONFLICT;
            }
        }
        else{
            let user = {
                userId : userId,
                cityId : cityId,
                isActive : true
            };
            let userCity = await modelsPg.UserJobCity.create(user);

            if (userCity!== undefined){
                response.result = `User added Successfuly with userJobCityId -- ${userCity.id}` ;
                response.status_code = httpCodes.OK;
            }
            else{
                response.result = "UserJobCity not added";
                response.status_code = httpCodes.FORBIDDEN;
            }
        }
    }
    catch(err){
        response.result = err;
        response.status_code = httpCodes.METHOD_FAILURE;
    }

    return response;
};

const addUpdateAsyncUserJobCityList = async(cityIds, userId) => {
    let response = new ResponseSchema();

    try{
        let paramCity = `{${cityIds.join(",")}}`;
        let result = await modelsPg.sequelize.query(`CALL usp_AddUpdateUserJobCities('${userId}', '${paramCity}')`,
        {  type: modelsPg.sequelize.QueryTypes.SELECT });
        if (result!== undefined && result.length > 0 && result[0].ischanged === true){
            response.result = result[0].succesmsg;
            response.status_code = httpCodes.OK;
        }
        else{
            response.result = "User not added";
            response.status_code = httpCodes.FORBIDDEN;
        }
    }
    catch(err){
        response.result = err;
        response.status_code = httpCodes.METHOD_FAILURE;
    }

    return response;
};

const getAsyncUserCity = async(userId) => {
    let response = new ResponseSchema();

    try{
        let result = await modelsPg.UserCity.findAll({
            include: [{
                model : modelsPg.City,
                attributes : ["city_name"],
                required : true
            }],
            attributes : ["cityid", "id"],
            where: {
                userid : userId,
                isactive : true 
            },
        });
        response.status_code = httpCodes.OK;
        response.result = result;
    }
    catch(err){
        response.result = err;
        response.status_code = httpCodes.METHOD_FAILURE;
    }

    return response;
};

const getAsyncUserJobCity = async(userId) => {
    let response = new ResponseSchema();

    try{
        let result = await modelsPg.UserJobCity.findAll({
            include: [{
                model : modelsPg.City,
                attributes : ["city_name"],
                required : true
            }],
            attributes : ["cityid", "id"],
            where: {
                userid : userId,
                isactive : true  
            },
        });
        response.status_code = httpCodes.OK;
        response.result = result;
    }
    catch(err){
        response.result = err;
        response.status_code = httpCodes.METHOD_FAILURE;
    }

    return response;
};


module.exports = {
    getAsyncAllStates,
    getAsyncAllCities,
    getAsyncCitiesByName,
    getAsyncCitiesByNameForState,
    addAsyncUserCity,
    addUpdateAsyncUserCity,
    addUpdateAsyncUserJobCity,
    addUpdateAsyncUserJobCityList,
    getAsyncUserJobCity,
    getAsyncUserCity
};