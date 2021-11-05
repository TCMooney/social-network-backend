const express = require("express");
const {
  userById,
  allUsers,
  getUser,
  updateUser,
  deleteUser,
  userPhoto,
  addFollower,
  addFollowing,
  removeFollower,
  removeFollowing,
  findPeople,
  hasAuthorization,
} = require("../controllers/userController");
const { requireSignin } = require("../controllers/authController");

const router = express.Router();

router.get("/users", allUsers);
router.get("/user/:userId", requireSignin, getUser);
router.put("/user/:userId", requireSignin, hasAuthorization, updateUser);
router.delete("/user/:userId", requireSignin, hasAuthorization, deleteUser);
router.get("/user/photo/:userId", userPhoto);
router.put("/users/follow", requireSignin, addFollowing, addFollower);
router.put("/users/unfollow", requireSignin, removeFollowing, removeFollower);
router.get("/users/findpeople/:userId", requireSignin, findPeople);
router.param("userId", userById);

module.exports = router;
