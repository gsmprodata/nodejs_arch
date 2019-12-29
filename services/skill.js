import modelsPg from "../models_sql";
const pagination = require("../helpers/pagination_helper");
const serviceRequired = require("../helpers/service_require");
const httpCodes = serviceRequired.httpCodes;
const Op = serviceRequired.sequelizeOp;
const ResponseSchema = require("../helpers/helper_class/response_schema");

const getAsycnAllSkills = async() => {
    let response = new ResponseSchema();

    try{
        let result = await modelsPg.Skill.findAll({attributes : ["skillName", "id"]});
        response.status_code = httpCodes.OK;
        response.result = result;
    }
    catch(err){
        response.result = err;
        response.status_code = httpCodes.METHOD_FAILURE;
    }

    return response;
};

const getAsyncSkillsByName = async(skillName, pageNumber, pageSize) => {
    
    let response = new ResponseSchema();
    let pageDetails =  pagination.getPagintionDetails(pageNumber, pageSize);

    try{
        let result = await modelsPg.Skill.findAll({
            attributes : ["skillName", "id"],
            where: {
                skillname: {
                    [Op.iLike] : `${skillName}%`
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

const addAsyncSkills = async(skillName, userId) => {
    
    let response = new ResponseSchema();

    try{
        let skill = {
            skillname : skillName
        };
        let skillResult = await modelsPg.Skill.create(skill);
        if (skillResult!== undefined){
            response.result = `skill added Successfuly with skill -- ${skillResult.id}` ;
            response.status_code = httpCodes.OK;
        }
        else{
            response.result = "Skill not added";
            response.status_code = httpCodes.FORBIDDEN;
        }
    }
    catch(err){
        response.result = err;
        response.status_code = httpCodes.METHOD_FAILURE;
    }

    return response;
};

const getAsyncUserSkills = async(userId) => {
    let response = new ResponseSchema();

    try{
        let result = await modelsPg.UserSkill.findAll({
            include: [{
                model : modelsPg.Skill,
                attributes : ["skillName"],
                required : true
            }],
            attributes : ["skillId", "id"],
            where: {
                userid : userId,
                isactive : true  
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

const addAsyncUserSkills = async(skillId, userId) => {
    let response = new ResponseSchema();

    try{
        let paramSkills = `{${skillId.join(",")}}`;
        let result = await modelsPg.sequelize.query(`CALL usp_addupdateuserskills('${userId}', '${paramSkills}')`,
        {  type: modelsPg.sequelize.QueryTypes.SELECT });
        if (result!== undefined && result.length > 0 && result[0].ischanged === true){
            response.result = result[0].succesmsg;
            response.status_code = httpCodes.OK;
        }
        else{
            response.result = "skill not added";
            response.status_code = httpCodes.FORBIDDEN;
        }
    }
    catch(err){
        response.result = err;
        response.status_code = httpCodes.METHOD_FAILURE;
    }

    return response;
};

module.exports = {
    getAsycnAllSkills,
    getAsyncSkillsByName,
    addAsyncSkills,
    getAsyncUserSkills,
    addAsyncUserSkills
};