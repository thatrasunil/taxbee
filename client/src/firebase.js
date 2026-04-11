import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Replace with your actual Firebase project configuration
// You can find this in Firebase Console > Project Settings > General > Your apps
const firebaseConfig = {
  apiKey: "AIzaSyDEa2QgXfFEKKu7ag9HTC-nm5pElcvJ5vk",
  authDomain: "taxbee-7ce92.firebaseapp.com",
  projectId: "taxbee-7ce92",
  storageBucket: "taxbee-7ce92.firebasestorage.app",
  messagingSenderId: "808598964436",
  appId: "1:808598964436:web:60e8471c8a9f2275719341",
  measurementId: "G-9H4M88JE15"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
