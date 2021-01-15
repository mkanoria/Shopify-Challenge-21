const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const db = require("../services/db").db;
const { body, validationResult } = require("express-validator");

const router = express.Router();

// define the home page route
router.get("/", function (req, res) {
  res.send({ status: "ok" });
});

router.post(
  "/signup",
  body("email").isEmail(),
  body("password").isLength({ min: 5 }),
  passport.authenticate("signup", { session: false }),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const userRef = db.collection("users").doc(req.body.email);
    await userRef.set({
      hashedPassword: req.user.hashedPassword,
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

        return res.json({ status: "Successful", token });
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
});

module.exports = router;
