import React, { useContext, useEffect, useState } from "react";
import "./Rightbar.css";
import { AuthContext } from "../../context/AuthContext";
import { Users } from "../../dummy";
import Online from "../Online/Online";
import AxiosWithAuth from "../../Axios/Axios";
import { Link } from "react-router-dom";
import {Add, Remove} from '@mui/icons-material'
function Rightbar({ profile, RightbarUser }) {
  const { user } = useContext(AuthContext);
  const [friends, setFriends] = useState([]);
  const [followed , setFollowed] = useState(false);
  const axiosJWT = AxiosWithAuth();
  
  useEffect(() => {
    const getFriends = async () => {
      try {
        const friendList = await axiosJWT.get(
          `users/friends/${RightbarUser._id}`
        );
        setFriends((prevFriends) => friendList.data);
      } catch (error) {
        console.log(error);
      }
    };
    getFriends();
  }, [RightbarUser]);
  
  useEffect(()=>{
    setFollowed(user?._doc?.followings.includes(RightbarUser?._id))
  }, [user, RightbarUser])
  
  const handleClick = async()=>{
    try {
     if (followed) {
       await axiosJWT.put(`users/${RightbarUser._id}/unfollow` , {userId : user._doc._id})
      } else{
       await axiosJWT.put(`users/${RightbarUser._id}/follow` ,{userId : user._doc._id})
     }
    } catch (error) {
      console.log(error)
    }
    setFollowed(!followed)

  }
  const HomeRightbar = () => {
    return (
      <>
        <div className="birthdayContainer">
          <img src="/assets/gift.png" alt="" className="birthdayImg" />
          <span className="birthdayText">
            <b>Pola Foster</b> and <b>3 other friends</b> have birthday today.
          </span>
        </div>
        <img src="/assets/ad.jpg" alt="ad" className="rightbarAd" />
        <h4 className="rightbarTitle">Online Friends</h4>
        <ul className="rightbarFriendList">
          {Users.map((u) => (
            <Online key={u.id} user={u} />
          ))}
        </ul>
      </>
    );
  };

  const ProfileRightbar = () => {
    return (
      <>
        {RightbarUser?._id !== user._doc._id && (
          <button className="rightbarFollowButton" onClick={handleClick}>{followed ? "Unfollow" : "Follow"}
          {followed ? <Remove /> : <Add /> }
          </button>
        )}
        <h4 className="rightbarTitle">User Information</h4>
        <div className="rightbarInfo">
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">City: </span>
            <span className="rightbarInfoValue">New York</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">From: </span>
            <span className="rightbarInfoValue">Madrid</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">Relationship: </span>
            <span className="rightbarInfoValue">Single</span>
          </div>
        </div>
        <h4 className="rightbarTitle">User Friends</h4>
        <div className="rightbarFollowings">
          {friends.length != 0
            ? friends.map((friend) => (
                <Link to={`/profile/${friend._id}`}>
                  <div className="rightbarFollowing" key={friend._id}>
                    <img
                      src="assets/person/1.jpg" // change
                      alt=""
                      className="rightbarFollowingImg"
                    />
                    <span className="rightbarFollowingName">
                      {friend?.username}
                    </span>
                  </div>
                </Link>
              ))
            : ""}
        </div>
      </>
    );
  };

  return (
    <div className="rightbar">
      <div className="rightbarWrapper">
        {profile ? <ProfileRightbar /> : <HomeRightbar />}
      </div>
    </div>
  );
}

export default Rightbar;
