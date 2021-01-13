const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const db = require("../services/db").db;

const router = express.Router();

// define the home page route
router.get("/", function (req, res) {
  res.send({ status: "user/ endpoint is alive" });
});

router.post(
  "/signup",
  passport.authenticate("signup", { session: false }),
  async (req, res, next) => {
    const userRef = db.collection("users").doc(req.user.email);
    await userRef.update({
      name: req.body.name,
    });

    res.json({
      message: "Signup successful",
      email: req.user.email,
      name: req.body.name,
    });
  }
);

router.post("/login", async (req, res, next) => {
  passport.authenticate("login", async (err, user, info) => {
    try {
      if (err || !user) {
        return next(info);
      }

      req.login(user, { session: false }, async (error) => {
        if (error) return next(error);

        const body = { _id: user._id, email: user.email };
        const token = jwt.sign({ user: body }, "TOP_SECRET");

        return res.json({ token });
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
});

module.exports = router;
