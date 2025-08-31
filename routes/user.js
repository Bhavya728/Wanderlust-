
const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl, isLoggedIn } = require("../middleware.js");


const userController = require("../controllers/users.js");


router
    .route("/signup")
    .get(userController.rendersignupForm)
    .post(wrapAsync(userController.signup));


router
    .route("/login")
    .get(userController.renderLoginForm)
    .post(saveRedirectUrl,
        passport.authenticate("local", {
            failureRedirect: "/login", 
            failureFlash: true,
        }), 
        userController.login
    );


router.get("/logout", userController.logout);

// Favorites routes
router.get("/favorites", isLoggedIn, wrapAsync(userController.showFavorites));
router.post("/favorites/:id", isLoggedIn, wrapAsync(userController.addToFavorites));
router.delete("/favorites/:id", isLoggedIn, wrapAsync(userController.removeFromFavorites));


module.exports = router;