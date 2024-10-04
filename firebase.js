// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";


import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD6uTSexYFEp1Yv5jL4DfstYhJpsIImHIg",
  authDomain: "fes-twitterclone.firebaseapp.com",
  projectId: "fes-twitterclone",
  storageBucket: "fes-twitterclone.appspot.com",
  messagingSenderId: "732252480285",
  appId: "1:732252480285:web:3d449740e63bcfcafcf7f4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth();
