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

const testUser = {
  password: "password",
  email: generateRandomEmail(),
  name: "Mayank",
};

const existingUser = {
  password: "password",
  email: "test@sample.com",
  name: "Mayank",
};

describe("Test User Endpoints", () => {
  describe("User Auth", () => {
    it("Test Health endpoint", async () => {
      const resp = await request(app).get("/user");
      expect(resp.status).to.equal(200);
      // Check whether the response body status is "ok"
      expect(resp.body.status).to.equal("ok");
    });

    it("Signup User", async () => {
      const resp = await request(app).post("/user/signup").send(testUser);
      expect(resp.status).to.equal(200);
      expect(resp.body.message).to.be.equal("Signup successful");
    });

    it("Signup Existing User", async () => {
      const resp = await request(app).post("/user/signup").send(existingUser);
      expect(resp.status).to.equal(406);
      expect(resp.body.error.info).to.be.equal("User already exists");
    });

    it("Login User", async () => {
      const resp = await request(app).post("/user/login").send(testUser);
      expect(resp.status).to.equal(200);
      expect(resp.body.status).to.be.equal("Successful");
    });
  });
});

describe("Test Image Endpoints", async () => {
  const token = await getToken();
  let imageID = "";

  it("Test Health endpoint", async () => {
    const resp = await request(app).get(`/images?secret_token=${token}`);
    expect(resp.status).to.equal(200);
    // Check whether the response body status is "ok"
    expect(resp.body.message).to.equal("Successful!");
  });

  describe("Upload Endpoints", () => {
    const imagePayload = {
      image: "pic.png",
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

  describe("Upload Endpoints", () => {
    it("Test Image Delete", async () => {
      const resp = await request(app).delete(
        `/images/${imageID}?secret_token=${token}`
      );
      expect(resp.status).to.equal(200);
      expect(resp.body.Status).to.equal("Deleted image");
    });
  });
});
