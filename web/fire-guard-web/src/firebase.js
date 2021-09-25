import firebase from 'firebase'

let firebaseConfig = {
  apiKey: "AIzaSyAr4XfjXnQ0MDKF8ItJF5g0_sfOJym5QdE",
  authDomain: "guardian-8888.firebaseapp.com",
  databaseURL: "https://guardian-8888.firebaseio.com",
  projectId: "guardian-8888",
  storageBucket: "",
  messagingSenderId: "479861968929",
  appId: "1:479861968929:web:e7f9b6edbc21d8f1941360"
};

firebase.initializeApp(firebaseConfig);

export var database = firebase.database();
