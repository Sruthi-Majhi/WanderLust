const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirect } = require("../middleware.js");
const usersController = require("../controllers/user.js");

router.get("/signup", usersController.renderSignUpForm);

router.post(
  "/signup",
  wrapAsync(usersController.signup)
);

router.get("/login", usersController.renderLoginForm);

router.post("/login", saveRedirect, passport.authenticate('local', { failureRedirect: '/login' , failureFlash: true}), usersController.login);

router.get("/logout", usersController.logout);

module.exports = router;
