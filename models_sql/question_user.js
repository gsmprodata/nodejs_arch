export default (sequelize, DataTypes) => {
    const QuestionUser = sequelize.define("question_user", {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.BIGINT
        },
        optionsChoosed: {
            type: DataTypes.ARRAY(DataTypes.BIGINT)
        },
        answer: {
            type: DataTypes.STRING
        }
    });
    QuestionUser.associate = (models) => {
        QuestionUser.belongsTo(models.Question, {
          foreignKey: "questionId",
        });
        QuestionUser.belongsTo(models.Test, {
            foreignKey: "testId",
        });
      };
  
    return QuestionUser;
};