import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCAkvuDEEjEouk_ff46PcP3rN1mT2wh56Q",
  authDomain: "fire-babies.firebaseapp.com",
  databaseURL: "https://fire-babies-default-rtdb.firebaseio.com",
  projectId: "fire-babies",
  storageBucket: "fire-babies.appspot.com",
  messagingSenderId: "867243399468",
  appId: "1:867243399468:web:90019e565e73894f35b489",
  measurementId: "G-G7EW8HGPWL"
};
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export {db}
