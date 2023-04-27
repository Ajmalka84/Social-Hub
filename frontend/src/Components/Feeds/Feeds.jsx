import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import Post from "../Post/Post";
import Share from "../Share/Share";
import "./Feeds.css";
import AxiosWithAuth from "../../Axios/Axios";
import jwtDecode from "jwt-decode";
function Feeds({profilePicture, feedProfile , otherUser}) {
  const { Auth } = useContext(AuthContext);
  const AxiosJWT = AxiosWithAuth();
  const decodedAuth = jwtDecode(Auth.accessToken)
  const [posts, setPosts] = useState([]);
  const [userPosts ,setUserPosts] = useState([])
  useEffect(() => {
    if(feedProfile){
      const allUserPosts = async () => {
        await AxiosJWT.get(`post/timeline/${otherUser?._id}`)
        .then((alluserposts) => {
          setUserPosts([...alluserposts.data]);
        })
        .catch((error) => {
          console.log(error);
        }); 
      };
      allUserPosts();
    } else {
      const allPosts = async () => {
        await AxiosJWT.get("post/all-posts")
        .then((allposts) => {
            setPosts([...allposts.data]);
          })
          .catch((error) => {
            console.log(error);
          }); 
      };
      allPosts();
    }
  }, [feedProfile , otherUser]);
  
  const ProfileFeeds = () => {
    
    return (
      <div className="feeds">
        <div className="feedWrapper">
          {otherUser?._id === decodedAuth?._id && <Share setPosts={setUserPosts} profilePicture={profilePicture}/> }
          { userPosts.length >= 1 ? userPosts.map((p) => {
            return <Post key={p._id} post={p} setPosts={setUserPosts} profilePicture={profilePicture}/>;
          }) : <h2>No Posts Yet...</h2>}
        </div>
      </div>
    );
  };

  const HomeFeeds = () => {
    return (
      <>
        <div className="feeds">
          <div className="feedWrapper">
            <Share setPosts={setPosts} profilePicture={profilePicture} />
            {posts.map((p) => {
              return <Post key={p._id} post={p} setPosts={setPosts} profilePicture={profilePicture}/>;
            })}
          </div>
        </div>
      </>
    );
  };

  return <>{feedProfile ? <ProfileFeeds /> : <HomeFeeds />}</>;
}

export default Feeds;
