import axios from "axios";
import React, { useContext, useRef , useState} from "react";
import "./Comments.css";
import {format} from "timeago.js"
import { AuthContext } from "../../context/AuthContext";
import AxiosWithAuth from "../../Axios/Axios";

const Comments = ({post ,setPosts}) => {
  const axiosJWT = AxiosWithAuth() 
  const {user} = useContext(AuthContext)
  const [currentPost , setCurrentPost] = useState() 
  const commentInput =  useRef()
  const submitComment = async ()=> {
    await axiosJWT.put(`http://localhost:8000/post/${post._id}/comment`, {comment : commentInput.current.value , userId : user._doc._id}).then(async(result)=>{
      await axiosJWT
      .get("http://localhost:8000/post/all-posts"
      )
      .then((allposts) => {
        console.log(allposts.data);
        setPosts([...allposts.data]);
      })
        setCurrentPost(result.data)
    }).catch((error)=>{
        console.log(error)
    })
}
console.log(currentPost)
  
  return (
    <div className="comments">
      <div className="write">
        <img src='' alt="" className="img" />
        <input type="text" ref={commentInput} placeholder="write a comment" />
        <button onClick={submitComment}>Send</button>
      </div>
      {post.comments.map((comment) => (
        <div className="comment">
          <img src='' alt="" className="img"/>
          <div className="info">
            <span>{comment.userId}</span>
            <p>{comment.text}</p>
          </div>
          <span className="date">{format(comment.time)}</span>
        </div>
      ))}
    </div>
  );
};

export default Comments;