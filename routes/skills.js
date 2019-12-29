const router = require("express").Router();
const skillController = require("../controllers/skill");

router
  .route("/getSkills")
  .get( skillController.getAllSkills);

  router
  .route("/getSkillsByName")
  .post(skillController.getSkillsByName);

  router
  .route("/addSkill")
  .post(skillController.addSkill);

  router
  .route("/getUserSkills")
  .get(skillController.getUserSkill);

  router
  .route("/addUserSkill")
  .post(skillController.addUserSkills);


  module.exports = router;
