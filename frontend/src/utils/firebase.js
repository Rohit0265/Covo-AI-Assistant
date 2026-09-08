import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;

if (!apiKey) {
  console.warn(
    "Missing VITE_FIREBASE_API_KEY in frontend/.env file! Please set VITE_FIREBASE_API_KEY."
  );
}

const firebaseConfig = {
  apiKey: apiKey || "placeholder-api-key",
  authDomain: "aibot-c6db1.firebaseapp.com",
  projectId: "aibot-c6db1",
  storageBucket: "aibot-c6db1.firebasestorage.app",
  messagingSenderId: "127271282710",
  appId: "1:127271282710:web:17569cd1df722dc29a6d37"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };