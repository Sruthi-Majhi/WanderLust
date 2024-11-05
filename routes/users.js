const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const User = require("../models/user.js");
const passport = require("passport");

router.get("/signup", (req, res) => {
  res.render("users/users");
});

router.post(
  "/signup",
  wrapAsync(async (req, res) => {
    try {
      let { username, email, password } = req.body;
      let user = new User({
        username,
        email,
      });
      const newUser = await User.register(user, password);
     req.login(newUser, (err) => 
      {
        if(err) return next(err);
      req.flash("success", "Welcome to Wanderlust");
      res.redirect("/listings");
     });
     
    } catch (err) {
      req.flash("error", err.message);
      res.redirect("/signup");
    }
  })
);

router.get("/login", (req, res) => {
  res.render("users/login");
});

router.post("/login", passport.authenticate('local', { failureRedirect: '/login' , failureFlash: true}), async (req, res) => {
    req.flash("success", "you are logged in!");
    res.redirect("/listings");
  
});

router.get("/logout", (req, res, next) =>
{
  req.logout((err) =>
  {
    if(err)
      return next(err);

  req.flash("error", "you are logged out!");
  res.redirect("/login");
});
});

module.exports = router;
