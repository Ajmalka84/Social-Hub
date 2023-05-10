import axios from "axios";
import React, { useContext, useRef, useState } from "react";
import "./Comments.css";
import { format } from "timeago.js";
import { AuthContext } from "../../context/AuthContext";
import AxiosWithAuth from "../../Axios/Axios";
import jwtDecode from "jwt-decode";
import { Toaster, toast } from "react-hot-toast";
import Swal from 'sweetalert2';
const Comments = ({ profilePicture, post, setPosts }) => {
  const axiosJWT = AxiosWithAuth();
  const { Auth } = useContext(AuthContext);
  const decodedAuth = jwtDecode(Auth.accessToken);
  const [currentPost, setCurrentPost] = useState(); 
  const commentInput = useRef();
  
  const submitComment = async () => {
    let string = commentInput.current.value;
    let regex = /^\s*([^\s].*?[^\s])\s*$/;
   
    if (regex.test(string)) {
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
    } else {
      toast.error("Comment is empty");
      console.log("Comment is empty.");
    }
  };
  console.log(post)
  const commentDelete = async(commentOwner ,  commentText, commentTime ) =>{
    const confirmed = await Swal.fire({
      title: 'Are you sure you want to delete this post?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });
    
    if(confirmed.isConfirmed){
      try {
        const res = await axiosJWT.delete(`post/${post._id}/delete-comment` , {data : {commentOwner : commentOwner , postOwner : post.userDetails._id , text : commentText , time : commentTime }})
        console.log(res.data)
        toast.success("comment deleted")
      } catch (error) {
        console.log(error)
      }
    }else{
      console.log("its not deleted")
    }
  }
  return (
    <div className="comments">
      <div className="write">
        {decodedAuth?.profilePicture ? (
          <img src={profilePicture} alt="" className="img" />
        ) : (
          <img
            src="/assets/NoPhoto.jpg"
            alt="shareImg"
            className="postProfileImg"
          />
        )}
        <input
          type="text"
          style={{ marginBottom: "0px" }}
          ref={commentInput}
          placeholder="write a comment"
          required
        />
        <button onClick={submitComment}>Send</button>
      </div>
      {post.comments.map((comment) => (
        <div className="comment">
          {comment?.userDetails?.profilePicture ? (
            <img src={comment.userDetails.url3} alt="" className="img" />
          ) : (
            <img
              src="/assets/NoPhoto.jpg"
              alt="shareImg"
              className="postProfileImg"
            />
          )}
          <Toaster position="bottom-center" reverseOrder={false} />
          <div className="info">
            <span>{comment.userDetails.username}</span>
            <p>{comment.text}</p>
          </div>
          <span className="date">{format(comment.time)}</span>
          <span className="deleteComment" onClick={() => commentDelete(comment.userDetails._id , comment.text , comment.time)}>Delete</span>
        </div>
      ))}
    </div>
  );
};

export default Comments;
