
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC3rCOqCp5hyaivFelT5F_SXQT-lWWZfe0",
  authDomain: "social-hub-8b288.firebaseapp.com",
  projectId: "social-hub-8b288",
  storageBucket: "social-hub-8b288.appspot.com",
  messagingSenderId: "683336879142",
  appId: "1:683336879142:web:92468293cdb2e22e5f2ae7",
  measurementId: "G-79R7CBV9JN"
};

// Initialize Firebase
const fbase = initializeApp(firebaseConfig);
export const auth = getAuth(fbase);
export default fbase;