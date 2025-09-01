// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD09FvKGcAXtERqppiSgyqXuY25x7APPlo",
  authDomain: "ntn-479.firebaseapp.com",
  projectId: "ntn-479",
  storageBucket: "ntn-479.appspot.com", // Fixed format
  messagingSenderId: "441663977277",
  appId: "1:441663977277:web:15222913e549d4ec67b754"
};

// Initialize Firebase with error handling
let app;
let auth;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  console.log("Firebase initialized successfully");
} catch (error) {
  console.error("Firebase initialization error", error);
  throw error; // Optional: re-throw if you want initialization failures to be fatal
}

// Export auth and app for other uses
export { auth, app };