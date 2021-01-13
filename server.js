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



// Set up routes
const images = require("./routes/image");

app.use("images/", images);
 
*/

const express = require("express");
const cloudinary = require("cloudinary").v2;
const bodyParser = require("body-parser");
const passport = require("passport");
passport.initialize();
require("./services/auth");

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

const { cloudinaryUpload, cloudinaryDelete } = require("./services/cloudinary");

const db = require("./services/db").db;
const images = require("./routes/image");

app.use("images/", images);

app.get("/", async (request, response) => {
  const userRef = db.collection("users").doc("alovelace");
  const doc = await userRef.get();
  // console.log(doc);
  if (!doc.exists) {
    console.log("No doc");
  } else {
    console.log(doc.data());
  }
  response.json({ message: "Hey! This is your server response!" });
});

// Set up routes
const user = require("./routes/user");

app.use("/user", user);

const secure = require("./routes/secure");
// Plug in the JWT strategy as a middleware so only verified users can access this route.
app.use("/", passport.authenticate("jwt", { session: false }), secure);

// Handle errors.
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({ error: err });
});

// Server running on port 5000
app.listen(5000, () => {
  console.log("Listening on 5000");
});
