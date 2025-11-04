import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA27PaRT5icvdg_T503gkFa12PlmC11T5g",
  authDomain: "movies-review-53dfa.firebaseapp.com",
  projectId: "movies-review-53dfa",
  storageBucket: "movies-review-53dfa.firebasestorage.app",
  messagingSenderId: "824949523285",
  appId: "1:824949523285:web:104405184229b61c5665dc",
  measurementId: "G-DFDYYMDZ0F",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;
