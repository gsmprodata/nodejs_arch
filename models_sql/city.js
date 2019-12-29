export default (sequelize, DataTypes) => {
    const City = sequelize.define("city", {
      city_name: {
        type : DataTypes.STRING,
        unique : false,
      },
      city_code: {
          type : DataTypes.STRING,
          unique : true
      }
    });
  
    City.associate = (models) => {
      City.belongsTo(models.State, {
        foreignKey: "stateId",
      });
    };
    
    return City;
};