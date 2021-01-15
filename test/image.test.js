const request = require("supertest");
const chai = require("chai");
const expect = chai.expect;

const app = require("../server");

function generateRandomEmail() {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < 7; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  result += "@sample.com";
  return result;
}

const ExistingUser = {
  password: "password",
  email: "testing@sample.com",
  name: "Mayank",
};

async function getToken() {
  const resp = await request(app).post("/user/login").send(ExistingUser);
  return resp.body.token;
}

describe("Test Image Endpoints", async () => {
  const token = await getToken();
  let imageID = "";

  describe("Image Health", () => {
    it("Test Health endpoint", async () => {
      const resp = await request(app).get(
        `/images/health?secret_token=${token}`
      );
      expect(resp.status).to.equal(200);
      // Check whether the response body status is "ok"
      expect(resp.body.message).to.equal("Successful!");
    });
  });

  describe("Image Upload Endpoints", () => {
    const imagePayload = {
      image: "test/images/pic.png",
      title: "sample title",
      tags: ["profile", "person"],
    };

    it("Test Image Upload", async () => {
      const resp = await request(app)
        .post(`/images?secret_token=${token}`)
        .send(imagePayload);
      expect(resp.status).to.equal(200);
      imageID = resp.body.res.id;
    });
  });

  describe("Image List Endpoint", () => {
    it("Test Image List", async () => {
      const resp = await request(app).get(`/images?secret_token=${token}`);
      //   expect(resp.status).to.equal(200);
      expect(resp.body.images.length).to.equal(1);
      expect(resp.body.images[0].id).to.equal(imageID);
    });
  });

  describe("Image Delete Endpoints", () => {
    it("Test Image Delete", async () => {
      const resp = await request(app).delete(
        `/images/${imageID}?secret_token=${token}`
      );
      expect(resp.status).to.equal(200);
      expect(resp.body.Status).to.equal("Deleted image");
    });
  });
});
