const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schema.js");
const listing = require("../models/listing.js");
const Review = require("../models/reviews.js");

const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);

  if (error) {
    throw new ExpressError(400, error);
  } else {
    next();
  }
};

router.post(
  "/",
  validateReview,
  wrapAsync(async (req, res) => {
    let listings = await listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listings.reviews.push(newReview);

    await newReview.save();
    await listings.save();

    res.redirect(`/listings/${listings._id}`);
  })
);

module.exports = router;
