const router = require("express").Router();
const { newMessage, getMessages } = require("../Controllers/UserControllers");

// Add
router.post("/", newMessage);

// Get
router.get("/:conversationId", getMessages);

module.exports = router;
