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

// Set up routes
// const images = require("./routes/image");
const user = require("./routes/user");
// Set up secure routes
const secure = require("./routes/secure");

// Plug in the JWT strategy as a middleware so only verified users can access this route.
// Set up passport for auth
app.use("/images", passport.authenticate("jwt", { session: false }), secure);

// Use Express routes
// app.use("images/", images);
app.use("/user", user);

app.get("/", async (_, response) => {
  response.json({ message: "Hey! The server is running!" });
});

// Handle errors.
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({ error: err });
});

// Server running on port 5000
app.listen(5000, () => {
  console.log("Listening on 5000");
});

module.exports = app;
