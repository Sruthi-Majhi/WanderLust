const listing = require("../models/listing.js");
const Review = require("../models/reviews.js");

module.exports.newReview = async (req, res) => {
    let listings = await listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;

    listings.reviews.push(newReview);

    await newReview.save();
    await listings.save();
    req.flash("success", "New review created!");

    res.redirect(`/listings/${listings._id}`);
  }


  module.exports.destroyReview = async (req, res, next) => {
    let {id, reviewId} = req.params;
    await listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted!")
    res.redirect(`/listings/${id}`);
    }