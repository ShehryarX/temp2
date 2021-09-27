import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCAkvuDEEjEouk_ff46PcP3rN1mT2wh56Q",
  authDomain: "fire-babies.firebaseapp.com",
  projectId: "fire-babies",
  storageBucket: "fire-babies.appspot.com",
  messagingSenderId: "867243399468",
  appId: "1:867243399468:web:90019e565e73894f35b489",
  measurementId: "G-G7EW8HGPWL"
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


// firebase.initializeApp(firebaseConfig);

export var database = firebase.database();
