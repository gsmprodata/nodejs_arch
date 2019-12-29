export default (sequelize, DataTypes) => {
    const State = sequelize.define("state", {
      state_name: {
        type: DataTypes.STRING,
        unique: true,
      },
    });
  
    return State;
};