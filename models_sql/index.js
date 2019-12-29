require("dotenv").config();
import Sequelize from "sequelize";

const sequelize = new Sequelize(process.env.PG_DB_NAME, process.env.PG_USER_NAME, process.env.PG_PASSWORD, {
  host : process.env.PG_HOST,
  port : process.env.PG_PORT,
  dialect: process.env.PG_DIALECT,
  quoteIdentifiers : false
});

const models = {
  State : sequelize.import("./state.js"),
  City : sequelize.import("./city.js"),
  UserCity: sequelize.import("./usercity.js"),
  UserJobCity : sequelize.import("./user_job_city.js"),
  Skill : sequelize.import("./skills.js"),
  UserSkill : sequelize.import("./user_skills.js"),
  QuestionType : sequelize.import("./question_type.js"),
  Question : sequelize.import("./question.js"),
  Option : sequelize.import("./option.js"),
  AnswerKey : sequelize.import("./answer_key.js"),
  QuestionCorporate: sequelize.import("./question_corporate.js"),
  UserCorporate : sequelize.import("./user_corporates.js"),
  Test : sequelize.import("./test.js"),
  QuestionUser : sequelize.import("./question_user.js")
};

Object.keys(models).forEach((modelName) => {
  if ("associate" in models[modelName]) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;

export default models;
module.exports.Sequelize = sequelize;