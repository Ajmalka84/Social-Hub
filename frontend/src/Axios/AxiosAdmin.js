
import axios from "axios";

const AxiosAdminJwt = () => {
  
  const AxiosAdmin = axios.create({
    baseURL: "http://localhost:8000/admin/",
  });

  AxiosAdmin.interceptors.request.use(
    async (config) => {
      return config
    },
    (error) => {
      console.log(error);
    }
  );
  return AxiosAdmin;
};

export default AxiosAdminJwt;
