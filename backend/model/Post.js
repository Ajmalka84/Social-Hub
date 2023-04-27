const mongoose = require("mongoose");
const postSchema = new mongoose.Schema(
  {
    userId : {
        type: String,
        required : true
    },
    desc: {
      type: String,
      max: 500,
    },
    img:{
        type: String
    },
    likes: {
        type: Array,
        default: []
    },
    comments : {
      type : Array, 
      default : []
    },
    reports : {
      type : Array, 
      default : []
    },
    blocked : {
      type : Boolean, 
      default : false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
