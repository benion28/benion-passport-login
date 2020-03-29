const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const app = express();
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");

// Passport Config
require("./config/passport")(passport);

// Database Config
const database = require("./config/keys").MongoURI;

// Connect To Database
mongoose.connect(database, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MongoDB Connected Successfully...");
    })
    .catch(error => {
        console.log(error);
    })
;

// EJS
app.use(expressLayouts);
app.set("view engine", "ejs");

// BodyParser
app.use(express.urlencoded({ extended: false }));

// Express Session
app.use(session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect Flash
app.use(flash());

// Global Variable
app.use((request, response, next) => {
    response.locals.success_message = request.flash("success_message");
    response.locals.error_message = request.flash("error_message");
    response.locals.error = request.flash("error");
    next();
});

// Routes
app.use("/", require("./routes/index"));
app.use("/users", require("./routes/users"));

const PORT = process.env.PORT || 8828;
app.listen(PORT, console.log(`Server Started On Port ${PORT}`));