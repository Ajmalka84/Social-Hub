import React, { useContext, useEffect, useState } from "react";
import { Search, Person, Chat, Notifications } from "@mui/icons-material";
import "./Topbar.css";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import AxiosWithAuth from "../../Axios/Axios";
function Topbar() {
  const { user } = useContext(AuthContext);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const axiosJWT = AxiosWithAuth();
  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

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

  return (
    <div className="topbarContainer">
      <div className="topbarLeft">
        <div className="topbarLogo">
          <span className="logo">Social Hub</span>
        </div>
      </div>

      <div className="topbarCenter">
        <div className="searchBar">
          <Search className="searchIcon" />
          <input
            placeholder="Search for friends, posts and videos"
            className="searchInput"
            type="text"
            value={query}
            onChange={handleInputChange}
          />
          {query.length > 1 && (
            <ul>
              {results.map((user) => (
                <Link to={`/profile/${user._id}`} ><li key={user.id} >{user.username}</li></Link>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="topbarRight">
        <div className="topbarLinks">
          <span className="topbarLink">Homepage</span>
          <span className="topbarLink">Timeline</span>
        </div>
        <div className="topbarIcons">
          <div className="topbarIconItem">
            <Person />
            <span className="topbarIconBadge">1</span>
          </div>
          <div className="topbarIconItem">
          <Link to={'/messenger'} ><Chat /></Link> 
            <span className="topbarIconBadge">2</span>
          </div>
          <div className="topbarIconItem">
            <Notifications />
            <span className="topbarIconBadge">1</span>
          </div>
        </div>
        <Link to={`/profile/${user?._doc?._id}`}>
          {user?._doc?.profilePicture ? (
            <img
              className="topbarImg"
              src={user._doc.profilePicture}
              alt="person"
            />
          ) : (
            <img className="topbarImg" src="/assets/NoPhoto.jpg" alt="person" />
          )}
        </Link>
      </div>
    </div>
  );
}

export default Topbar;
