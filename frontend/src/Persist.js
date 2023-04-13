import React, { useContext, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import HashLoader from "react-spinners/HashLoader";
import { AuthContext } from "./context/AuthContext";

function PersistLogin() {
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useContext(AuthContext);
  console.log(user);
  let [color, setColor] = useState("#000000");

  useEffect(() => {
    const verifyRefreshToken = async () => {
      try {
        
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };

    !user ? verifyRefreshToken() : setIsLoading(false);
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
