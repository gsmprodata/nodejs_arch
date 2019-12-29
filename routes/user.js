const router = require("express").Router();
const passport = require("passport");
const userController = require("../controllers/user");

router.route("/auth").post(
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login?error=localfailure"
    }),
    (req, res) => {
      res.redirect("/dashboard?provider=local");
    }
  );

router.route("/logout").get(userController.logout);
router.route("/verifyEmail").get(userController.verifyEmail);
router
  .route("/resetPassword")
  .post(userController.sendResetPassword)
  .get(userController.verifyResetPassword);
router.route("/resetPassword/:id").post(userController.resetPassword);
router.route("/update/:id").post(userController.update);
router.route("/register").post(userController.register);
router.route("/invite").post(userController.sendInvite);
router.route("/requestInvite").post(userController.requestInvite);
router
  .route("/users")
  .get(userController.ensureAuthenticated, userController.getAll);
router
  .route("/current")
  .get(userController.ensureAuthenticated, userController.getCurrent);
router.route("/:id").get(userController.getById);
router.route("/resume/:id").get(userController.generateResume);
router
  .route("/deactivate/:id")
  .get(userController.ensureAuthenticated, userController._deactivate);
router
  .route("/:id")
  .delete(userController.ensureAuthenticated, userController._delete);

  module.exports = router;
