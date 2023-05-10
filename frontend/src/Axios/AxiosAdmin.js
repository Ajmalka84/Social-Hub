import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import jwtDecode from "jwt-decode";
import Cookies from 'js-cookie';


const AxiosAdminJwt = () => {
  const { AdminAuth } = useContext(AuthContext);
  
  const AxiosAdmin = axios.create({
    baseURL: "http://localhost:8000/admin/",
  });

  AxiosAdmin.interceptors.request.use(
    async (config) => {
      console.log(AdminAuth)
      let currentDate = new Date();
      const decodedAdminToken = jwtDecode(AdminAuth?.adminToken);
      console.log(decodedAdminToken)
      console.log(decodedAdminToken?.exp * 1000)
      console.log(currentDate.getTime())

      // const AdminToken =  Cookies.get('adminToken');
      // console.log(AdminToken)
      if (
        AdminAuth?.adminToken &&
        decodedAdminToken?.exp * 1000 > currentDate.getTime()
      ) {
        console.log("here")
        config.headers["authorization"] = `Bearer ${AdminAuth.adminToken}`;
        return config;
      }
    },
    (error) => {
      console.log(error);
    }
  );
  return AxiosAdmin;
};

export default AxiosAdminJwt;
