const express = require("express");
const {
  getPosts,
  createPost,
  postsByUser,
  postById,
  isPoster,
  deletePost,
  updatePost,
  postPhoto,
  singlePost,
  like,
  unlike,
  comment,
  uncomment,
} = require("../controllers/postController");
const { createPostValidator } = require("../validators/index");
const { requireSignin } = require("../controllers/authController");
const { userById } = require("../controllers/userController");

const router = express.Router();

router.get("/posts", getPosts);
router.post(
  "/post/new/:userId",
  requireSignin,
  createPost,
  createPostValidator
);

//like unlike
router.put("/post/like", requireSignin, like);
router.put("/post/unlike", requireSignin, unlike);
router.put("/post/comment", requireSignin, comment);
router.put("/post/uncomment", requireSignin, uncomment);

router.get("/posts/by/:userId", requireSignin, postsByUser);
router.delete("/post/:postId", requireSignin, isPoster, deletePost);
router.put("/post/:postId", requireSignin, isPoster, updatePost);
router.get("/post/:postId", singlePost);

//any route containing userId, our app will execute userById()
router.param("userId", userById);
//any route containing :postI=Id, our app will execute postById()
router.param("postId", postById);
router.get("/post/photo/:postId", postPhoto);

module.exports = router;
