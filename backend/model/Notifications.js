const mongoose = require("mongoose");
const NotificationSchema = new mongoose.Schema(
  {
    text :{
        type : String, 
        max : 50 
    },
    userId : {
        type : String
    },
    status : {
        type : String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", NotificationSchema);
