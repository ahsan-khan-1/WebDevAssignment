import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";


const firebaseConfig = {
  apiKey: "AIzaSyDAHQylBYuq_xW_s8SYyijSGYSjtFHCJao",
  authDomain: "booklog-ecb1a.firebaseapp.com",
  projectId: "booklog-ecb1a",
  storageBucket: "booklog-ecb1a.appspot.com",
  messagingSenderId: "687842180600",
  appId: "1:687842180600:web:37ee4bb36c14c5fa162a0d",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, addDoc, collection, getDocs, updateDoc, doc, deleteDoc };
