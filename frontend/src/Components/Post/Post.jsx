import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import "./Post.css";
import { MoreVert } from "@mui/icons-material";
import { format } from "timeago.js";
import Options from "../Options/Options";
import Comments from "../Comments/Comments";
import AxiosWithAuth from "../../Axios/Axios";
import jwtDecode from "jwt-decode";
// import { Users } from "../../dummy";

function Post({ profilePicture, post, setPosts }) {
  const axiosJWT = AxiosWithAuth();
  const { Auth } = useContext(AuthContext);
  const decodedAuth = jwtDecode(Auth.accessToken)
  const [like, setLike] = useState(post.likes.length);
  const [click , setClick] = useState(1)
  const likeHandler = async (e) => {
    e.preventDefault();
    await axiosJWT
      .put(`post/${post._id}/like`, {
        userId: decodedAuth._id,
      })
      .then((result) => {
        if (!result.data.status) {
          setLike(prev => prev - 1);
        } else {
          setLike(prev => prev + 1);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const [opt, setOpt] = useState(false);
  const [comment, setComment] = useState(false);
  const Option = () => {
    if(click === 1){
      setOpt(true);
      setClick(prev => prev+1)
    }else{
      setOpt(false);
      setClick(prev => prev-1)
    }
  };
  const comments = () => {
    if(click === 1){
      setComment(true);
      setClick(prev => prev+1)
    }else{
      setComment(false);
      setClick(prev => prev-1)
    }
  };
  return (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            {/* <img src={Users.filter((u)=>u.id === post.userId)[0].profilePicture} alt="shareImg" className="postProfileImg"/> */}
            {post?.userDetails?.profilePicture ? <img src={post?.userDetails?.url2 } alt="shareImg" className="postProfileImg" /> : <img src="/assets/NoPhoto.jpg" alt="shareImg" className="postProfileImg" />}
            
            <span className="postUsername">
              {post?.userDetails?.username ? post?.userDetails?.username : "some error"}
            </span>
            <span className="postDate">{format(post?.createdAt)}</span>
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
              src={post?.url ? post.url : ""}
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
              {post?.comments?.length > 0 ? post?.comments?.length : "No"} Comment
            </span>
          </div>
        </div>
        {comment ? <Comments post={post} setPosts={setPosts} profilePicture={profilePicture} /> : ""}
      </div>
    </div>
  );
}

export default Post;

// connect to mongodb in nodejs
