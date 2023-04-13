import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import Post from "../Post/Post";
import Share from "../Share/Share";
import "./Feeds.css";
import AxiosWithAuth from "../../Axios/Axios";
function Feeds({ feedProfile , otherUser}) {
  const { user } = useContext(AuthContext);
  const AxiosJWT = AxiosWithAuth();
  
  const [posts, setPosts] = useState([]);
  const [userPosts ,setUserPosts] = useState([])
  useEffect(() => {
    if(feedProfile){
      const allUserPosts = async () => {
        await AxiosJWT.get(`post/timeline/${otherUser._id}`)
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
          {otherUser._id === user?._doc?._id && <Share setPosts={setPosts}/> }
          {userPosts.map((p) => {
            return <Post key={p._id} post={p} setPosts={setPosts} />;
          })}
        </div>
      </div>
    );
  };

  const HomeFeeds = () => {
    return (
      <>
        <div className="feeds">
          <div className="feedWrapper">
            <Share setPosts={setPosts} />
            {posts.map((p) => {
              return <Post key={p._id} post={p} setPosts={setPosts} />;
            })}
          </div>
        </div>
      </>
    );
  };

  return <>{feedProfile ? <ProfileFeeds /> : <HomeFeeds />}</>;
}

export default Feeds;