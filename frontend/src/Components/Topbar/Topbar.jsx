import React, { useContext, useEffect, useRef, useState } from "react";
import { Search, Person, Chat, Notifications } from "@mui/icons-material";
import "./Topbar.css";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import AxiosWithAuth from "../../Axios/Axios";
import jwtDecode from "jwt-decode";
import Cookies from 'js-cookie';
import NotificationList from "../NotificationList/NotificationList";
function Topbar({ profilePicture, setProfilePicture }) {
  
  const { Auth } = useContext(AuthContext);
  const navigate = useNavigate()
  const decodedAuth = jwtDecode(Auth.accessToken);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [click, setClick] = useState(1);
  const [notifications, setNotifications] = useState(false);
  const axiosJWT = AxiosWithAuth();
  const [notification, setNotification] = useState();
  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };
  useEffect(() => {
    const getNotifications = async () => {
      await axiosJWT
        .get(`users/${decodedAuth._id}/get-notifications`)
        .then((result) => {
          setNotification([...result.data]);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getNotifications();
  }, []);
  const dropdownRef = useRef()
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setQuery('');
      setResults([]);
    }
  };

  useEffect(() => {
    window.addEventListener('click', handleClickOutside);
  
    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, [dropdownRef]);
  
  useEffect(() => {
    const searchResults = async () => {
      if (query.length > 0) {
        await axiosJWT
          .post("users/search", { query: query })
          .then((results) => {
            setResults(results.data);
          })
          .catch((error) => {
            console.log(error, "its here in catch part");
          });
      } else {
        setResults([]);
      }
    };
    searchResults();
  }, [query]);
  const showNotifications = ()=> {
    if(click === 1){
      setNotifications(true);
      setClick(prev => prev+1)
    }else{
      setNotifications(false);
      setClick(prev => prev-1)
    }
  }
  useEffect(() => {
    const loadProfilePicture = async () => {
      await axiosJWT
        .post("users/get-profile-picture", { userId: decodedAuth._id })
        .then((result) => {
          setProfilePicture(result?.data?.url);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    loadProfilePicture();
  }, []);
   
  const userLogout = ()=>{
    Cookies.remove('refreshToken');
    navigate('/login' , { replace : true })
  }
  return (
    <div className="topbarContainer">
      <div className="topbarLeft">
        <div className="topbarLogo">
          <Link to={"/"} style={{ textDecoration: "none" }}>
            <span className="logo">Social Hub</span>
          </Link>
        </div>
      </div>

      <div className="topbarCenter">
        <div className="searchBar">
          <Search className="searchIcon" />
          <input
            placeholder="Search for friends, posts and videos"
            className="searchInput"
            type="text"
            style={{marginBottom: "0px"}}
            value={query}
            onChange={handleInputChange}
          />
          {query.length > 1 && (
            <div className="dropdown" ref={dropdownRef}>
              <ul>
                {results.map((user) => (
                  <Link to={`/profile/${user._id}`} key={user.id} style={{ textDecoration: "none" }}>
                    <li className="searchResult">{user.username}</li>
                  </Link>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      <div className="topbarRight">
        <div className="topbarLinks">
          <span className="topbarLink" onClick={userLogout}>Logout</span>
          
        </div>
        <div className="topbarIcons">
          {/* <div className="topbarIconItem">
            <Person />
            <span className="topbarIconBadge">1</span>
          </div> */}
          <div className="topbarIconItem">
            <Link to={"/messenger"} style={{ color : "white" }}>
              <Chat />
            </Link>
            {/* <span className="topbarIconBadge">2</span> */}
          </div>
          <div className="topbarIconItem" onClick={showNotifications}>
            <Notifications />
            {
              notification?.filter((n)=>n.status ==="Unread").length === 0 ? '' :
            <span className="topbarIconBadge">{notification?.filter((n)=>n.status ==="Unread").length}</span>
            }
          </div>
          {notifications && 
          <NotificationList />}
        </div>
        <Link to={`/profile/${decodedAuth?._id}`}>
          {decodedAuth?.profilePicture ? (
            <img className="topbarImg" src={profilePicture} alt="person" />
          ) : (
            <img className="topbarImg" src="/assets/NoPhoto.jpg" alt="person" />
          )}
        </Link>
      </div>
    </div>
  );
}

export default Topbar;
