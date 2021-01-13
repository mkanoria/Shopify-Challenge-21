const express = require("express");
const router = express.Router();
const { cloudinaryUpload } = require("../services/cloudinary");
const firebase = require("firebase");
const db = require("../services/db").db;

router.get("/profile", (req, res, next) => {
  res.json({
    message: "You made it to the secure route",
    user: req.user,
    token: req.query.secret_token,
  });
});

// image upload API
router.post("/upload", (request, response) => {
  // collected image from a user
  const data = {
    image: request.body.image,
  };
  cloudinaryUpload(data.image)
    .then(async (result) => {
      // Create a new Firestore document with the Cloudinary ID
      const imageRef = db.collection("images").doc(result.id);
      const userRef = db.collection("users").doc(request.user.email);
      // Create res object
      const res = {
        ...result,
        title: request.body.title,
        tags: request.body.tags,
      };

      // Atomically add a new region to the "regions" array field.
      await userRef.update({
        // apple: firebase.firestore.FieldValue.increment(16),
        // test: db.FieldValue.arrayUnion()
        images: firebase.firestore.FieldValue.arrayUnion(res.id),
      });
      // Update the image document with the required fields
      await imageRef.set(res);
      console.log(res);
      response.status(200).send({
        res,
      });
    })
    .catch((error) => {
      response.status(500).send({
        message: "Failure",
        error,
      });
    });
});

router.post("/delete1", async (req, resp) => {
  const u = db.collection("users").doc(req.user.email);
  resp.send("Hello");
});

// image delete endpoint
router.delete("/delete/:imageID", async (request, response) => {
  // collected image from a user
  const imageID = request.params.imageID;

  // Verify that the image exists
  const userRef = db.collection("users").doc(request.user.email);

  const doc = await userRef.get();
  if (!doc.exists) {
    return res.status(400).json({ error: "You have no record stored" });
  }

  if (!doc.data().images) {
    console.log("No images found");
  }

  if (doc.data().images.includes("test")) {
    console.log("found");
  } else {
    console.log("Nope");
  }

  response.send("Hello there");

  // console.log(images);
  // Then delete the image from Firestore

  // const docRef = db.collection("images").doc();
  /*
  cloudinaryDelete(data.image)
    .then(async (result) => {
      // Create a new Firestore document with the Cloudinary ID
      // const docRef = db.collection("images").doc(result.id);

      // const res = {
      //   ...result,
      //   title: request.body.title,
      //   tags: request.body.tags,
      // };
      // try {
      //   await docRef.set(res);
      // } catch (error) {
      //   return res.status(400).json({ error: error.toString() });
      // }
      response.status(200).send({
        Status: "Okay",
      });
    })
    .catch((error) => {
      response.status(500).send({
        message: "failure",
        error,
      });
    });
    */
});

module.exports = router;
