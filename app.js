const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const engine = require("ejs-mate");
const listing = require("./models/listing.js");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");

let mongoUrl = "mongodb://127.0.0.1:27017/wanderlust";

let port = 8080;

app.set("view engine", "ejs");
app.engine("ejs", engine);
app.set("views", path.join(__dirname, "/views"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.json());

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
  res.send("server working  fine");
});

// app.get("/testlisting", async (req, res)=>
// {
//     let sampleListing= new listing({
//         title:"My new Villa",
//         description:"By the watch",
//         price:3000,
//         location:"Calungute, Goa",
//         country:"India"

//     });

//     await sampleListing.save();
//     console.log("Sample saved");
//         res.send("Successful");

// });

app.get("/listings", wrapAsync(async (req, res) => {
  const listings = await listing.find();
  res.render("listing/index", { listings });
}));

app.get("/listings/:id/edit", wrapAsync( async (req, res) => {
  let { id } = req.params;
  const detail = await listing.findById(id);
  res.render("listing/edit.ejs", { listing: detail });

}));

app.get("/listings/new", (req, res) => {
  res.render("listing/new.ejs");
});

app.get("/listings/:id", wrapAsync( async (req, res) => {
  let { id } = req.params;
  const detail = await listing.findById(id);
  res.render("listing/show.ejs", { listing: detail });
}));

app.post(
  "/listings",
  wrapAsync(async (req, res, next) => {

    const listed = new listing(req.body);
    await listed.save();
    res.redirect("/listings");
  })
);



app.put("/listings/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  await listing.findByIdAndUpdate(id, { ...req.body});
  res.redirect(`/listings/${id}`);
}));

// app.put("/listings/:id", wrapAsync(async (req, res) => {
//   let { id } = req.params;
//  let updatedListing =  listing.findByIdAndUpdate(id, { ...req.body});
// console.log(id);
// console.log(updatedListing);
// await  updatedListing.save();
//   res.redirect(`/listings/${id}`);
// }));

app.delete("/listings/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  await listing.findByIdAndDelete(id);
  res.redirect("/listings");
}));

app.all("*", (req, res, next) =>
{
  throw new ExpressError(404, "page not found!");
})

app.use((err, req, res, next) => {
  let {statusCode = 500, message = "something went wrong"} = err;
  res.status(statusCode).render("error.ejs", {message});
});
