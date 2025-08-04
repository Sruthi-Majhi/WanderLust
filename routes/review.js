const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schema.js");
const { isLoggedIn, isReviewAuthor } = require("../middleware.js");
const reviewController = require("../controllers/review.js");

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
  wrapAsync(reviewController.newReview)
);

router.delete("/:reviewId",
  isLoggedIn,
  isReviewAuthor,
   wrapAsync(reviewController.destroyReview));

module.exports = router;
