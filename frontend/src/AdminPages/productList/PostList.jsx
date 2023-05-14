import React, { useContext, useEffect, useState } from "react";
import "./PostList.css";
import AxiosAdminJwt from "../../Axios/AxiosAdmin";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import {format} from "timeago.js"
import Pagination from "../../AdminComponents/Pagination/Pagination";
const PostList = () => {
  const [posts, setPosts] = useState();
  const AxiosAdmin = AxiosAdminJwt();
  const [open, setOpen] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  
  const [postsPerPage, setPostsPerPage] = useState(3);
  const lastPostIndex = currentPage * postsPerPage
  const firstPostIndex = lastPostIndex - postsPerPage
  useEffect(() => {
    const getPosts = async () => {
      await AxiosAdmin.get("reportedPosts")
        .then((result) => {
          console.log(result.data);
          setPosts(result.data);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getPosts();
  }, []);
  
  const handleBlockPost = async(postId) => {
    const updatedPosts = posts.map((post) =>
    post._id === postId ? { ...post, blocked: !post.blocked } : post
    );
    await AxiosAdmin.post("block-Post", {postId : postId}).then((result)=>{
      console.log(result.data)
      setPosts(updatedPosts);  
    }).catch((error)=>{
      console.log(error)
    })
  };

  const currentPosts = posts?.slice(firstPostIndex, lastPostIndex)
  console.log(currentPosts)
  const viewPost = (event , postId) => {
    event.stopPropagation();
    setOpen(postId);
  };
  
  const onCloseModal = () => {
    setOpen(false);
  };
  return (
    <div className="userList">
      <table>
        <thead>
          <tr >
            <th>Username</th>
            <th>Post Id</th>
            <th>No of reports</th>
            <th>Blocked</th>
            <th>View Post</th>

            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentPosts?.map((post) => (
            <tr key={post._id}>
              <td>{post.userDetails.username}</td>
              <td>{post._id}</td>
              <td>{post.reports.length}</td>
              <td>{post.blocked ? "Yes" : "No"}</td>
              <td>
                <button className="tableButton" onClick={(event) => viewPost(event,post._id)}>view post</button>
              </td>

              <td>
                <button className="tableButton" onClick={() => handleBlockPost( post._id)}>
                  {post.blocked ? "Unblock" : "Block"}
                </button>
                <Modal open={open === post._id} onClose={onCloseModal } center>
                  <div className="post" style={{minWidth : "500px" , minHeight : '150px'}}>
                    <div className="postWrapper">
                      <div className="postTop">
                        <div className="postTopLeft">
                          {post?.userDetails?.profilePicture ? (
                            <img
                              src={post?.userDetails?.url2}
                              alt="shareImg"
                              className="postProfileImg"
                            />
                          ) : (
                            <img
                              src="/assets/NoPhoto.jpg"
                              alt="shareImg"
                              className="postProfileImg"
                            />
                          )}

                          <span className="postUsername">
                            {post?.userDetails?.username
                              ? post?.userDetails?.username
                              : "some error"}
                          </span>
                          <span className="postDate">
                            {format(post?.createdAt)}
                          </span>
                        </div>
                        <div className="postTopRight">
                          
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
                          />
                          <img
                            src="/assets/heart.png"
                            alt="heart"
                            className="likeIcon"
                            
                          />
                          <span className="postLikeCounter">
                            {post.likes.length} people like it
                          </span>
                        </div>
                        <div className="postBottomRight">
                          <span className="postCommentText" >
                            {post?.comments?.length > 0
                              ? post?.comments?.length
                              : "No"}{" "}
                            Comment
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Modal>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination totalPosts={posts?.length} postsPerPage={postsPerPage} setCurrentPage={setCurrentPage} currentPage={currentPage}/>
    </div>
  );
};

export default PostList;


