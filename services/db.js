const firebase = require("firebase");

// Get firebase config info
// const firebaseConfig = require("../config/firebase").firebaseConfig;
const firebaseConfig = require("../config/keys").firebaseConfig;

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

module.exports.db = db;
