import React, { useContext, useEffect, useState } from "react";
import "./Profile.css";

import Feeds from "../../Components/Feeds/Feeds";
import Rightbar from "../../Components/Rightbar/Rightbar";
import Sidebar from "../../Components/Sidebar/Sidebar";
import Topbar from "../../Components/Topbar/Topbar";
import { AuthContext } from "../../context/AuthContext";
import { Link, useParams } from "react-router-dom";
import AxiosWithAuth from "../../Axios/Axios";
import jwtDecode from "jwt-decode";

function Profile() {
  const { Auth, DP } = useContext(AuthContext);
  const userId = useParams();
  const axiosJWT = AxiosWithAuth();
  const decodedAuth = jwtDecode(Auth.accessToken);
  const [otherUser, setOtherUser] = useState(decodedAuth);
  useEffect(() => {
    const fetchUser = async () => {
      await axiosJWT
        .get(`users/${userId._id}`)
        .then((res) => {
          setOtherUser(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    fetchUser();
  }, [userId]);

  return (
    <>
      <Topbar profilePicture={DP} />
      <div className="profile">
        <Sidebar />
        <div className="profileRight">
          <div className="profileRightTop">
            <div className="profileCover">
              {otherUser?.coverPicture ? (
                <img src={otherUser.url1} alt="" className="profileCoverImg" />
              ) : (
                <img src="" alt="" className="profileCoverImg" />
              )}
              {otherUser?.profilePicture ? (
                <img src={otherUser.url} alt="" className="profileUserImg" />
              ) : (
                <img
                  src="/assets/NoPhoto.jpg"
                  alt=""
                  className="profileUserImg"
                />
              )}
            </div>
            <div className="profileInfo">
              <h2 className="profileInfoName">{otherUser.username}</h2>
              <span className="profileInfoDesc">Hello Friends..</span>
              {userId._id === decodedAuth._id && (
                <Link to={"/profile/edit"}>
                  {" "}
                  <button className="editProfile" style={{ marginTop: "10px" }}>
                    Edit Profile
                  </button>
                </Link>
              )}
            </div>
          </div>
          <div className="profileRightBottom">
            <Feeds feedProfile otherUser={otherUser} profilePicture={DP} />
            <Rightbar profile RightbarUser={otherUser} />
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
