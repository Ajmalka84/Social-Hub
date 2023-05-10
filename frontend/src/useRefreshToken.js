import React, { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const useRefreshToken = () => {
  const { Auth, setAuth } = useContext(AuthContext);
  const navigate = useNavigate()
  const refresh = async () => {
    await axios
      .get("http://localhost:8000/auth/refresh", { withCredentials: true })
      .then((result) => {
        setAuth((prev) => {
          return {
            ...prev,
            accessToken: result.data.accessToken,
          };
        });
      })
      .catch((error) => {
        console.log(error);
        navigate('/login')
      })
      // .finally(()=>{
      // })
  };
  return refresh;
};

export default useRefreshToken;
