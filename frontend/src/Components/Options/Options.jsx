import React, { useContext, useState } from "react";
import "./Options.css";
import AxiosWithAuth from "../../Axios/Axios";
import { Toaster, toast } from "react-hot-toast";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import { AuthContext } from "../../context/AuthContext";
import jwtDecode from "jwt-decode";

// import RssFeedIcon from '@mui/icons-material/RssFeed';
function Options({ post, setPosts }) {
  const axiosJWT = AxiosWithAuth();
  const {Auth } = useContext(AuthContext)
  const decodedAuth = jwtDecode(Auth.accessToken)
  const [open, setOpen] = useState(false);
  const [inputText , setInputText] = useState(post?.desc ? post.desc : "")
  
  const editPost = async () => {
    setOpen(true);
  };
  
  // console.log(post)
  const editPostModal =async (e)=>{
    e.preventDefault();   
    try {
      const res = await axiosJWT.post('/post/update' ,{postId : post._id , desc : inputText , userId : decodedAuth._id})
      // setTimeout(()=>{toast.success("Post edited successfully")},10)
      const loadPosts = await axiosJWT
      .get("http://localhost:8000/post/all-posts")
      setPosts([...loadPosts.data])
      setOpen(false)
      
    } catch (error) {
      toast.error("Post edit failed")
      console.log(error.message)
    }
  }

  const onCloseModal = () => setOpen(false);
  const deletePost = async () => {
    await axiosJWT
      .delete(`http://localhost:8000/post/${post._id}/delete`, {
        data: { userId: post.userId },
      })
      .then(async (result) => {
        await axiosJWT
          .get("http://localhost:8000/post/all-posts")
          .then((allposts) => {
            setPosts([...allposts.data]);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const reportPost = async () => {
    await axiosJWT
      .put(`post/${post._id}/report`, {reportedUser : decodedAuth._id})
      .then((result) => {
        console.log(result.data);
        if(result.data.message === "Cannot Report Twice"){
          toast.error("Cannot Report Twice");
        }else{
          toast.success("post reported");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="options">
      <div className="optionsWrapper">
        <ul className="optionsList">
          {decodedAuth._id == post.userId && <li className="optionsListItem">
            {/* <RssFeedIcon className='optionsIcon' /> */}
            <span className="optionsListItemText" onClick={editPost}>
              Edit
            </span>
          </li>}
          {decodedAuth._id == post.userId && <li className="optionsListItem">
            {/* <RssFeedIcon className='optionsIcon' /> */}
            <span className="optionsListItemText" onClick={deletePost}>
              Delete
            </span>
          </li>}
          {decodedAuth._id !== post.userId && <li className="optionsListItem">
            {/* <RssFeedIcon className='optionsIcon' /> */}
            <span className="optionsListItemText" onClick={reportPost}>
              Report
            </span>
          </li>}
        </ul>
        {/* <button className="optionsButton">
            Show More
          </button> */}
        <Toaster position="bottom-center" reverseOrder={false} />
        <Modal open={open} onClose={onCloseModal}  center >
         <div className="postModal" style={{padding : "15px" ,minWidth: "300px", minHeight: "200px"}} >
         <div className="postTop">
          <div className="postTopLeft">
            {/* <img src={Users.filter((u)=>u.id === post.userId)[0].profilePicture} alt="shareImg" className="postProfileImg"/> */}
            {post?.userDetails?.profilePicture ? <img src={post?.userDetails?.url2 } alt="shareImg" className="postProfileImg" /> : <img src="/assets/NoPhoto.jpg" alt="shareImg" className="postProfileImg" />}
            
            <span className="postUsername">
              {post?.userDetails?.username ? post.userDetails.username : "some error"}
            </span>
            
          </div>
          {/* <div className="postTopRight">
            
          </div> */}
        </div>
        <div className="postCenter">
          {/* <span className="postText">
            {post?.desc ? post.desc : "No description available"}
          </span> */}
          <input type="text" value={inputText} onChange={(e)=>setInputText(e.target.value)} className="postText" style={{outline : "none" ,border : "none"}} />
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
        <button className="editModal" onClick={editPostModal}>Edit Post</button>
        </div>
        </Modal>
      </div>
    </div>
  );
}

export default Options;
