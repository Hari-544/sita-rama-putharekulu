import { initializeApp } from "firebase/app";

import {
  getFirestore,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAr4TBOXzt1Gg7RJIC-5LtkFAxlBxk-Mng",
  authDomain: "sita-rama-putharekulu.firebaseapp.com",
  projectId: "sita-rama-putharekulu",
  storageBucket: "sita-rama-putharekulu.firebasestorage.app",
  messagingSenderId: "92267260764",
  appId: "1:92267260764:web:1daf6fc7cc4f9803086f99",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);