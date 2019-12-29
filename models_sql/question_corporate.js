export default (sequelize, DataTypes) => {
    const QuestionCorporate = sequelize.define("question_corporate", {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.BIGINT
            },
        corporateId: {
            type: DataTypes.STRING,
        },
    });
    QuestionCorporate.associate = (models) => {
        QuestionCorporate.belongsTo(models.Question, {
          foreignKey: "questionId",
        });
      };
  
    return QuestionCorporate;
};