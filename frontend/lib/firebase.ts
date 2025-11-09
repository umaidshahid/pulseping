
// lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBptAD5E2tVmGk7mwW1kBNn8KKxKKCgINM",
  authDomain: "pulseping-557a6.firebaseapp.com",
  projectId: "pulseping-557a6",
  storageBucket: "pulseping-557a6.firebasestorage.app",
  messagingSenderId: "113183346362",
  appId: "1:113183346362:web:3b3390e62b359ee82c7c83"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export default app;
