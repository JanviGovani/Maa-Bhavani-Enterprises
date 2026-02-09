import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDCNq9QslDSgWqmqXa6J8kS0rgxLBy4z78",
  authDomain: "maa-bhavani-app.firebaseapp.com",
  projectId: "maa-bhavani-app",
  storageBucket: "maa-bhavani-app.firebasestorage.app",
  messagingSenderId: "448593432879",
  appId: "1:448593432879:web:1353137501e513800c51da"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); 