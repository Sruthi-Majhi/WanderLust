const User = require("../models/user.js");

module.exports.renderSignUpForm = (req, res) => {
    res.render("users/users");
  }

  module.exports.signup = async (req, res) => {
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
  }

  module.exports.renderLoginForm =  (req, res) => {
    res.render("users/login");
  }

  module.exports.login =  async (req, res) => {
    req.flash("success", "you are logged in!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
  
}


module.exports.logout = (req, res, next) =>
    {
      req.logout((err) =>
      {
        if(err)
          return next(err);
    
      req.flash("error", "you are logged out!");
      res.redirect("/login");
    });
    }