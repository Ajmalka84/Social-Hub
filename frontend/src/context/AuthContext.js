import React, { useEffect, useState } from "react";
import { createContext, useReducer } from "react";
import {
  GoogleAuthProvider,
  signInWithPopup,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import { auth } from "../firebase";
import jwtDecode from "jwt-decode";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [Auth, setAuth] = useState({});
  const [AdminAuth, setAdminAuth] = useState({});
  const [conversations , setConversations] = useState([])
  const [currentChat , setCurrentChat] = useState(null);
  const [DP, setDP] = useState("");
  const [persist, setPersist] = useState(
    JSON.parse(localStorage.getItem("persist")) || false
  );

  // function googleSignIn() {
  //   const googleAuthProvider = new GoogleAuthProvider();
  //   return signInWithPopup(auth, googleAuthProvider);
  // }

  // function setUpRecaptcha(number) {
  //   console.log(number);
  //   const recaptchaVerifier = new RecaptchaVerifier(
  //     "recaptcha-container",
  //     {},
  //     auth
  //   );
  //   recaptchaVerifier.render();
  //   return signInWithPhoneNumber(auth, number, recaptchaVerifier);
  // }
  
  // const decodedAdminToken = AdminAuth?.accessToken ? jwtDecode(AdminAuth.accessToken) : undefined
  // console.log(decodedAdminToken)
  // useEffect(()=>{
  //   let currentDate = new Date();
  //   if (AdminAuth?.accessToken && decodedAdminToken?.exp * 1000 < currentDate.getTime() ) {
  //     localStorage.setItem('AdminAccessToken' , AdminAuth.accessToken)
  //     console.log("its here in this thing")
  //   }
  // }, [])

  return (
    <AuthContext.Provider
      value={{
        Auth,
        setAuth,
        persist,
        setPersist,
        DP,
        setDP,
        AdminAuth,
        setAdminAuth,
        conversations,setConversations,currentChat , setCurrentChat
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
