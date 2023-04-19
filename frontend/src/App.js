import React, { useContext } from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Home from "./Pages/Home/Home";
import Profile from "./Pages/Profile/Profile";
import Login from "./Pages/Login/Login";
import { AuthContext } from "./context/AuthContext";
import Register from "./Pages/Register/Register";
import Messenger from "./Pages/Messenger/Messenger";
import EditProfile from "./Components/EditProfile/EditProfile";
import RequireAuth from "./Components/RequireAuth";
import PersistLogin from "./PersistLogin";

function App() {
  const { user } = useContext(AuthContext);
  return (
    <BrowserRouter>
      <Routes path="/" element={<Outlet />}>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

        <Route element={<PersistLogin />}>
          <Route path="/" element={<Home />} />
          <Route path="profile/:_id" element={<Profile />} />
          <Route path="profile/edit" element={<EditProfile />} />
          <Route path="messenger" element={<Messenger />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
