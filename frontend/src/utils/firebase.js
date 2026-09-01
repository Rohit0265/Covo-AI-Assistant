// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
const firebaseConfig = {
  apiKey:   import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "aibot-c6db1.firebaseapp.com",
  projectId: "aibot-c6db1",
  storageBucket: "aibot-c6db1.firebasestorage.app",
  messagingSenderId: "127271282710",
  appId: "1:127271282710:web:17569cd1df722dc29a6d37"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();

export {auth,googleProvider}