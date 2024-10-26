const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const engine = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listings = require("./routes/listings.js");
const reviews = require("./routes/review.js");

let mongoUrl = "mongodb://127.0.0.1:27017/wanderlust";

let port = 8080;

app.set("view engine", "ejs");
app.engine("ejs", engine);
app.set("views", path.join(__dirname, "/views"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.json());
app.use("/listings/:id/reviews", reviews);
app.use("/listings", listings);

async function main() {
  await mongoose.connect(mongoUrl);
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

app.get("/", (req, res) => {
  res.send("server working fine");
});

app.all("*", (req, res, next) => {
  throw new ExpressError(404, "page not found!");
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "something went wrong" } = err;
  res.status(statusCode).render("error.ejs", { message });
});
