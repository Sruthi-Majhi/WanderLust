const listing = require("../models/listing.js");

module.exports.index = async (req, res) => {
    const listings = await listing.find();
    res.render("listing/index", { listings });
  } 


module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const detail = await listing.findById(id);
    if(!detail)
    {
      req.flash("error", "The listing does not exist!");
      res.redirect("/listings");
    }
  
    res.render("listing/edit.ejs", { listing: detail });
  }


  module.exports.renderNewForm = (req, res) => {
    res.render("listing/new.ejs");
  }

  module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const detail = await listing.findById(id).populate({path : "reviews", populate:{path: "author"},}).populate("owner");
    if(!detail)
      {
        req.flash("error", "The listing does not exist!");
        res.redirect("/listings");
      }
    res.render("listing/show.ejs", { listing: detail });
  }

  module.exports.NewListing = async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;
    
    const listed = new listing(req.body.listing);
    listed.owner = req.user._id;
    listed.image = { url, filename };
    await listed.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
  }

  module.exports.editListing = async (req, res) => {
    let { id } = req.params;
    let Listing = await listing.findByIdAndUpdate(id, { ...req.body.listing });
    if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    Listing.image = {url, filename};
    await Listing.save();
    }
    

    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
  }

  module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    await listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");

    res.redirect("/listings");
  }