export default (sequelize, DataTypes) => {
    const UserCity = sequelize.define("user_city", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT
      },
      userId: {
        type : DataTypes.STRING,
        unique : true,
      },
      isActive: {
        type : DataTypes.BOOLEAN,
        allowNull: false
      }
    });
    UserCity.associate = (models) => {
      UserCity.belongsTo(models.City, {
        foreignKey: "cityId",
      });
    };
  
    return UserCity;
};