// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "campreview-64727.firebaseapp.com",
    projectId: "campreview-64727",
    storageBucket: "campreview-64727.appspot.com",
    messagingSenderId: "337420318726",
    appId: "1:337420318726:web:d7376e4dd2a1b421aeeb87",
    measurementId: "G-EZ2DHGFE0D"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
