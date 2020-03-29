const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const passport = require("passport");

// Login Page
router.get("/login", (request, response) => {
    response.render("login");
});

// Register Page
router.get("/register", (request, response) => {
    response.render("register");
});

// Handle Register
router.post("/register", (request, response) => {
    const { name, email, password, password2 } = request.body;
    let errors = [];

    // Check For Required Fields
    if (!name || !email || !password || !password2) {
        errors.push({
            message: "Please Fill In Empty Fields"
        });
    }

    // Check Password Match
    if (password !== password2) {
        errors.push({
            message: "Passwords Do Not Match"
        });
    }

    // Check Password Length
    if (password.length < 8) {
        errors.push({
            message: "Password Should Not Be Less Than 8 Characters"
        });
    }

    // Check For Error
    if (errors.length > 0) {
        response.render("register", {
            errors,
            name,
            email,
            password,
            password2
        });
    } else {
        // Validation Passed
        User.findOne({ email: email })
            .then(user => {
                if (user) {
                    // User Exist
                    errors.push({
                        message: "Email Has Already Been Registered"
                    });
                    response.render("register", {
                        errors,
                        name,
                        email,
                        password,
                        password2
                    });
                } else {
                    const newUser = new User({
                        name,
                        email,
                        password
                    });

                    // Hash Password
                    bcrypt.genSalt(10, (error, salt) => {
                        bcrypt.hash(newUser.password, salt, (error, hash) => {
                            if (error) throw error;

                            // Set Password To Hashed
                            newUser.password = hash;

                            // Save New User
                            newUser.save()
                                .then(user => {
                                    request.flash("success_message", "You Are Now Registered And Can Log In");
                                    response.redirect("/users/login");
                                })
                                .catch(error => {
                                    console.log(error);
                                })
                            ;
                        });
                    });
                }
            })
        ;
    }
});

// Handle Log In
router.post("/login", (request, response, next) => {
    passport.authenticate("local", {
        successRedirect: "/dashboard",
        failureRedirect: "/users/login",
        failureFlash: true
    })(request, response, next);
});

// Handle Log Out
router.get("/logout", (request, response) => {
    request.logout();
    request.flash("success_message", "You Are Logged Out");
    response.redirect("/users/login");
});

module.exports = router;