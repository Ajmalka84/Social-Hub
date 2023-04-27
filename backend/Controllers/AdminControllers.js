const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../model/User");
const Post = require("../model/Post");
const adminEmail = process.env.AdminEmail;
const adminPassword = process.env.AdminPassword;

module.exports = {
  AdminLogin: (req, res) => {
    if (req.body.email === adminEmail && req.body.password === adminPassword) {
      const adminToken = jwt.sign(
        { email: adminEmail, password: adminPassword },
        process.env.AdminJwtSecret , {expiresIn : '5h'}
      );
      res.status(200).json({adminToken : adminToken})
    } else {
      res.status(400).json({ message: "invalid email or password" });
    }
  },

  AdminGetUsers : async(req, res)=> {
    try {
        const getUsers = await User.find({})
        res.status(200).json(getUsers)
    } catch (error) {
        res.status(500).json(error)
    }
  },

  AdminBlockOrunblock : async(req, res)=> {
    try {
        console.log("first")
        console.log(req.body)
        const getUser = await User.findOne({_id : req.body.userId})
        console.log(getUser)
        if(getUser.blocked ){
            const userUpdate = await User.findOneAndUpdate({_id : req.body.userId}, {$set : {blocked : false}})
            res.status(200).json(userUpdate)
        }else{
            const userUpdate = await User.findOneAndUpdate({_id : req.body.userId}, {$set : {blocked : true}})
            res.status(200).json(userUpdate)
        }
    } catch (error) {
        res.status(500).json(error)
    }
  },

  AdminGetPosts :async (req, res)=>{
    try {
      console.log("its here")
      const allPosts = await Post.find({})
      console.log(allPosts)
      
      const reportedPosts = allPosts.filter((post) => {
        if(post.reports.length >=2 ){
          return post;
        }
      })
      console.log(reportedPosts)
      res.status(200).json(reportedPosts)
    } catch (error) {
      res.status(500).json(error)     
    }
  }
};
