const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");


module.exports = function(passport) {
    passport.use(
        new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
            // Match User
            User.findOne()
                .then(user => {
                    if (!user) {
                        return done(null, false, { message: "That Email Is Not Registered" });
                    }

                    // Match Password
                    bcrypt.compare(password, user.password, (error, isMatch) => {
                        if (error) throw error;
                        if (isMatch) {
                            return done(null, user);
                        } else {
                            return done(null, false, { message: "Incorrect Password" });
                        }
                    });
                })
                .catch(error => {
                    console.log(error);
                })
            ;
        })
    );

    // Serialize User
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    // Deserialize User
    passport.deserializeUser((id, done) => {
        User.findById(id, (error, user) => {
            done(error, user);
        });
    });
};