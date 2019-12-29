export default (sequelize, DataTypes) => {
    const Skill = sequelize.define("skill", {
      skillName: {
        type: DataTypes.STRING,
        unique: true,
      },
    });
  
    return Skill;
};