export default (sequelize, DataTypes) => {
    const Test = sequelize.define("test", {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.BIGINT
            },
        corporateId: {
            type: DataTypes.STRING,
        },
        score: {
            type: DataTypes.INTEGER,
        },
    });
    Test.associate = (models) => {
        Test.belongsTo(models.UserCorporate, {
          foreignKey: "usercorporateid",
        });
        Test.belongsTo(models.Skill, {
            foreignKey: "skillId",
          });
      };
  
    return Test;
};