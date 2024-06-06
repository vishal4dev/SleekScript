// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
console.log(import.meta.env.VITE_FIREBASE_API_KEY);
//there is a problem with the import.meta.env.VITE_FIREBASE_API_KEY so I will use the old way
//that is directly using the api key

const firebaseConfig = {
  apiKey: "AIzaSyABVl9_vgnEAhBokfFkqFy9heT62FYpfEE",
  authDomain: "sleekscript-144d9.firebaseapp.com",
  projectId: "sleekscript-144d9",
  storageBucket: "sleekscript-144d9.appspot.com",
  messagingSenderId: "941852920611",
  appId: "1:941852920611:web:303ce05461cc7c1cd15a96"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
