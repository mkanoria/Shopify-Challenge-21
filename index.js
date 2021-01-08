/*
const express = require("express");
const bodyParser = require("body-parser");
// Cloudinary Setup
var cloudinary = require("cloudinary");

// initialize express instance
const app = express();


app.get("/", async (req, res) => {
  res.send("Hello World");
  // const docRef = db.collection("users").doc("alovelace");

  // await docRef.set({
  //   first: "Ada1",
  //   last: "Lovelace",
  //   born: 1815,
  // });
});

/*
// Get firebase config info
const firebaseConfig = require("./config/firebase").firebaseConfig;
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();


// Set up routes
const images = require("./routes/image");

app.use("images/", images);
 
*/

const express = require("express");
const firebase = require("firebase");
const cloudinary = require("cloudinary").v2;
const bodyParser = require("body-parser");

const app = express();
// body parser configuration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Get cloudinary keys
const { cloudinary_api_key, cloudinary_api_secret } = require("./config/keys");
// Cloudinary config
cloudinary.config({
  cloud_name: "dloimnf49",
  api_key: cloudinary_api_key,
  api_secret: cloudinary_api_secret,
});

const { cloudinaryUpload } = require("./services/cloudinary");

app.get("/", (request, response) => {
  response.json({ message: "Hey! This is your server response!" });
});

// image upload API
app.post("/upload", (request, response) => {
  // collected image from a user
  const data = {
    image: request.body.image,
  };

  cloudinaryUpload(data.image)
    .then((result) => {
      console.log("Result is");
      console.log(result.id);
      console.log(result.url);
      response.status(200).send({
        result,
      });
    })
    .catch((err) => {
      response.status(500).send({
        message: "failure",
        error,
      });
    });
});

// Server running on port 5000
app.listen(5000, () => {
  console.log("Listening on 5000");
});
