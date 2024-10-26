const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const listing = require("../models/listing.js");

router.get(
  "/",
  wrapAsync(async (req, res) => {
    const listings = await listing.find();
    res.render("listing/index", { listings });
  })
);

router.get(
  "/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const detail = await listing.findById(id);
    res.render("listing/edit.ejs", { listing: detail });
  })
);

router.get("/new", (req, res) => {
  res.render("listing/new.ejs");
});

router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const detail = await listing.findById(id).populate("reviews");
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
  validateListing,
  wrapAsync(async (req, res, next) => {
    const listed = new listing(req.body.listing);
    await listed.save();
    res.redirect("/listings");
  })
);

router.put(
  "/:id",
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
  })
);

router.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await listing.findByIdAndDelete(id);
    res.redirect("/listings");
  })
);

module.exports = router;
