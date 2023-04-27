const router = require("express").Router()
const jwt = require("jsonwebtoken");
const { AdminLogin, AdminGetUsers, AdminBlockOrunblock, AdminGetPosts } = require("../Controllers/AdminControllers");

//Admin Login
router.post('/login' , AdminLogin )

//Admin get all users
router.get('/users' , AdminGetUsers )

//admin block user
router.post('/block' , AdminBlockOrunblock )

//admin reported posts
router.get('/reportedPosts' , AdminGetPosts )


module.exports = router; 