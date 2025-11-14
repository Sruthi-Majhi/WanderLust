if(process.env.NODE_ENV != "production")
{
require("dotenv").config();
}


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");

const engine = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listingsRouter = require("./routes/listings.js");
const reviewsRouter = require("./routes/review.js");
const usersRouter = require("./routes/users.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

let dbUrl = process.env.MONGO_ATLAS;

const port = process.env.PORT || 3000;

const store = MongoStore.create({ 
mongoUrl: dbUrl, 
crypto: { 
secret: "mysupersecretcode", 
}, 
touchAfter: 24 * 3600, 
}); 

 store.on("error", (err) =>{
console.log("ERROR in MONGO SESSION STORE", err); 
 });

const sessionOptions = {
store,
  secret: "mysupersecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true
  }
}

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




app.set("view engine", "ejs");
app.engine("ejs", engine);
app.set("views", path.join(__dirname, "/views"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.json());
app.use((req, res, next)=>
  {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
  });

app.get("/", (req, res) => {
  res.redirect("/listings");
});
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/listings", listingsRouter);
app.use("/", usersRouter);

async function main() {
  await mongoose.connect(dbUrl, {
    ssl: true,
    retryWrites: true,
    w: "majority",
  });
}


main()
  .then(() => {
    console.log("Connection established");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(port, () => {
  console.log(`listening at ${port}`);
});





app.all("*", (req, res, next) => {
  throw new ExpressError(404, "page not found!");
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "something went wrong" } = err;
  res.status(statusCode).render("error.ejs", { message });
});