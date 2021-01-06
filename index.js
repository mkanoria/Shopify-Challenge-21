// import express from "express";
// import multer from "multer";
const express = require("express");
const multer = require("multer");
const firebase = require("firebase");

// initialize express instance
const app = express();
const upload = multer({ dest: "uploads/" });

// Get firebase config info
const firebaseConfig = require("./config/firebase").firebaseConfig;
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

app.post("/upload", upload.single("picture"), (req, res) => {
  console.log(req.file);
  res.send("Uploading file!");
});

app.get("/", async (req, res) => {
  res.send("Hello World");
  const docRef = db.collection("users").doc("alovelace");

  await docRef.set({
    first: "Ada1",
    last: "Lovelace",
    born: 1815,
  });
});

// Server running on port 5000
app.listen(5000, () => {
  console.log("Listening on 5000");
});
