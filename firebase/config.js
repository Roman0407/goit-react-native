import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// const firebaseConfig = {
//   apiKey: "AIzaSyBUMo_cuiKF5JTVdZJDwNGFL4PrtfCVFWs",
//   authDomain: "react-native-hw-1b912.firebaseapp.com",
//   projectId: "react-native-hw-1b912",
//   storageBucket: "react-native-hw-1b912.appspot.com",
//   messagingSenderId: "705902923759",
//   appId: "1:705902923759:web:8a6327697c0afd22af301a",
//   measurementId: "G-QC0V72MVSZ",
// };
const firebaseConfig = {
  apiKey: "AIzaSyAcBMssRKiYYjEE_XYZyj6_z0EZPIu4yf8",
  authDomain: "react-5ce44.firebaseapp.com",
  projectId: "react-5ce44",
  storageBucket: "react-5ce44.appspot.com",
  messagingSenderId: "272182120925",
  appId: "1:272182120925:web:e3ad4e7a51c91e94d0e634",
  measurementId: "G-6KP0FNZQZC"
};


export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);




// For Firebase JS SDK v7.20.0 and later, measurementId is optional

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
