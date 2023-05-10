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
        process.env.AdminJwtSecret,
        { expiresIn: "5h" }
      );
      res.status(200).json({ adminToken: adminToken });
    } else {
      res.status(400).json({ message: "invalid email or password" });
    }
  },

  AdminGetUsers: async (req, res) => {
    try {
      console.log("its here in admin")
      const AllUsers = await User.find({});
      const AllPosts = await Post.find({});
      res.status(200).json(AllUsers);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  AdminGetAllDetails: async (req, res) => {
    try {
      let dashboardDetails = {} ;
      const getAlldetails = await User.find({});
      const getAllPosts = await Post.find({});
      dashboardDetails.totalUsers = getAlldetails.length;
      dashboardDetails.blockedUsers = getAlldetails.filter((b) => {
        return b.blocked === true;
      }).length;
      dashboardDetails.activeUsers = dashboardDetails.totalUsers - dashboardDetails.blockedUsers;
      dashboardDetails.totalPosts = getAllPosts.length;
      dashboardDetails.blockedPosts = getAllPosts.filter((b) => {
        return b.blocked === true;
      }).length;
      dashboardDetails.activePosts = dashboardDetails.totalPosts - dashboardDetails.blockedPosts;
      dashboardDetails.lastFiveUsers = await User.find({}).sort({ _id: -1 }).limit(5);
      await User.aggregate([
        { $match: { blocked: false } },
        {
          $addFields: {
            month: { $month: "$createdAt" },
          },
        },
        {
          $group: {
              _id: '$month',count:{$sum:1},
          }
        },
      ]).then((result) => {
        dashboardDetails.graphDetails = result
      });
      res.status(200).json(dashboardDetails)
    } catch (error) {
      res.status(500).json(error);
    }
  },

  AdminBlockOrunblock: async (req, res) => {
    try {
      const getUser = await User.findOne({ _id: req.body.userId });
      if (getUser.blocked) {
        const userUpdate = await User.findOneAndUpdate(
          { _id: req.body.userId },
          { $set: { blocked: false } }
        );
        res.status(200).json(userUpdate);
      } else {
        const userUpdate = await User.findOneAndUpdate(
          { _id: req.body.userId },
          { $set: { blocked: true } }
        );
        res.status(200).json(userUpdate);
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },

  AdminBlockOrunblockPost: async (req, res) => {
    try {
     
      const getPosts = await Post.findOne({ _id: req.body.postId });
      if (getPosts.blocked) {
        const postUpdate = await Post.findOneAndUpdate(
          { _id: req.body.postId },
          { $set: { blocked: false } }
        );
        res.status(200).json(postUpdate);
      } else {
        const postUpdate = await Post.findOneAndUpdate(
          { _id: req.body.postId },
          { $set: { blocked: true } }
        );
        res.status(200).json(postUpdate);
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },

  AdminGetPosts: async (req, res) => {
    try {
      const allPosts = await Post.find({});
      const reportedPosts = allPosts.filter((post) => {
        if (post.reports.length >= 2) {
          return post;
        }
      });
      res.status(200).json(reportedPosts);
    } catch (error) {
      res.status(500).json(error);
    }
  },
};
