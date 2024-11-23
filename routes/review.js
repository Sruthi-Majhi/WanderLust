const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schema.js");
const listing = require("../models/listing.js");
const Review = require("../models/reviews.js");
const { isLoggedIn } = require("../middleware.js");

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
  isLoggedIn,
  validateReview,
  wrapAsync(async (req, res) => {
    let listings = await listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;

    listings.reviews.push(newReview);

    await newReview.save();
    await listings.save();
    req.flash("success", "New review created!")

    res.redirect(`/listings/${listings._id}`);
  })
);

router.delete("/:reviewId", wrapAsync(async (req, res, next) => {
  let {id, reviewId} = req.params;
  let listing = await listing.findById(id);
  await listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
  await Review.findByIdAndDelete(reviewId);
  
  res.redirect(`/listings/${id}`);
  }));

module.exports = router;
