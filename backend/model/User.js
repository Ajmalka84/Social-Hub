const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      require: true,
      min: 3,
      max: 20,
    },
    email: {
      type: String,
      require: true,
      max: 50,
      unique : true
    },
    mobile : {
      type: Number,
      require: true,
      unique : true
    },
    password: {
      type: String,
      require: true,
      min: 3,
    },
    profilePicture: {
      type: String,
    },
    coverPicture: {
      type: String,
    },
    followers: {
      type: Array,
      dafault: [],
    },
    followings: {
      type: Array,
      dafault: [],
    },
    isAdmin: {
      type: Boolean,
      dafault: false,
    },
    desc: {
      type: String,
      max: 50,
    },
    city: {
      type: String,
      max: 50,
    },
    from: {
      type: String,
      max: 50,
    },
    relationship: {
      type: Number,
      enum: [1, 2, 3],
    },
    blocked : {
      type: Boolean,
      default : false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Users", userSchema);
