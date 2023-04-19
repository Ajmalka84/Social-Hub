import React, { useContext, useEffect, useState } from "react";
import "./EditProfile.css";
import { AuthContext } from "../../context/AuthContext";
import AxiosWithAuth from "../../Axios/Axios";
import jwtDecode from "jwt-decode";

function EditProfile() {
  const { Auth } = useContext(AuthContext);
  const decodedAuth = jwtDecode(Auth.accessToken)
  const [username, setUsername] = useState(decodedAuth.username);
  const [email, setEmail] = useState(decodedAuth.email);
  const [password, setPassword] = useState(decodedAuth.password);
  const [confirmPassword, setConfirmPassword] = useState(decodedAuth.password);
  const [bio, setBio] = useState(decodedAuth?.desc);
  const [profilePic, setProfilePic] = useState(
    decodedAuth.profilePicture ? decodedAuth?.profilePicture : ""
  );
  const [coverPic, setCoverPic] = useState(
    decodedAuth?.profilePicture ? decodedAuth.coverPicture : ""
  );
  const axiosJWT = AxiosWithAuth();
  const handleSubmit = async (event) => {
    event.preventDefault();
    await axiosJWT
      .post(`/users/user`, { username : username, email : email , password : password , desc : bio})
      .then((result) => {
        console.log("its here in then part");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  
  const changeProfilePic = async()=>{
     const formData = new FormData;
     formData.append('userId' , decodedAuth._id)
     formData.append('profilePicture' , profilePic)
     await axiosJWT.post("users/profile-picture", formData , { "Content-Type": "multipart/form-data"}).then((result)=>{
      console.log(result)
     }).catch((error)=>{
      console.log(error)
     })
  }
  
  const changeCoverPic = async()=>{
     const formData = new FormData;
     formData.append('userId' , decodedAuth._id)
     formData.append('coverPicture' , coverPic)
     await axiosJWT.post("users/profile-picture", formData , { "Content-Type": "multipart/form-data"}).then((result)=>{
      console.log(result)
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
    <div className="allContainer">
      <div className="container">
        <h1>Edit Profile</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={decodedAuth.username}
            onChange={(event) => setUsername(event.target.value)}
            required
          />

          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={decodedAuth.email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={decodedAuth.password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          <label htmlFor="confirm_password">Confirm Password</label>
          <input
            type="password"
            id="confirm_password"
            name="confirm_password"
            value={decodedAuth.password}
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
          />

          <label htmlFor="bio">Bio</label>
          <textarea
            id="bio"
            name="bio"
            value={decodedAuth.desc}
            onChange={(event) => setBio(event.target.value)}
          ></textarea>

          <input type="submit" value="Save Changes" />
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
    </div>
  );
}

export default EditProfile;
