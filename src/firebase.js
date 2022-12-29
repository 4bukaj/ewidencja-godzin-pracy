import firebase from "firebase/compat/app";
import { getFirestore } from "@firebase/firestore";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCAuZuOEl36pPVR9DSsEYwseKM_c-LKGuQ",
  authDomain: "ewidencja-94a80.firebaseapp.com",
  projectId: "ewidencja-94a80",
  storageBucket: "ewidencja-94a80.appspot.com",
  messagingSenderId: "337078450209",
  appId: "1:337078450209:web:2344b2808f0e9075470b60",
};

const app = firebase.initializeApp(firebaseConfig);

export const storage = getStorage(app);
export const db = getFirestore(app);
export const auth = app.auth();
export default app;
