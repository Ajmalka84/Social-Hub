const router = require("express").Router()
const jwt = require("jsonwebtoken");
const { AdminLogin, AdminGetUsers, AdminBlockOrunblock, AdminGetPosts, AdminGetAllDetails, AdminBlockOrunblockPost } = require("../Controllers/AdminControllers");
const { adminVerify } = require("../middlewares/middleware");

//Admin Login
router.post('/login' ,  AdminLogin )

//Admin get all users
router.get('/users' ,adminVerify, AdminGetUsers )

//Admin get all users details for homepage
router.get('/all-details' ,adminVerify, AdminGetAllDetails )

//admin block user
router.post('/block' ,adminVerify, AdminBlockOrunblock )

//admin block user
router.post('/block-Post' ,adminVerify, AdminBlockOrunblockPost )

//admin reported posts
router.get('/reportedPosts' , adminVerify , AdminGetPosts )


module.exports = router; 