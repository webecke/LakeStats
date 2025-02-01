import { initializeApp } from 'firebase/app';
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyB6e1865HRtISGpw3BUn9U71lK0lKXTdJY",
    authDomain: "lakestats.firebaseapp.com",
    projectId: "lakestats",
    storageBucket: "lakestats.firebasestorage.app",
    messagingSenderId: "130755877382",
    appId: "1:130755877382:web:799d57606183ff6ec6c187",
    measurementId: "G-NS6HS85775"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
