import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCdi5treffChLazacS4eBgbeeYCc3_9BK8",
  authDomain: "test-3be97.firebaseapp.com",
  projectId: "test-3be97",
  storageBucket: "test-3be97.appspot.com",
  messagingSenderId: "727754026767",
  appId: "1:727754026767:web:4c151fe903133da246187a"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage();
export const db = getFirestore()
