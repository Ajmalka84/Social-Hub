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
  getProfilePic,
  getMainUser,
  getNotifications,
  markNotification,
  checkIfBlocked,
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

//get user
router.get("/check/:id", checkIfBlocked);

//get main user for rightbar profile
router.get("/get-main-user/:id", verify, getMainUser);

// get friends
router.get("/friends/:userId", verify, getFriends);

// get the users notifications
router.get("/:userId/get-notifications", verify , getNotifications );

// mark as read notifications
router.get("/:notificationId/read", verify , markNotification );

//follow user
router.put("/:id/follow", verify, follow);

//unfollow user
router.put("/:id/unfollow", verify, unfollow);

// Edit Users Profile Details
router.post("/profile-edit", verify,  profileEdit ); 

// Edit Users Profile Picture
router.post("/profile-picture", verify, upload.single('profilePicture') ,  updateProfilePic ); 

// Edit Users Cover Picture
router.post("/cover-picture", verify, upload.single('coverPicture') ,  updateCoverPic ); 

// get the users profile picture
router.post("/get-profile-picture", verify,  getProfilePic ); 



module.exports = router;
