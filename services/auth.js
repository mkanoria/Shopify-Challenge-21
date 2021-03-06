const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const JWTstrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;
const bcrypt = require("bcrypt");
const db = require("./db").db;

// Signup
passport.use(
  "signup",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      // Validate email, password
      const userRef = db.collection("users").doc(email);
      const doc = await userRef.get();
      if (doc.exists) {
        done({ status: 406, info: "User already exists" });
      } else {
        // Create new User with email
        const hashedPassword = await bcrypt.hash(password, 10);
        return done(null, { hashedPassword: hashedPassword });
      }
    }
  )
);

const validatePassword = async (inputPassword, actualPassword) => {
  // Validate a given password with another
  return await bcrypt.compare(inputPassword, actualPassword);
};

// Login
passport.use(
  "login",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const userRef = db.collection("users").doc(email);
        const doc = await userRef.get();

        if (!doc.exists) {
          console.log("User not found");
          return done(null, false, { message: "User not found" });
        }
        const { hashedPassword } = doc.data();
        const validate = await validatePassword(password, hashedPassword);

        if (!validate) {
          console.log("Wrong password");
          return done(null, false, { message: "Wrong Password" });
        }

        return done(
          null,
          { email: email },
          { message: "Logged in Successfully" }
        );
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.use(
  new JWTstrategy(
    {
      secretOrKey: "TOP_SECRET",
      jwtFromRequest: ExtractJWT.fromUrlQueryParameter("secret_token"),
    },
    async (token, done) => {
      try {
        return done(null, token.user);
      } catch (error) {
        console.log(error);
        done(error);
      }
    }
  )
);
