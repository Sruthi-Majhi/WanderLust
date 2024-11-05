const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const listing = require("../models/listing.js");
const {isLoggedIn} = require("../middleware.js");


router.get(
  "/",
  wrapAsync(async (req, res) => {
    const listings = await listing.find();
    res.render("listing/index", { listings });
  })
);

router.get(
  "/:id/edit",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const detail = await listing.findById(id);
    if(!detail)
    {
      req.flash("error", "The listing does not exist!");
      res.redirect("/listings");
    }
    res.render("listing/edit.ejs", { listing: detail });
  })
);

router.get("/new", isLoggedIn, (req, res) => {
  res.render("listing/new.ejs");
});

router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const detail = await listing.findById(id).populate("reviews");
    if(!detail)
      {
        req.flash("error", "The listing does not exist!");
        res.redirect("/listings");
      }
    console.log(detail);
    res.render("listing/show.ejs", { listing: detail });
  })
);

const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);

  if (error) {
    throw new ExpressError(400, error);
  } else {
    next();
  }
};

router.post(
  "/",
  isLoggedIn,
  validateListing,
  wrapAsync(async (req, res, next) => {
    const listed = new listing(req.body.listing);
    await listed.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
  })
);

router.put(
  "/:id",
  isLoggedIn,
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
  })
);

router.delete(
  "/:id",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");

    res.redirect("/listings");
  })
);

module.exports = router;
