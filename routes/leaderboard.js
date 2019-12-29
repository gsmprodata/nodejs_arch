const router = require("express").Router();

/**
 * Fake Data
 */


  const fakeLeaderBoard = [
    {
      position: 1,
      name: "Michael",
      points: 900
    },
    {
      position: 2,
      name: "Sarah",
      points: 800
    },
    {
      position: 3,
      name: "Jason",
      points: 700
    },
    {
      position: 4,
      name: "Ghosh",
      points: 500
    }
  ].sort();
  

router.route("/").get((req, res) => {
    res.json(fakeLeaderBoard);
  });

module.exports = router;