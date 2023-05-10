import { useContext } from "react";
import "./sidebar.css";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function AdminSidebar() {
  const navigate = useNavigate()
  const {setAdminAuth} = useContext(AuthContext)
  const adminLogout = () => {
   setAdminAuth({})
   navigate('/admin/logout' , {replace : true})
 }
  return (

    <div className="adminsidebar">
      <div className="adminSidebarWrapper">
        <div className="adminSidebarMenu">
          <ul className="adminSidebarList">
            <Link to="/admin" className="link">
              <li className="adminSidebarListItem active" >Home</li>
            </Link>
            <Link to="/admin/users" className="link">
              <li className="adminSidebarListItem active">Users</li>
            </Link>
            <Link to="/admin/posts" className="link">
              <li className="adminSidebarListItem active">Posts</li>
            </Link>
            
              <li className="adminSidebarListItem active" onClick={adminLogout}>Logout</li>
            
          </ul>
        </div>
      </div>
    </div>
  )
};
