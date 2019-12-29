const router = require("express").Router();
const hackathonController = require("../controllers/hackathon");

const fakeData = [
    {
      imgUrl: "https://picsum.photos/300/150",
      title: "Hackathon A",
      shortDesc:
        "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Unde, consequatur.",
      registeredUsers: Math.random() * 1000
    },
    {
      imgUrl: "https://picsum.photos/300/152",
      title: "Hackathon B",
      shortDesc:
        "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Unde, consequatur.",
      registeredUsers: Math.random() * 1000
    },
    {
      imgUrl: "https://picsum.photos/300/151",
      title: "Hackathon C",
      shortDesc:
        "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Unde, consequatur.",
      registeredUsers: Math.random() * 1000
    },
    {
      imgUrl: "https://picsum.photos/300/150",
      title: "Hackathon D",
      shortDesc:
        "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Unde, consequatur.",
      registeredUsers: Math.random() * 1000
    },
    {
      imgUrl: "https://picsum.photos/300/152",
      title: "Hackathon E",
      shortDesc:
        "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Unde, consequatur.",
      registeredUsers: Math.random() * 1000
    },
    {
      imgUrl: "https://picsum.photos/300/151",
      title: "Hackathon F",
      shortDesc:
        "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Unde, consequatur.",
      registeredUsers: Math.random() * 1000
    }
  ];
  
router.route("/").get((req, res) => res.json(fakeData));
router.route("/add").post((req, res) => res.json(req.body));
// router.route("/hackathons").get(hackathonController.getAll); // TODO
// router.route("/hackathons/add").post(hackathonService.create); // TOOD

module.exports = router;