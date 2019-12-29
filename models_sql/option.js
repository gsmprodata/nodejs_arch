export default (sequelize, DataTypes) => {
    const Option = sequelize.define("option", {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.BIGINT
            },
        optionDescription: {
            type: DataTypes.STRING,
        },
    });
    Option.associate = (models) => {
        Option.belongsTo(models.Question, {
          foreignKey: "questionId",
        });
      };
  
    return Option;
};