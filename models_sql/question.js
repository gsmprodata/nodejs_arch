export default (sequelize, DataTypes) => {
    const Question = sequelize.define("question", {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.BIGINT
            },
        questionDescription: {
            type: DataTypes.STRING,
            unique : "uniquequestion"
        },
    });
    Question.associate = (models) => {
        Question.belongsTo(models.QuestionType, {
          foreignKey: "questionTypeId",
          unique : "uniquequestion"
        });
        Question.belongsTo(models.Skill, {
            foreignKey: "skillId",
            unique : "uniquequestion"
          });
      };
  
    return Question;
};