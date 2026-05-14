import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCk-WS_rRiWrQCGVzAbsZy1D_TZdXNEsJ8",
  authDomain: "customerinternationalportal.firebaseapp.com",
  projectId: "customerinternationalportal",
  storageBucket: "customerinternationalportal.firebasestorage.app",
  messagingSenderId: "364077170087",
  appId: "1:364077170087:web:7d9e1c7c5cfd306e834a82",
  measurementId: "G-RLBY66K4R6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Firestore Database
export const db = getFirestore(app);

export default app;
