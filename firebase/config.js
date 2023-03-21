import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBUMo_cuiKF5JTVdZJDwNGFL4PrtfCVFWs",
  authDomain: "react-native-hw-1b912.firebaseapp.com",
  projectId: "react-native-hw-1b912",
  storageBucket: "react-native-hw-1b912.appspot.com",
  messagingSenderId: "705902923759",
  appId: "1:705902923759:web:8a6327697c0afd22af301a",
  measurementId: "G-QC0V72MVSZ",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const db = getFirestore(app);
export const storage = getStorage(app);
