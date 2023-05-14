import React, { useContext, useEffect, useState } from "react";
import "./Profile.css";

import Feeds from "../../Components/Feeds/Feeds";
import Rightbar from "../../Components/Rightbar/Rightbar";
import Sidebar from "../../Components/Sidebar/Sidebar";
import Topbar from "../../Components/Topbar/Topbar";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import AxiosWithAuth from "../../Axios/Axios";
import jwtDecode from "jwt-decode";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import { Toaster, toast } from "react-hot-toast";

function Profile() {
  const { Auth, DP, setDP ,setConversations, setCurrentChat } = useContext(AuthContext);
  const navigate = useNavigate()
  const [open, setOpen] = useState(false);
  const userId = useParams();
  const axiosJWT = AxiosWithAuth();
  const decodedAuth = jwtDecode(Auth.accessToken);
  const [username, setUsername] = useState(decodedAuth.username);
  const [email, setEmail] = useState(decodedAuth.email);
  const [password, setPassword] = useState(decodedAuth.password);
  const [confirmPassword, setConfirmPassword] = useState(decodedAuth.password);
  const [bio, setBio] = useState(decodedAuth?.desc);
  const [profilePic, setProfilePic] = useState(
    decodedAuth.profilePicture ? decodedAuth?.profilePicture : ""
  );
  const [coverPic, setCoverPic] = useState(
    decodedAuth?.coverPicture ? decodedAuth.coverPicture : ""
  );
  const [otherUser, setOtherUser] = useState(decodedAuth);
  const MessageUser = async () => {
    try {
      const res = await axiosJWT.get(`conversations/find/${decodedAuth._id}/${userId._id}`)
      if(res.data == null){
        await axiosJWT.get(`conversations/${decodedAuth._id}`).then(async (result)=>{
          const createNewConversation = await axiosJWT.post('conversations' , {senderId : decodedAuth._id , recieverId : userId._id})
          setCurrentChat(createNewConversation.data)
          setConversations(result.data)
          navigate('/messenger')
        })
      }else{
        setCurrentChat(res.data)
        navigate('/messenger')
      }
     } catch (error) {
      console.log(error)
     }
  }
  const editDetails = async(e) => {
    e.preventDefault()
    await axiosJWT.post('/users/profile-edit' , {userId : decodedAuth._id , username : username , email : email , password : password , confirmPassword , bio : bio}).then((result) => {
      console.log(result.data)
      setOpen(false)
      setTimeout(() => {
        toast.success("profile Edited success")
      }, 10);
    }).catch((error)=>{
      console.log(error)
    })
  }
  const openProfileModal = () => {
    setOpen(true);
  };
  
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
  }, [userId, open]);
  
  const onCloseModal = () => {
    setOpen(false) 
  }

  const changeProfilePic = async()=>{
    const formData = new FormData;
    formData.append('userId' , decodedAuth._id)
    formData.append('profilePicture' , profilePic)
    await axiosJWT.post("users/profile-picture", formData , { "Content-Type": "multipart/form-data"}).then((result)=>{
     console.log(result)
     setOpen(false)
     setTimeout(() => {
    toast.success("profile Edited success")
  }, 10);
    }).catch((error)=>{
     console.log(error)
    })
 }
 
 const changeCoverPic = async()=>{
    const formData = new FormData;
    formData.append('userId' , decodedAuth._id)
    formData.append('coverPicture' , coverPic)
    await axiosJWT.post("users/cover-picture", formData , { "Content-Type": "multipart/form-data"}).then((result)=>{
     console.log(result)
     setOpen(false)
   setTimeout(() => {
    toast.success("profile Edited success")
  }, 10);
    }).catch((error)=>{
     console.log(error)
    })
 }

 const handleProfilePicChange = (event) => {
   setProfilePic(event.target.files[0]);
 };

 const handleCoverPicChange = (event) => {
   setCoverPic(event.target.files[0]);
   
 };

  return (
    <>
      <Topbar profilePicture={DP} setProfilePicture={setDP} />
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
              <span className="profileInfoDesc">{otherUser.desc}</span>
              {userId._id === decodedAuth._id ? (
                
                  
                  <button
                    className="editProfile"
                    style={{ marginTop: "10px" }}
                    onClick={openProfileModal}
                  >
                    Edit Profile
                  </button>
                
              ) : (<button
                className="editProfile"
                style={{ marginTop: "10px" }}
                onClick={MessageUser}
              >
                Message
              </button>)}
              {/* {userId._id === decodedAuth._id && (
                <Link to={"/profile/edit"}>
                  {" "}
                  <button
                    className="editProfile"
                    style={{ marginTop: "10px" }}
                    onClick={openProfileModal}
                  >
                    Edit Profile
                  </button>
                </Link>
              )} */}
            </div>
          </div>
          <div className="profileRightBottom">
            <Feeds feedProfile otherUser={otherUser} profilePicture={DP} />
            <Rightbar profile RightbarUser={otherUser} />
          </div>
          <Toaster position="bottom-center" reverseOrder={false} />
          <Modal open={open} onClose={onCloseModal} center>
          <div className="container">
          <form className="editProfileForm"  style={{minWidth : "500px" , minHeight : "500px"}} onSubmit={editDetails}>
          <label className="editProfileLabel" htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            className="editProfileInput"
            required
          />

          <label htmlFor="email" className="editProfileLabel">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            className="editProfileInput"
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <label htmlFor="password" className="editProfileLabel">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            className="editProfileInput"
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          <label htmlFor="confirm_password" className="editProfileLabel">Confirm Password</label>
          <input
            type="password"
            id="confirm_password"
            name="confirm_password"
            className="editProfileInput"
            value={password}
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
          />

          <label htmlFor="bio" className="editProfileLabel">Bio</label>
          <textarea
            id="bio"
            name="bio"
            value={bio}
            className="editProfileTextArea"
            onChange={(event) => setBio(event.target.value)}
          ></textarea>

          <input type="submit" value="Save Changes" className="inputSubmit" />
        </form>
        <div>
          <input
            className="inputProfile"
            type="file"
            id="profile_pic"
            name="profile_pic"
            onChange={handleProfilePicChange}
          />
          <span>
            <button className="EditProfilePic" onClick={changeProfilePic}>Add / Edit Profile Pic</button>
          </span>
        </div>
        <div>
          <input
            className="inputProfile"
            type="file"
            id="cover_pic"
            name="cover_pic"
            onChange={handleCoverPicChange}
          />
          <span>
            <button className="EditProfilePic" onClick={changeCoverPic}>Add / Edit Cover Pic</button>
          </span>
        </div>
        </div>

          </Modal>
        </div>
      </div>
    </>
  );
}

export default Profile;
