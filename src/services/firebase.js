import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBuaykpTOz4THp59DaNslzs_pQQhkCBmms",
  authDomain: "todolistporcessoseletivo-d609f.firebaseapp.com",
  projectId: "todolistporcessoseletivo-d609f",
  storageBucket: "todolistporcessoseletivo-d609f.appspot.com",
  messagingSenderId: "29687667293",
  appId: "1:29687667293:web:2fb5d0e6d7bff1e4200bb4",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
