import React, { useContext, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import HashLoader from "react-spinners/HashLoader";
import { AuthContext } from "./context/AuthContext";
import jwt_decode from "jwt-decode";
import useRefreshToken from "./useRefreshToken";
function PersistLogin() {
  const [isLoading, setIsLoading] = useState(true);
  const { Auth , persist } = useContext(AuthContext);
  let [color, setColor] = useState("#000000");
  const refresh = useRefreshToken()
  
  useEffect(() => {
    const verifyRefreshToken = async () => {
      try {
        await refresh()
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };
    !Auth.accessToken ? verifyRefreshToken() : setIsLoading(false);
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

export default PersistLogin;
