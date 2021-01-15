const express = require("express");
const router = express.Router();
const {
  cloudinaryUpload,
  cloudinaryDelete,
} = require("../services/cloudinary");
const firebase = require("firebase");
const db = require("../services/db").db;

router.get("/health", (req, res) => {
  res.json({
    message: "Successful!",
  });
});

// image upload API
router.post("/", (request, response) => {
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
        images: firebase.firestore.FieldValue.arrayUnion(res.id),
      });
      // Update the image document with the required fields
      await imageRef.set(res);
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

// image delete endpoint
router.delete("/:imageID", async (request, response) => {
  // collecte imageID from a user
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

  if (doc.data().images.includes(imageID)) {
    // Since image exists delete the image from Firestore
    await userRef.update({
      images: firebase.firestore.FieldValue.arrayRemove(imageID),
    });
    // Delete the image document
    const res = await db.collection("images").doc(imageID).delete();
    // console.log("Deleted from Firestore");
  } else {
    return response
      .status(404)
      .json({ error: "This image ID does not exist for the user" });
  }

  cloudinaryDelete(imageID)
    .then(async (result) => {
      response.status(200).send({
        Status: "Deleted image",
      });
    })
    .catch((error) => {
      response.status(500).send({
        message: "Failure",
        error,
      });
    });
});

// image list endpoint
router.get("/", async (request, response) => {
  // Get all images for a user

  const userRef = db.collection("users").doc(request.user.email);

  const doc = await userRef.get();
  if (!doc.exists) {
    return res.status(400).json({ error: "You have no record stored" });
  }
  let res = { images: [] };

  if (!doc.data().images) {
    console.log("No images found");
    return response.status(200).send({
      ...res,
    });
  }

  const images = doc.data().images;
  for (let i = 0; i < images.length; i++) {
    const image = images[i];
    const imageRes = await db.collection("images").doc(image).get();
    // console.log(imageRes.data());
    if (imageRes.exists) {
      res.images.push(imageRes.data());
    }
  }

  response.status(200).send({
    ...res,
  });
});

module.exports = router;
