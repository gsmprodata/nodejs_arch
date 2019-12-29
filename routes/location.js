const router = require("express").Router();
const locationController = require("../controllers/location");

router
  .route("/getStates")
  .get( locationController.getAsyncAllStates);
router
  .route("/getCities/:stateId")
  .get(locationController.getAsyncCities);

router
.route("/getCitiesByName")
.post(locationController.getAsyncCitiesByName);

router
.route("/getCitiesBystate")
.post(locationController.getAsyncCitiesByNameForState);

router
.route("/addUserCity")
.post(locationController.addUserCity);

router
.route("/addUpdateUserCity")
.post(locationController.addUpdateUserCity);

router
.route("/addUpdateUserJobCity")
.post(locationController.addUpdateUserJobCity);

router
.route("/addUpdateUserJobCityList")
.post(locationController.addUpdateUserJobCityList);

router
.route("/getUserCities")
.get(locationController.getUserCity);

router
.route("/getUserJobCities")
.get(locationController.getUserJobCity);

module.exports = router;
