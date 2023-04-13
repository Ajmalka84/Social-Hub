const router = require("express").Router();
const {
  newConversation,
  getAConversation,
} = require("../Controllers/UserControllers");
const { verify } = require("../middlewares/middleware");

// new conversation
router.post("/", verify, newConversation);

// get conversation of a user
router.get("/:userId", verify, getAConversation);

module.exports = router;
