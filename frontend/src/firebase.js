
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAAnMME0mpYBWidi_YHN9KFSigV1PLw6Tc",
  authDomain: "socialhub-237df.firebaseapp.com",
  projectId: "socialhub-237df",
  storageBucket: "socialhub-237df.appspot.com",
  messagingSenderId: "354422162943",
  appId: "1:354422162943:web:d1a9424aa0c3b462c853ca",
  measurementId: "G-BK5XC9XTVH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export default app;