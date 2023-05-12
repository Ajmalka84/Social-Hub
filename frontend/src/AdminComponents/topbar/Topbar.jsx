import React, { useContext } from "react";
import "./topbar.css";
import { AuthContext } from "../../context/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
// import { NotificationsNone, Language, Settings } from "@material-ui/icons";

export default function AdminTopbar() {
  const navigate = useNavigate()
  const {AdminAuth , setAdminAuth} = useContext(AuthContext)
  const AdminLogout = async()=>{
     setAdminAuth({})
     localStorage.removeItem('AdminAccessToken')
     navigate('/admin/login', {replace : true})
  }
  return (
    <div className="adminTopbar">
      <div className="adminTopbarWrapper">
        <div className="topLeft">
          <span className="adminlogo">SocialHub Admin</span>
        </div>
        <div className="topRight">
          {/* <div className="adminTopbarIconContainer"> */}
            {/* <NotificationsNone /> */}
            {/* <span className="topIconBadge"></span> */}
          {/* </div> */}
          {/* <div className="adminTopbarIconContainer"> */}
            {/* <Language /> */}
            {/* <span className="topIconBadge">2</span> */}
          {/* </div> */}
          {/* <div className="adminTopbarIconContainer"> */}
            {/* <Settings /> */}
          {/* </div> */}
          {/* <img src="https://images.pexels.com/photos/1526814/pexels-photo-1526814.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500" alt="" className="topAvatar" /> */}
          <button onClick={AdminLogout}>Logout</button>
        </div>
      </div>
    </div>
  );
}
