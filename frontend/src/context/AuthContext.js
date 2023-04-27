import React, { useEffect, useState } from "react";
import { createContext, useReducer } from "react";
import {
  GoogleAuthProvider,
  signInWithPopup,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import { auth } from "../firebase";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [Auth, setAuth] = useState({});
  const [AdminAuth, setAdminAuth] = useState({});
  const [DP, setDP] = useState("");
  const [persist, setPersist] = useState(
    JSON.parse(localStorage.getItem("persist")) || false
  );
  function googleSignIn() {
    const googleAuthProvider = new GoogleAuthProvider();
    return signInWithPopup(auth, googleAuthProvider);
  }

  function setUpRecaptcha(number) {
    console.log(number);
    const recaptchaVerifier = new RecaptchaVerifier(
      "recaptcha-container",
      {},
      auth
    );
    recaptchaVerifier.render();
    return signInWithPhoneNumber(auth, number, recaptchaVerifier);
  }
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
        googleSignIn,
        setUpRecaptcha
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
