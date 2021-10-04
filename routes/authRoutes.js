const express = require("express");
const {
  signup,
  signin,
  signout,
  forgotPassword,
  resetPassword,
  socialLogin,
} = require("../controllers/authController");
const { userById } = require("../controllers/userController");
const {
  userSignupValidator,
  passwordResetValidator,
} = require("../validators/index");

const router = express.Router();

router.post("/signup", userSignupValidator, signup);
router.post("/signin", signin);
router.get("/signout", signout);
router.put("/forgot-password", forgotPassword);
router.put("/reset-password", passwordResetValidator, resetPassword);
router.post("/social-login", socialLogin);

//any route containing userId, our app will execute userById()
router.param("userId", userById);

module.exports = router;
