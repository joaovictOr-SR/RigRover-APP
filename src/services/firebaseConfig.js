// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyApOsgcXoZWIOGwtJB_ILyWf5291dSXv2w",
  authDomain: "rigroverapp.firebaseapp.com",
  projectId: "rigroverapp",
  storageBucket: "rigroverapp.appspot.com",
  messagingSenderId: "150328491575",
  appId: "1:150328491575:web:eb7b2ae60aeafb5cf349b2",
  // measurementId: "G-ZXXMJNSEMC"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);