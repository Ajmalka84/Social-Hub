import React, { useContext } from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Home from "./Pages/Home/Home";
import Profile from "./Pages/Profile/Profile";
import Login from "./Pages/Login/Login";
import Register from "./Pages/Register/Register";
import Messenger from "./Pages/Messenger/Messenger";
import PersistLogin from "./PersistLogin";
import AdminLogin from "./AdminPages/Login/Login";
import AdminHome from "./AdminPages/home/Home";
import AdminTopbar from "./AdminComponents/topbar/Topbar";
import AdminSidebar from "./AdminComponents/sidebar/Sidebar";
import "./App.css";
import UserList from "./AdminPages/userList/UserList";
import PostList from "./AdminPages/productList/PostList";
import PersistAdminLogin from "./PersistAdminLogin";


function App() {
  return (
    <BrowserRouter>
      <Routes path="/" element={<Outlet />}>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route element={<PersistLogin />}>
          <Route path="/" element={<Home />} />
          <Route path="profile/:_id" element={<Profile />} />
          <Route path="messenger" element={<Messenger />} />
        </Route>
        <Route element={<PersistAdminLogin />}>
          <Route
            path="admin"
            element={
              <>
                <AdminTopbar />
                <div className="containerApp">
                  <AdminSidebar />
                  <AdminHome />
                </div>
              </>
            }
          />
          <Route
            path="admin/users"
            element={
              <>
                <AdminTopbar />
                <div className="containerApp">
                  <AdminSidebar />
                  <UserList />
                </div>
              </>
            }
          />
          <Route
            path="admin/posts"
            element={
              <>
                <AdminTopbar />
                <div className="containerApp">
                  <AdminSidebar />
                  <PostList />
                </div>
              </>
            }
          />
        </Route>

        <Route path="admin/login" element={<AdminLogin />} />
        <Route path="admin/logout" element={<AdminLogin />} />
        {/* <Route path="admin/logout" element={<AdminLogin />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
