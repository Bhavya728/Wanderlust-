
const Listing = require("../models/listing"); 
const User = require("../models/user");


module.exports.index = async (req, res) => { 
    const allListings = await Listing.find({}).populate("review");
    res.render ("listings/index.ejs", {allListings});
};


module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};


module.exports.showListing = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id)
        .populate({ 
            path: "review", 
            populate: { path: "author"}})
        .populate("owner");
    
    if(!listing) {
        req.flash("error", "listing you requested for does not exist")
        res.redirect("/listings");
    }
    
    // If user is logged in, populate their data including favorites
    if (req.user) {
        req.user = await User.findById(req.user._id);
    }
    
    console.log(listing);
    res.render("listings/show.ejs", { listing });
};


module.exports.createListing = async (req, res, next) => {
    let url = "https://images.unsplash.com/photo-1625505826533-5c80aca7d8d1?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"; // Default image
    let filename = "default_listing";
    
    if(req.file) {
        url = req.file.path;
        filename = req.file.filename;
    }

    const newListing = new Listing( req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    await newListing.save();
    req.flash("success", "New listing created!");
    res.redirect("/listings");
};


module.exports.renderEditForm = async (req, res ) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error", "listing you requested for does not exist")
        res.redirect("/listings");
    }
 
    let originalImageUrl = listing.image.url; 
        originalImageUrl= originalImageUrl.replace("upload", "/upload/w_250")
        res.render("listings/edit.ejs", { listing, originalImageUrl });
};


module.exports.updateListing = async (req, res) => {
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});

    if(typeof req.file !== "undefined") {
        let url = req.file.path; 
        let filename = req.file.filename;  
        listing.image = { url, filename }; 
        await listing.save();    
    }
    req.flash("success","Listing Updated!!");
    res.redirect(`/listings/${id}`);
};


module.exports.destroyListing = async (req, res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "listing deleted");
    res.redirect("/listings");
};

module.exports.searchListings = async (req, res) => {
    try {
        const { q } = req.query;
        
        if (!q || q.trim() === '') {
            return res.redirect("/listings");
        }

        // Create a case-insensitive search query for multiple fields
        const searchQuery = {
            $or: [
                { title: { $regex: q, $options: "i" } },
                { location: { $regex: q, $options: "i" } },
                { country: { $regex: q, $options: "i" } },
                { description: { $regex: q, $options: "i" } }
            ]
        };

        const searchResults = await Listing.find(searchQuery).populate("review");
        
        res.render("listings/search.ejs", { 
            searchResults, 
            searchQuery: q,
            resultsCount: searchResults.length
        });
    } catch (err) {
        console.error("Search error:", err);
        req.flash("error", "Error occurred during search");
        res.redirect("/listings");
    }
};