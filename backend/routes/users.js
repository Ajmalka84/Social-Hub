const router = require("express").Router();
const { verify } = require("../middlewares/middleware");
const {
  updateUser,
  deleteUser,
  searchUser,
  getaUser,
  getFriends,
  follow,
  unfollow,
  profileEdit,
  updateProfilePic,
  updateCoverPic,
} = require("../Controllers/UserControllers");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


//update user
router.put("/:id", verify, updateUser);

//delete user
router.delete("/:id", verify, deleteUser);

// search User
router.post("/search", verify, searchUser);

//get user
router.get("/:id", verify, getaUser);

// get friends
router.get("/friends/:userId", verify, getFriends);

//follow user
router.put("/:id/follow", verify, follow);

//unfollow user
router.put("/:id/unfollow", verify, unfollow);

// Edit User
router.post("/user", verify,  profileEdit); 

// Edit Users Profile Picture
router.post("/profile-picture", verify, upload.single('profilePicture') ,  updateProfilePic ); 

// Edit Users Cover Picture
router.post("/cover-picture", verify, upload.single('coverPicture') ,  updateCoverPic ); 

module.exports = router;
