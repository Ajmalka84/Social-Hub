import axios, { Axios } from "axios";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import jwt_decode from "jwt-decode";
import Cookies from "js-cookie";

const AxiosWithAuth = () => {
  const { user, dispatch } = useContext(AuthContext);

  const AxiosJWT = axios.create({
    baseURL: "http://localhost:8000/",
  });

  const refreshToken = async () => {
    try {
      const refreshtoken = Cookies.get("refreshToken");
      const res = await axios.post(
        "http://localhost:8000/auth/refresh",
        {
          refreshToken: refreshtoken,
        }
      );
      dispatch({ type: "ACCESS TOKEN", payload: res.data });
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  AxiosJWT.interceptors.request.use(
    async (config) => {
      
      let currentDate = new Date();
      const decodedToken = user && jwt_decode(user.accessToken);
      
      if (decodedToken?.exp * 1000 < currentDate.getTime()) {
        console.log("its here in the interceptors");
        const data = await refreshToken();
      }
      config.headers["authorization"] = `Bearer ${user.accessToken}`;
      return config;
    },
    (error) => {
      console.log(error);
    }
  );

  return AxiosJWT;
};

export default AxiosWithAuth;

// const hello = AxiosJWT.interceptors.request.use(
//   async (config) => {
//     let currentDate = new Date();
//     const decodedToken = user && jwt_decode(user.accessToken);
//     if (decodedToken?.exp * 1000 < currentDate.getTime()) {
//       console.log("its here in the interceptors");
//       const data = await refreshToken(); // refresh token is getting value as undefined. the problem is in backend
//       console.log(data);
//       config.headers["authorization"] = "Bearer " + user.accessToken;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// return AxiosJWT;
