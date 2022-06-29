// NOTE: Kindly rename this file to firebase.js instead of firebaseconfigsetup.js so the imports in other files will work correctly.

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  // kindly replase the stings with the appropriate values from your firebase project
  apiKey: "Your Api_Key",
  authDomain: "Your_authDomain",
  projectId: "Your_projectId",
  storageBucket: "Your_storageBucket",
  messagingSenderId: "Your_messagingSenderId",
  appId: "Your_appId",
  measurementId: "Your_measurementId",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const provider = new GoogleAuthProvider();
export const auth = getAuth(app);
