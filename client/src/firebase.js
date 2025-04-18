// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY?.trim(),
  authDomain: "mern-estate-60957.firebaseapp.com",
  projectId: "mern-estate-60957",
  storageBucket: "mern-estate-60957.firebasestorage.app",
  messagingSenderId: "986751683835",
  appId: "1:986751683835:web:11ab777afa3347429db45e"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
//export default app;