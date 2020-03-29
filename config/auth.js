module.exports = {
    ensureAuthenticated: function(request, response, next) {
        if (request.isAuthenticated()) {
            return next();
        }
        request.flash("error_message", "Please Log In To View This Page");
        response.redirect("/users/login");
    }
};