const router = require("express").Router();
const {
  newConversation,
  getAConversation,
  createConversation,
} = require("../Controllers/UserControllers");
const { verify } = require("../middlewares/middleware");

// new conversation
router.post("/", verify, newConversation);

// get conversation of a user
router.get("/:userId", verify, getAConversation);

//get conversation includes two userId
router.get("/find/:firstUserId/:secondUserId", verify, createConversation);


module.exports = router;
