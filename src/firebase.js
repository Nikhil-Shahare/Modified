import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBD8xkMN0iesz7fYVU8yzx_nuW3Ii7eZ_8",
  authDomain: "designer-dekhrekh.firebaseapp.com",
  databaseURL: "https://designer-dekhrekh-default-rtdb.firebaseio.com",
  projectId: "designer-dekhrekh",
  storageBucket: "designer-dekhrekh.appspot.com",
  messagingSenderId: "679119629602",
  appId: "1:679119629602:web:64301e7d42bc360446497b"
};


// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage();
export const db = getFirestore()
