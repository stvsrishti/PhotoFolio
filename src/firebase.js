// create and initialize your own firebase here
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBjxBUWY--P89ErO66IdkUl_vjDwTfyiUs",
  authDomain: "photofolio-4b528.firebaseapp.com",
  projectId: "photofolio-4b528",
  storageBucket: "photofolio-4b528.firebasestorage.app",
  messagingSenderId: "473723153336",
  appId: "1:473723153336:web:639376a5677f9ab87d7d4d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
