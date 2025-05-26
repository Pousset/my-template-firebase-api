import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAxNX2m23EHQuUq_4zbjIjxfdSiRbvb_Ck",
  authDomain: "mabibliotheque-a78ab.firebaseapp.com",
  projectId: "mabibliotheque-a78ab",
  storageBucket: "mabibliotheque-a78ab.firebasestorage.app",
  messagingSenderId: "828330769020",
  appId: "1:828330769020:web:fd54de95eef31e11db27f9",
  measurementId: "G-RRMS6CRXRF"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
