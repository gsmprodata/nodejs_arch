const router = require("express").Router();

router.route("/*").get((req, res) => {
  res.sendFile(require("path").join(__dirname + "/../client/build/index.html"));
});

module.exports = router;
