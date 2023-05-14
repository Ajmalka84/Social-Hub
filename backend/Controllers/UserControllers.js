const {
  createAccessToken,
  createRefreshToken,
  verify,
  modifyPayload,
} = require("../middlewares/middleware");
const User = require("../model/User");
const post = require("../model/Post");
const notifications = require("../model/Notifications");
const Conversation = require("../model/Conversation");
const Message = require("../model/Message");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config(); // if this line of code is put below client , client wont work
const serviceID = process.env.TWILIO_serviceID;
const accountSID = process.env.TWILIO_accountSID;
const authToken = process.env.TWILIO_token;
const client = require("twilio")(accountSID, authToken);
let refreshTokens = [];
const crypto = require("crypto");
const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  req,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const Post = require("../model/Post");
const s3_bucket_name = process.env.S3_BUCKET_NAME;
const s3_region = process.env.S3_REGION;
const s3_access_key = process.env.S3_ACCESS_KEY;
const s3_secret_key = process.env.S3_SECRET_KEY;
const s3 = new S3Client({
  credentials: {
    accessKeyId: s3_access_key,
    secretAccessKey: s3_secret_key,
  },
  region: s3_region,
});

module.exports = {
  register: async (req, res) => {
    let { username, email, mobile, password } = req.body;
    try {
      // genSalt is for making the password complex
      const salt = await bcrypt.genSalt(10);
      let hashedPassword = await bcrypt.hash(password, salt);
      const newUser = await new User({
        username: username,
        email: email,
        mobile: mobile,
        password: hashedPassword,
        isAdmin: false,
      });
      // saves the newUser into the database and converts user objects into json
      const user = await newUser.save();
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  checkMobileandEmail: async (req, res) => {
    let { email, mobile } = req.body;
    await User.findOne({
      $or: [{ email: email }, { mobile: mobile }],
    })
      .then((result) => {
        if (result == null) {
          res.status(200).json({ status: false });
        } else {
          res.status(200).json({ status: true });
        }
      })
      .catch((error) => {
        res.status(500).json(error);
      });
  },

  login: async (req, res) => {
    try {
      let user = await User.findOne({ email: req.body.email, blocked: false });
      if (!user) {
        return res.status(400).json("user not found");
      }

      let validatePassword = bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!validatePassword) {
        return res.status(400).json("wrong password");
      }
      const payload = user._doc;
      const accessToken = createAccessToken(payload);
      const refreshToken = createRefreshToken(payload);
      refreshTokens.push(refreshToken);
      res.cookie("refreshToken", refreshToken, {
        // httpOnly: true,
        withCredentials: true,
        expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      });
      const userDetails = { accessToken: accessToken };

      res.json(userDetails);
    } catch (error) {
      res.json(error);
    }
  },

  forgotPassword: async (req, res) => {
    try {
      let { mobile } = req.body;
      const newMobile = mobile.slice(-10);
      let user = await User.findOne({ mobile: newMobile });
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  resetPassword: async (req, res) => {
    const { mobile, password } = req.body;
    const newMobile = mobile.slice(-10);
    const salt = await bcrypt.genSalt(10);
    let hashedPassword = await bcrypt.hash(password, salt);
    await User.findOneAndUpdate(
      { mobile: newMobile },
      { $set: { password: hashedPassword } }
    )
      .then((result) => {
        res.status(200).json("password changed successfully");
      })
      .catch((error) => {
        res.status(500).json(error);
      });
  },

  refresh: (req, res) => {
    //take the refresh token from the user
    const refreshToken = req.cookies.refreshToken;
    // send error if there is no token or its invalid
    if (!refreshToken) return res.status(401).json("You are not authenticated");
    if (!refreshTokens.includes(refreshToken)) {
      return res.status(403).json("Refresh token is not valid");
    }
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET_KEY,
      async (error, payload) => {
        if (error) {
          refreshTokens = refreshTokens.filter(
            (token) => token !== refreshToken
          );
          return res.status(403).json("refreshToken is not valid");
        }
        const newPayload = modifyPayload(payload);
        const newAccessToken = createAccessToken(newPayload);
        res.status(200).json({ accessToken: newAccessToken });
      }
    );
    //if everything is ok, create new access and refresh token, then send it to user
  },

  createPost: async (req, res) => {
    try {
      if (req.file) {
        const imagename = (bytes = 32) =>
          crypto.randomBytes(bytes).toString("hex");
        const imageName = imagename();

        const params = {
          Bucket: s3_bucket_name,
          Key: imageName,
          Body: req.file.buffer,
          ContentType: req.file.mimetype,
        };
        const command = new PutObjectCommand(params);
        await s3.send(command);

        const newPost = new post({
          userId: req.body.userId,
          desc: req.body.desc,
          img: imageName,
        });
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
      } else {
        const newPost = new post({
          userId: req.body.userId,
          desc: req.body.desc,
        });
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },

  updatePost: async (req, res) => {
    try {
      const findPost = await post.findById(req.body.postId);
      if (findPost.userId === req.body.userId) {
        const editPost = await post.findByIdAndUpdate(req.body.postId, {
          desc: req.body.desc,
        });
        res.status(200).json(editPost);
      } else {
        res.status(401).json("you are not Authorised to edit the post");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },

  allPosts: async (req, res) => {
    try {
      const posts = await post.find({ blocked: false }).sort({ createdAt: -1 });
      for (const post of posts) {
        post._doc.userDetails = await User.findOne({ _id: post._doc.userId });
        const comments = post._doc.comments;
        if (comments.length >= 0) {
          for (const comment of comments) {
            comment.userDetails = await User.findOne({ _id: comment.userId });
            const downloadParams3 = {
              Bucket: s3_bucket_name,
              Key: comment?.userDetails?.profilePicture,
            };
            if (comment.userDetails.profilePicture != undefined) {
              const command3 = new GetObjectCommand(downloadParams3);
              const url3 = await getSignedUrl(s3, command3, {
                expiresIn: 600000,
              });
              comment.userDetails._doc.url3 = url3;
            }
          }
        }
        const downloadParams = {
          Bucket: s3_bucket_name,
          Key: post?._doc.img,
        };
        const downloadParams2 = {
          Bucket: s3_bucket_name,
          Key: post?._doc.userDetails?.profilePicture,
        };
        if (
          post._doc.userDetails.profilePicture == undefined &&
          post.img == undefined
        ) {
          continue;
        }
        if (post.img != undefined) {
          const command = new GetObjectCommand(downloadParams);
          const url = await getSignedUrl(s3, command, { expiresIn: 600000 });
          post._doc.url = url;
        }
        if (post._doc.userDetails.profilePicture != undefined) {
          const command2 = new GetObjectCommand(downloadParams2);
          const url2 = await getSignedUrl(s3, command2, { expiresIn: 600000 });
          post._doc.userDetails._doc.url2 = url2;
        }
      }

      res.status(200).json(posts);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  reportPost: async (req, res) => {
    try {
      const checkReportPost = await post.findById(req.params.id);
      if (checkReportPost.reports.includes(req.body.reportedUser)) {
        res.status(200).json({ message: "Cannot Report Twice" });
      } else {
        const reportPost = await post.findByIdAndUpdate(req.params.id, {
          $push: { reports: req.body.reportedUser },
        });
        res.status(200).json(reportPost);
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },

  deletePost: async (req, res) => {
    try {
      const deletePost = await post.findById(req.params.id);
      if (req.body.userId == deletePost.userId) {
        const deletedPost = await deletePost.deleteOne();
        res.status(200).json("Your post deleted succesfully");
      } else {
        res.status(403).json("you can only delete your post");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },

  deletePostComment: async (req, res) => {
    try {
      const deleteComment = await post.findById(req.params.id);
      if (
        req.body.postOwner == deleteComment.userId ||
        deleteComment.comments.some({ userId: req.body.req.body.commentOwner })
      ) {
        const deletedComment = await post.findByIdAndUpdate(req.params.id, {
          $pull: {
            comments: {
              userId: req.body.commentOwner,
              text: req.body.text,
              time: req.body.time,
            },
          },
        });
        res.status(200).json("Your Comment deleted succesfully");
      } else {
        res.status(403).json("you can only delete your post");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },

  likePost: async (req, res) => {
    try {
      const likePost = await post.findById(req.params.id);
      if (!likePost.likes.includes(req.body.userId)) {
        await likePost
          .updateOne({ $push: { likes: req.body.userId } })
          .then(async (result) => {
            await User.findById(req.body.userId).then(async (result) => {
              const newNotifications = new notifications({
                text: `${result.username} and ${likePost.likes.length} other people liked your post`,
                userId: likePost.userId,
                status: "Unread",
              });
              const savedNotifications = await newNotifications.save();
            });
          });
        res.status(200).json({ status: true, message: "liked the post" });
      } else {
        await likePost
          .updateOne({ $pull: { likes: req.body.userId } })
          .then(async (result) => {
            await User.findById(req.body.userId).then(async (result) => {
              const newNotifications = new notifications({
                text: `${result.username} disliked your post`,
                userId: likePost.userId,
              });
              const savedNotifications = await newNotifications.save();
            });
          });
        res.status(200).json({ status: false, message: "disliked" });
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },

  commentPost: async (req, res) => {
    try {
      const commentPost = await post.findById(req.params.id);
      await commentPost
        .updateOne({
          $push: {
            comments: {
              userId: req.body.userId,
              text: req.body.comment,
              time: Date.now(),
            },
          },
        })
        .then(async (result) => {
          const updatedPost = await post.findById(req.params.id);
          await User.findById(req.body.userId).then(async (result) => {
            const newNotifications = new notifications({
              text: `${result.username} commented on your post`,
              userId: updatedPost.userId,
              status: "Unread",
            });
            const savedNotifications = await newNotifications.save();
          });

          res.status(200).json(updatedPost);
        });
    } catch (error) {
      res.status(500).json(error);
    }
  },

  getaPost: async (req, res) => {
    try {
      const Post = await post.findById(req.params.id);
      res.status(200).json(Post);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  timeline: async (req, res) => {
    //the route should include something other than timeline because as /:id has already been given this timeline will go to that root. instead of avoiding that we should give something other than that.
    try {
      const currentUser = await User.findById(req.params.userId);
      const currentUserPosts = await post
        .find({ userId: req.params.userId, blocked: false })
        .sort({ _id: -1 });
      for (const currentUserPost of currentUserPosts) {
        currentUserPost._doc.userDetails = await User.findOne({
          _id: currentUserPost._doc.userId,
        });
        const comments = currentUserPost._doc.comments;
        if (comments.length >= 0) {
          for (const comment of comments) {
            comment.userDetails = await User.findOne({ _id: comment.userId });
            const downloadParams3 = {
              Bucket: s3_bucket_name,
              Key: comment?.userDetails?.profilePicture,
            };
            if (comment.userDetails.profilePicture != undefined) {
              const command3 = new GetObjectCommand(downloadParams3);
              const url3 = await getSignedUrl(s3, command3, {
                expiresIn: 600000,
              });
              comment.userDetails._doc.url3 = url3;
            }
          }
        }
        const downloadParams = {
          Bucket: s3_bucket_name,
          Key: currentUserPost?._doc.img,
        };
        const downloadParams2 = {
          Bucket: s3_bucket_name,
          Key: currentUserPost?._doc.userDetails?.profilePicture,
        };
        if (
          currentUserPost._doc.userDetails.profilePicture == undefined &&
          currentUserPost.img == undefined
        ) {
          continue;
        }
        if (currentUserPost.img != undefined) {
          const command = new GetObjectCommand(downloadParams);
          const url = await getSignedUrl(s3, command, { expiresIn: 600000 });
          currentUserPost._doc.url = url;
        }
        if (currentUserPost._doc.userDetails.profilePicture != undefined) {
          const command2 = new GetObjectCommand(downloadParams2);
          const url2 = await getSignedUrl(s3, command2, { expiresIn: 600000 });
          currentUserPost._doc.userDetails._doc.url2 = url2;
        }
      }
      // const friendsPost = await Promise.all(
      //   currentUser.followings.map((friendId) => {
      //     return post.find({ userId: friendId });
      //   })
      // );
      res.json(currentUserPosts);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  updateUser: async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
      if (req.body.password) {
        try {
          const salt = await bcrypt.genSalt(10);
          req.body.password = await bcrypt.hash(req.body.password, salt);
        } catch (error) {
          return res.status(500).json(error);
        }
      }
      try {
        const user = await User.findByIdAndUpdate(req.params.id, {
          $set: req.body,
        }); //without , after req.body error 500 is happening why?? and if comma is removed and line ending semi colon is put then error is gone
        res.status(200).json("account updated succesfully");
      } catch (error) {
        res.status(500).json(error);
      }
    } else {
      res.status(403).json("you can only update your account");
    }
  },

  deleteUser: async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
      try {
        const user = await User.findByIdAndDelete(req.params.id);
        res.status(200).json("account deleted succesfully");
      } catch (error) {
        res.status(500).json(error);
      }
    } else {
      res.status(403).json("you can only update your account");
    }
  },

  searchUser: async (req, res) => {
    try {
      const searchResult = await User.find({
        username: new RegExp(`${req.body.query}`, "i"),
      }).limit(5);
      res.status(200).json(searchResult);
    } catch (error) {
      res.status(500).json(error.message);
    }
  },

  checkIfBlocked: async (req, res) => {
    try {
      const checkBlock = await User.findById(req.params.id);
      if (checkBlock.Blocked === true) {
        res.status(200).json({ Blocked: true });
      } else {
        res.status(200).json({ Blocked: false });
      }
    } catch (error) {
      res.status(500).json(error.message);
    }
  },

  getaUser: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);

      if (user?._doc?.profilePicture) {
        const downloadParams = {
          Bucket: s3_bucket_name,
          Key: user.profilePicture,
        };
        const command = new GetObjectCommand(downloadParams);
        const url = await getSignedUrl(s3, command, { expiresIn: 600000 });
        user._doc.url = url;
      }
      if (user?._doc?.coverPicture) {
        const downloadParams1 = {
          Bucket: s3_bucket_name,
          Key: user.coverPicture,
        };
        const command1 = new GetObjectCommand(downloadParams1);
        const url1 = await getSignedUrl(s3, command1, { expiresIn: 600000 });
        user._doc.url1 = url1;
      }
      res.status(200).json(user._doc);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  getMainUser: async (req, res) => {
    await User.findOne({ _id: req.params.id })
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((error) => {
        res.status(500).json(error);
      });
  },

  getFriends: async (req, res) => {
    try {
      const user = await User.findById(req.params.userId);
      const friends = await Promise.all(
        user.followings.map(async (friendId) => {
          const friend = await User.findById(friendId.userId);
          if (friend?._doc?.profilePicture) {
            const downloadParams = {
              Bucket: s3_bucket_name,
              Key: friend?.profilePicture,
            };
            const command = new GetObjectCommand(downloadParams);
            const url = await getSignedUrl(s3, command, { expiresIn: 600000 });
            friend._doc.url = url;
          }
          return friend;
        })
      );
      let friendList = [];
      friends.map((friend) => {
        friendList.push(friend);
      });
      res.status(200).json(friendList);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  follow: async (req, res) => {
    if (req.body.userId !== req.params.id) {
      try {
        const currentuser = await User.findByIdAndUpdate(req.body.userId);
        const otheruser = await User.findByIdAndUpdate(req.params.id);
        if (!currentuser.followings.includes(req.params.id)) {
          await currentuser.updateOne({
            $push: { followings: { userId: req.params.id } },
          });
          await otheruser.updateOne({
            $push: { followers: { userId: req.body.userId } },
          });

          await User.findById(req.params.id).then(async (result) => {
            const newNotifications = new notifications({
              text: `${currentuser.username} is following you`,
              userId: result._id,
              status: "Unread",
            });
            const savedNotifications = await newNotifications.save();
          });

          res.status(200).json("its success");
        } else {
          res.status(403).json("already followed");
        }
      } catch (error) {
        res.status(500).json(error);
      }
    } else {
      res.status(403).json("you cannot follow your own account");
    }
  },

  unfollow: async (req, res) => {
    if (req.body.userId !== req.params.id) {
      try {
        const currentuser = await User.findByIdAndUpdate(req.body.userId);
        const otheruser = await User.findByIdAndUpdate(req.params.id);
        if (
          currentuser.followings.some(
            (following) => following.userId === req.params.id
          )
        ) {
          await currentuser.updateOne({
            $pull: { followings: { userId: req.params.id } },
          });
          await otheruser.updateOne({
            $pull: { followers: { userId: req.body.userId } },
          });
          res.status(200).json("its success");
        } else {
          res.status(403).json("to be followed");
        }
      } catch (error) {
        res.status(500).json(error);
      }
    } else {
      res.status(403).json("you cannot follow your own account");
    }
  },

  newConversation: async (req, res) => {
    const newConversation = new Conversation({
      members: [req.body.senderId, req.body.recieverId],
    });
    try {
      const savedConversation = await newConversation.save();
      res.status(200).json(savedConversation);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  getAConversation: async (req, res) => {
    try {
      const conversation = await Conversation.find({
        members: {
          $in: [req.params.userId],
        },
      });
      res.status(200).json(conversation);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  createConversation: async (req, res) => {
    try {
      const conversation = await Conversation.findOne({
        members: {
          $all: [req.params.firstUserId, req.params.secondUserId],
        },
      });
      res.status(200).json(conversation);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  newMessage: async (req, res) => {
    try {
      const newMessage = new Message(req.body.message);
      const checkConversation = await Conversation.findById(
        req.body.message.conversationId
      );
      const userIds = req.body.onlineUsers.map((user) => user.userId);
      const isPresent = userIds.some((userId) =>
        checkConversation.members.includes(userId)
      );
      const otherUserId = checkConversation.members.filter(
        (user) => user !== req.body.message.sender
      );
      if (!isPresent) {
        const currentUser = await User.findById(req.body.message.sender);
        await User.findById(otherUserId[0]).then(async (result) => {
          const newNotifications = new notifications({
            text: `${currentUser.username} send a message to you`,
            userId: otherUserId[0],
            status: "Unread",
          });
          const savedNotifications = await newNotifications.save();
        });
      }
      const savedMessage = await newMessage.save();
      res.status(200).json(savedMessage);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  getMessages: async (req, res) => {
    try {
      const Messages = await Message.find({
        conversationId: req.params.conversationId,
      });
      res.status(200).json(Messages);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  profileEdit: async (req, res) => {
    try {
      const { username, email, password, bio } = req.body;
      const salt = await bcrypt.genSalt(10);
      let hashedPassword = await bcrypt.hash(password, salt);
      const result = await User.findByIdAndUpdate(req.body.userId, {
        username: username,
        email: email,
        password: hashedPassword,
        desc: bio,
      });
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  updateProfilePic: async (req, res) => {
    try {
      if (req.file) {
        const imagename = (bytes = 32) =>
          crypto.randomBytes(bytes).toString("hex");
        const imageName = imagename();

        const params = {
          Bucket: s3_bucket_name,
          Key: imageName,
          Body: req.file.buffer,
          ContentType: req.file.mimetype,
        };
        const command = new PutObjectCommand(params);
        await s3.send(command);

        await User.findByIdAndUpdate(req.body.userId, {
          profilePicture: imageName,
        }).then((result) => {
          res.status(200).json(result);
        });
      } else {
        res.status(200).json("not done anything");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },

  updateCoverPic: async (req, res) => {
    try {
      if (req.file) {
        const imagename = (bytes = 32) =>
          crypto.randomBytes(bytes).toString("hex");
        const imageName = imagename();

        const params = {
          Bucket: s3_bucket_name,
          Key: imageName,
          Body: req.file.buffer,
          ContentType: req.file.mimetype,
        };
        const command = new PutObjectCommand(params);
        await s3.send(command);

        await User.findByIdAndUpdate(req.body.userId, {
          coverPicture: imageName,
        }).then((result) => {
          res.status(200).json(result);
        });
      } else {
        res.status(200).json("not done anything");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },

  getProfilePic: async (req, res) => {
    try {
      const user = await User.findOne({ _id: req.body.userId });
      const downloadParams = {
        Bucket: s3_bucket_name,
        Key: user?.profilePicture,
      };
      if (user._doc.profilePicture != undefined) {
        const command = new GetObjectCommand(downloadParams);
        const url = await getSignedUrl(s3, command, { expiresIn: 600000 });
        user._doc.url = url;
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  getNotifications: async (req, res) => {
    try {
      const userNotifications = await notifications
        .find({ userId: req.params.userId })
        .sort({ _id: -1 });
      res.status(200).json(userNotifications);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  markNotification: async (req, res) => {
    try {
      const userNotifications = await notifications.findByIdAndUpdate(
        req.params.notificationId,
        { $set: { status: "Read" } }
      );
      res.status(200).json(userNotifications);
    } catch (error) {
      res.status(500).json(error);
    }
  },
};
