import React, { useEffect, useState } from "react";
import { createContext, useReducer } from "react";
// import AuthReducer from "./AuthReducer";
// const INITIAL_STATE = {
//   user: null,
//   isFetching: false,
//   error: false,
// };

// export const AuthContext = createContext(INITIAL_STATE);
export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  // const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);
  const [Auth, setAuth] = useState({});
  const [persist, setPersist] = useState(
    JSON.parse(localStorage.getItem("persist")) || false
  );
  // Load user data from local storage
  // useEffect(() => {
  //   const userData = JSON.parse(localStorage.getItem("user"));
  //   if (userData) {
  //     dispatch({ type: "LOGIN_SUCCESS", payload: userData });
  //   }
  // }, []);

  // Save user data to local storage whenever the state changes
  // useEffect(() => {
  //   localStorage.setItem("user", JSON.stringify(state.user));
  // }, [state.user]);

  return (
    <AuthContext.Provider
      value={{
        Auth,
        setAuth,
        persist,
        setPersist,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
