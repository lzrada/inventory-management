import { getApps, initializeApp } from "firebase/app";
// Import the functions you need from the SDKs you need
import { getFirestore } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import jwt from "jsonwebtoken";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESAGGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

// Authentication
export const auth = getAuth(app);

export const loginWithEmailAndPassword = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Generate JWT
    const token = jwt.sign(
      { uid: user.uid, email: user.email }, // Payload
      process.env.NEXT_PUBLIC_JWT_SECRET, // Secret key
      { expiresIn: "1h" } // Token expiration
    );

    return { user, token };
  } catch (error) {
    console.error("Error generating token:", error);
    throw new Error(error.message);
  }
};

export const registerWithEmailAndPassword = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw new Error(error.message);
  }
};

const db = getFirestore(app);
export default db;
