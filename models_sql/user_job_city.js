export default (sequelize, DataTypes) => {
    const UserJobCity = sequelize.define("user_job_city", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT
      },
      userId: {
        type : DataTypes.STRING,
        unique : "uniqueuserjobcity",
      },
      isActive: {
        type : DataTypes.BOOLEAN,
        allowNull: false
      }
    });
    UserJobCity.associate = (models) => {
        UserJobCity.belongsTo(models.City, {
        foreignKey: {
            name : "cityId",
            unique : "uniqueuserjobcity"
        },
      });
    };
  
    return UserJobCity;
};