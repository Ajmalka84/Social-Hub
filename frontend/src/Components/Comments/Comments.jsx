import axios from "axios";
import React, { useContext, useRef, useState } from "react";
import "./Comments.css";
import { format } from "timeago.js";
import { AuthContext } from "../../context/AuthContext";
import AxiosWithAuth from "../../Axios/Axios";
import jwtDecode from "jwt-decode";

const Comments = ({ post, setPosts }) => {
  console.log(post)
  const axiosJWT = AxiosWithAuth();
  const { Auth } = useContext(AuthContext);
  const decodedAuth = jwtDecode(Auth.accessToken);
  const [currentPost, setCurrentPost] = useState();
  const commentInput = useRef();
  const submitComment = async () => {
    await axiosJWT
      .put(`post/${post._id}/comment`, {
        comment: commentInput.current.value,
        userId: decodedAuth._id,
      })
      .then(async (result) => {
        await axiosJWT.get("post/all-posts").then((allposts) => {
          setPosts([...allposts.data]); 
        });
       setCurrentPost(result.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="comments">
      <div className="write">
      {post?.comments?.userDetails?.profilePicture ? <img src={post.comments.userDetails.url3} alt="" className="img" /> : <img src="/assets/NoPhoto.jpg" alt="shareImg" className="postProfileImg" />}
        
        <input type="text" ref={commentInput} placeholder="write a comment" />
        <button onClick={submitComment}>Send</button>
      </div>
      {post.comments.map((comment) => (
        <div className="comment">
          { comment?.userDetails?.profilePicture ? <img src={ comment.userDetails.url3} alt="" className="img" /> : <img src="/assets/NoPhoto.jpg" alt="shareImg" className="postProfileImg" />}
          
          <div className="info">
            <span>{comment.userDetails.username}</span>
            <p>{comment.text}</p>
          </div>
          <span className="date">{format(comment.time)}</span>
        </div>
      ))}
    </div>
  );
};

export default Comments;
