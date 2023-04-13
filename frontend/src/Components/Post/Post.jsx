import axios from "axios";
import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import "./Post.css";
import { MoreVert } from "@mui/icons-material";
import { format } from "timeago.js";
import Options from "../Options/Options";
import Comments from "../Comments/Comments";
import AxiosWithAuth from "../../Axios/Axios";
// import { Users } from "../../dummy";

function Post({ post, setPosts }) {
  const axiosJWT = AxiosWithAuth();
  const { user } = useContext(AuthContext);
  const [like, setLike] = useState(post.likes.length);
  const likeHandler = async (e) => {
    e.preventDefault();
    await axiosJWT
      .put(`http://localhost:8000/post/${post._id}/like`, {
        userId: user._doc._id,
      })
      .then((result) => {
        if (!result.data.status) {
          setLike(like - 1);
        } else {
          setLike(like + 1);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const [opt, setOpt] = useState(false);
  const [comment, setComment] = useState(false);
  const Option = () => {
    setOpt(true);
  };
  const comments = () => {
    setComment(true);
  };
  return (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            {/* <img src={Users.filter((u)=>u.id === post.userId)[0].profilePicture} alt="shareImg" className="postProfileImg"/> */}
            <img src="" alt="shareImg" className="postProfileImg" />
            <span className="postUsername">
              {post?.userId ? post.userId : "Ajmal K A"}
            </span>
            <span className="postDate">{format(post.createdAt)}</span>
          </div>
          <div className="postTopRight">
            <MoreVert onClick={Option} />
            {opt ? <Options post={post} setPosts={setPosts} /> : ""}
          </div>
        </div>
        <div className="postCenter">
          <span className="postText">
            {post?.desc ? post.desc : "No description available"}
          </span>
          {post.url ? (
            <img
              src={post?.url ? post.url : "Ajmal K A"}
              alt="postImg"
              className="postImg"
            />
          ) : (
            ""
          )}
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
            <img
              src="/assets/like.png"
              alt="like"
              className="likeIcon"
              onClick={likeHandler}
            />
            <img
              src="/assets/heart.png"
              alt="heart"
              className="likeIcon"
              onClick={likeHandler}
            />
            <span className="postLikeCounter">{like} people like it</span>
          </div>
          <div className="postBottomRight">
            <span className="postCommentText" onClick={comments}>
              {post?.comment} comments
            </span>
          </div>
        </div>
        {comment ? <Comments post={post} setPosts={setPosts} /> : ""}
      </div>
    </div>
  );
}

export default Post;

// connect to mongodb in nodejs
