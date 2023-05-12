import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "./context/AuthContext";
import { Outlet, useNavigate } from "react-router-dom";
import HashLoader from "react-spinners/HashLoader";

function PersistAdminLogin() {
  const [isLoading, setIsLoading] = useState(true);
  const { AdminAuth ,setAdminAuth} = useContext(AuthContext);
  let [color, setColor] = useState("#000000");
  const token = localStorage.getItem('AdminAccessToken');
  const navigate = useNavigate()
  useEffect(() => {
    const verifyAccessToken = async () => {
      try {
        setAdminAuth({adminToken : token})
      } catch (err) {
        navigate('/admin/login')
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };
    !AdminAuth?.adminToken ? verifyAccessToken() : setIsLoading(false);
  }, []);
  return (
    <>
      {isLoading ? (
        <div>
          <div className="spinning">
            <HashLoader
              color={color}
              loading={isLoading}
              size={150}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          </div>
        </div>
      ) : (
        <Outlet />
      )}
    </>
  );
}

export default PersistAdminLogin;
