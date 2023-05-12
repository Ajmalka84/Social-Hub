const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../model/User");
const Post = require("../model/Post");
const adminEmail = process.env.AdminEmail;
const adminPassword = process.env.AdminPassword;
const s3_bucket_name = process.env.S3_BUCKET_NAME;
const s3_region = process.env.S3_REGION;
const s3_access_key = process.env.S3_ACCESS_KEY;
const s3_secret_key = process.env.S3_SECRET_KEY;
const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  req,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const s3 = new S3Client({
  credentials: {
    accessKeyId: s3_access_key,
    secretAccessKey: s3_secret_key,
  },
  region: s3_region,
});

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
      const allPosts = await Post.find({}).sort({_id : -1});
      const newPosts = await Promise.all(
        allPosts.map(async(posts)=>{
          await User.findById(posts.userId).then((result)=>{
            posts._doc.userDetails = result
          })
          
            const downloadParams2 = {
              Bucket: s3_bucket_name,
              Key: posts?._doc.userDetails?.profilePicture,
            };
          const downloadParams = {
            Bucket: s3_bucket_name,
            Key: posts?._doc.img,
          };
          if (posts._doc.userDetails.profilePicture != undefined) {
            const command2 = new GetObjectCommand(downloadParams2);
            const url2 = await getSignedUrl(s3, command2, { expiresIn: 600000 });
            posts._doc.userDetails._doc.url2 = url2;
          }
          if (posts.img != undefined) {
            const command = new GetObjectCommand(downloadParams);
            const url = await getSignedUrl(s3, command, { expiresIn: 600000 });
            posts._doc.url = url;
          }
          return posts
        })
      )
      
      const reportedPosts = newPosts.filter((post) => {
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
