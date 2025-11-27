// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCMM7rYGe1_iM0-SXsiSkTXSYZgiwkgMOw",
  authDomain: "first-ae9ac.firebaseapp.com",
  databaseURL: "https://first-ae9ac-default-rtdb.firebaseio.com",
  projectId: "first-ae9ac",
  storageBucket: "first-ae9ac.firebasestorage.app",
  messagingSenderId: "538340986744",
  appId: "1:538340986744:web:d5b11b0651032fb0aec28d",
  measurementId: "G-MWVHCQ9JM4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export { app,db,auth, analytics };