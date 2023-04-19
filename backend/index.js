const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const helmet = require("helmet");
const cookieParser = require('cookie-parser');
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/post");
const conversationsRoute = require("./routes/Conversations");
const messagesRoute = require("./routes/Messages");

dotenv.config();
mongoose.set("strictQuery", true); // for avoiding the strictQuery warning
mongoose.connect(
  process.env.MONGO_URL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("connected to mongodb");
  }
);

app.use(
  cors({
    origin: ["http://localhost:3000"],
    // methods: ["GET", "POST" , "PUT" , "DELETE"],
    credentials: true, 
  })
);

//middleware
app.use(express.json()); //use() accepts 2 arguments. 1st one is the string which is mostly the url. 2nd one is the middleware function which has to work when recieving the request from the specified route. if we havent mentioned the route or 1st argument the 2nd argument works in every request. json() converts every json data that are coming as request into objects which is readable by the server.
app.use(helmet());
app.use(cookieParser());
app.use(morgan("common"));
app.use("/users", userRoute);
app.use("/auth", authRoute);
app.use("/post", postRoute);
app.use("/conversations", conversationsRoute);
app.use("/messages", messagesRoute);
app.listen("8000", () => console.log("server started running on port"));

// service sid for social hub : VAbe3d07efe254eebf5ccdf6c7a4b6abce
 
