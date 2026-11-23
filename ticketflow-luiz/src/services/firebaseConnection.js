// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDr7xkJBZ2XYHl-bCXMQqs6GSDIby85DuA",
  authDomain: "ticketflow-6392c.firebaseapp.com",
  projectId: "ticketflow-6392c",
  storageBucket: "ticketflow-6392c.firebasestorage.app",
  messagingSenderId: "289950075543",
  appId: "1:289950075543:web:2859a9d0f4b84e70d5f7d2",
  measurementId: "G-R5KM4JNW90"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };