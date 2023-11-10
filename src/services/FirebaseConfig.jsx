import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyDKuRuw90CnadL5_Q6KCJIcUq1zTbkH6sg",
  authDomain: "projeto-pix-da522.firebaseapp.com",
  projectId: "projeto-pix-da522",
  storageBucket: "projeto-pix-da522.appspot.com",
  messagingSenderId: "221891218803",
  appId: "1:221891218803:web:947cad99c05517392a8906"
};


export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);