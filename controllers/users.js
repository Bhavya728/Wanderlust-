
const User = require("../models/user");
const Listing = require("../models/listing");


module.exports.rendersignupForm = (req, res) => { 
    res.render("users/signup.ejs");
};

module.exports.signup = async (req, res) => {   
    try{
        let {username, email, password} = req.body;
        const newUser = new User({email, username});
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);

     
        req.login(registeredUser, (err) => {
        if(err) {
          return next(err);
        }
          req.flash("success", "Welcome to Wanderlust");
          res.redirect("/listings");
        });
        }  catch(e) {
         req.flash("error",e.message);
         res.redirect("/signup");
    }  
};

module.exports.renderLoginForm = (req, res) => { 
    res.render("users/login.ejs");
};

module.exports.login =  async (req, res) => {
    req.flash("success","Welcome to WanderLust!! You are logged in");

    
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if(err) {
           return next(err);
        }
        req.flash("success", "you are logged out now");
        res.redirect("/listings");
    });
};

module.exports.addToFavorites = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(req.user._id);
        
        // Check if listing already in favorites
        if (user.favorites.includes(id)) {
            req.flash("error", "Listing already in favorites");
            return res.redirect(`/listings/${id}`);
        }
        
        // Add to favorites
        user.favorites.push(id);
        await user.save();
        
        req.flash("success", "Added to favorites!");
        res.redirect(`/listings/${id}`);
    } catch (e) {
        req.flash("error", "Error adding to favorites");
        res.redirect("/listings");
    }
};

module.exports.removeFromFavorites = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(req.user._id);
        
        // Remove from favorites
        user.favorites.pull(id);
        await user.save();
        
        req.flash("success", "Removed from favorites");
        res.redirect(`/listings/${id}`);
    } catch (e) {
        req.flash("error", "Error removing from favorites");
        res.redirect("/listings");
    }
};

module.exports.showFavorites = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate({
            path: "favorites",
            populate: { path: "review" }
        });
        
        res.render("users/favorites.ejs", { favorites: user.favorites });
    } catch (e) {
        req.flash("error", "Error loading favorites");
        res.redirect("/listings");
    }
};