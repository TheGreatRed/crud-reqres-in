import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseApp = initializeApp({
    apiKey: "AIzaSyAhBrax_m8RSPNGNTeeyraRIDx7iIcWjB0",
    authDomain: "pruebatecnicaapp.firebaseapp.com",
    projectId: "pruebatecnicaapp",
    storageBucket: "pruebatecnicaapp.appspot.com",
    messagingSenderId: "420757467351",
    appId: "1:420757467351:web:2ece3110c4c88b97328092",
    measurementId: "G-G1F70SP2RF"
});

const db = getFirestore(firebaseApp);

export { firebaseApp, db };