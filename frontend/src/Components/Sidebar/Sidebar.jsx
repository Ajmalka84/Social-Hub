import React, { useContext } from "react";
import "./Sidebar.css";
import RssFeedIcon from "@mui/icons-material/RssFeed";
import ChatIcon from "@mui/icons-material/Chat";
import Person from "@mui/icons-material/Person";
import GroupsIcon from "@mui/icons-material/Groups";
import BookmarksIcon from "@mui/icons-material/Bookmarks";
import WorkIcon from "@mui/icons-material/Work";
import EventIcon from "@mui/icons-material/Event";
import CloseFriend from "../CloseFriend/CloseFriend";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import jwtDecode from "jwt-decode";

function Sidebar() {
  const {Auth} = useContext(AuthContext)
  const decodedAuth = jwtDecode(Auth?.accessToken)
  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <ul className="sidebarList">
          <Link to={"/"} style={{ textDecoration: "none", color: "black" }}>
            <li className="sidebarListItem">
              <RssFeedIcon className="sidebarIcon" />
              <span className="sidebarListItemText">Home</span>
            </li>
          </Link>
          <Link
            to={"/messenger"}
            style={{ textDecoration: "none", color: "black" }}
          >
            <li className="sidebarListItem">
              <ChatIcon className="sidebarIcon" />
              <span className="sidebarListItemText">Chats</span>
            </li>
          </Link>
          <Link
            to={`/profile/${decodedAuth?._id}`}
            style={{ textDecoration: "none", color: "black" }}
          >
            <li className="sidebarListItem">
              <Person className="sidebarIcon" />
              <span className="sidebarListItemText">Profile</span>
            </li>
          </Link>
          <li className="sidebarListItem">
            <Person className="sidebarIcon" />
            <span className="sidebarListItemText">Edit Profile</span>
          </li>
        </ul>
        <button className="sidebarButton">Show More</button>
        <hr className="sidebarHr" />
      </div>
    </div>
  );
}

export default Sidebar;
