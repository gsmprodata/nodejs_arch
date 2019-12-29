export default (sequelize, DataTypes) => {
    const UserCorporate = sequelize.define("user_corporate", {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.BIGINT
            },
        corporateId: {
            type: DataTypes.STRING,
            unique : "uniqueusercorporate"
        },
        userId: {
            type: DataTypes.STRING,
            unique : "uniqueusercorporate"
        },
    });
  
    return UserCorporate;
};