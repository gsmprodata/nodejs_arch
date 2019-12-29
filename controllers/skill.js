import skillService from "../services/skill";
import JWT_Claims from "../helpers/jwt_claims";
import routerAsyncWrap from "../helpers/async_wrapper";

const getAllSkills = routerAsyncWrap( async(req, res, next) =>{
    let skills = await skillService.getAsycnAllSkills();
    res.json(skills);
});

const getSkillsByName = routerAsyncWrap( async(req, res, next) =>{
    let skillName = req.body.skillName;
    let PageNumber = req.body.PageNumber;
    let pageSize = req.body.pageSize;
    let skills = await skillService.getAsyncSkillsByName(skillName, PageNumber, pageSize);
    res.json(skills);
});

const addSkill = routerAsyncWrap( async(req, res, next) =>{
    let skillName = req.body.skillName;
    let result = await skillService.addAsyncSkills(skillName);
    res.json(result);
});

const getUserSkill = routerAsyncWrap( async(req, res, next) =>{
    let userId = JWT_Claims.getUserIdFromToken(req);
    let skills = await skillService.getAsyncUserSkills(userId);
    res.json(skills);
});

const addUserSkills = routerAsyncWrap( async(req, res, next) =>{
    let skillIds = req.body.skillIds;
    let userId = JWT_Claims.getUserIdFromToken(req);
    let result = await skillService.addAsyncUserSkills(skillIds, userId);
    res.json(result);
});

module.exports = {
    getAllSkills,
    getSkillsByName,
    addSkill,
    getUserSkill,
    addUserSkills
};