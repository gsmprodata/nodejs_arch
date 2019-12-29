export default (sequelize, DataTypes) => {
    const AnswerKey = sequelize.define("answer_key", {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.BIGINT
            }
    });
    AnswerKey.associate = (models) => {
        AnswerKey.belongsTo(models.Question, {
          foreignKey: "questionId",
        });
        AnswerKey.belongsTo(models.Option, {
            foreignKey: "opionId",
          });
      };
  
    return AnswerKey;
};