const cloudinary = require("cloudinary");

// Helper methods to handle Cloudinary Upload, Download and Delete

const cloudinaryUpload = (image) => {
  return new Promise(async (resolve, reject) => {
    // upload image here
    cloudinary.uploader
      .upload(image)
      .then((result) => {
        resolve({ id: result.public_id, url: result.secure_url });
      })
      .catch((error) => {
        reject(error);
      });
  });
};

module.exports = {
  cloudinaryUpload,
};
