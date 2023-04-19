import React, { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import axios from "axios";

const useRefreshToken = () => {
  const { Auth, setAuth } = useContext(AuthContext);
  
  const refresh = async () => {
    await axios
      .get("http://localhost:8000/auth/refresh", { withCredentials: true })
      .then((result) => {
        setAuth((prev) => {
          console.log(prev)
          return {
            ...prev,
            accessToken: result.data.accessToken,
          };
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return refresh;
};

export default useRefreshToken;
