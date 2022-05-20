// Import the functions you need from the SDKs you need
import * as firebase from "firebase";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAAD61uUFi-wTKjqNBmquzsD2MZvozeWY8",
  authDomain: "ezshare-247cd.firebaseapp.com",
  projectId: "ezshare-247cd",
  storageBucket: "ezshare-247cd.appspot.com",
  messagingSenderId: "682324020417",
  appId: "1:682324020417:web:302d2347fae14ccaf35840",
  measurementId: "G-ZQE2YT0CJV",
};

const app = firebase.initializeApp(firebaseConfig);
// let app;
// if (firebase.apps.length === 0) {
//   app = firebase.initializeApp(firebaseConfig);
// } else {
//   app = firebase.app();
// }

const auth = firebase.auth();

export { auth };
