export default (sequelize, DataTypes) => {
    const QuestionType = sequelize.define("question_type", {
      description: {
        type: DataTypes.STRING,
        unique: true,
      },
    });
  
    return QuestionType;
};