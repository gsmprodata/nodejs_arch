export default (sequelize, DataTypes) => {
    const UserSkill = sequelize.define("user_skill", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT
      },
      userId: {
        type : DataTypes.STRING,
        unique : "uniqueuserskill",
      },
      isActive: {
        type : DataTypes.BOOLEAN,
        allowNull: false
      }
    });
    UserSkill.associate = (models) => {
        UserSkill.belongsTo(models.Skill, {

        foreignKey: {
            name : "skillId",
            unique : "uniqueuserskill"
        },
      });
    };
  
    return UserSkill;
};