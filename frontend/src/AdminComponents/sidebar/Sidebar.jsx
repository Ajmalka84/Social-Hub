import "./sidebar.css";
import { Link } from "react-router-dom";

export default function AdminSidebar() {
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
            <Link to="/admin/logout" className="link">
              <li className="adminSidebarListItem active">Logout</li>
            </Link>
          </ul>
        </div>
      </div>
    </div>
  )
};
