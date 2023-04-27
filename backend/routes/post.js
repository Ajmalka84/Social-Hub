const router = require("express").Router();
const {
  createPost,
  allPosts,
  updatePost,
  deletePost,
  likePost,
  commentPost,
  getaPost,
  timeline,
  reportPost,
} = require("../Controllers/UserControllers");
const { verify } = require("../middlewares/middleware");
const multer = require("multer");
const storage = multer.memoryStorage();  //validations to do 
const fileFilter = (req, file, cb) => {
  // Allow only image and video files
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" 
  ) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type"), false);
  }
};
const upload = multer({ storage: storage, fileFilter: fileFilter });

//create a post
router.post("/create", verify, upload.single("img"), createPost);

// get all the posts
router.get("/all-posts", verify, allPosts);

//update a post
router.put("/:id/update", verify, updatePost);

//report a post
router.put("/:id/report", verify, reportPost);

//delete a post
router.delete("/:id/delete", verify, deletePost);

//like a post
router.put("/:id/like", verify, likePost);

//like a post
router.put("/:id/comment", verify, commentPost);

//get a post
router.get("/:id", verify, getaPost);

//get timeline posts
router.get("/timeline/:userId", verify, timeline);
  
module.exports = router;
