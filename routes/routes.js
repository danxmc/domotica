let User = require('../models/user');
module.exports = (app, passport) => {
    // HOME PAGE
    app.get('/', (req, res) => {
        res.render('index.ejs');
    });

    // LOGIN
    app.get('/login', (req, res) => {
        // render the page and pass in any flash data if it exists
        res.render('login.ejs', { message: req.flash('loginMessage') });
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        // redirect to the secure profile section
        successRedirect: '/profile',
        // redirect back to the signup page if there is an error
        failureRedirect: '/login',
        // allow flash messages
        failureFlash: true
    }));

    // SIGNUP
    app.get('/signup', (req, res) => {
        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        // redirect to the secure profile section
        successRedirect: '/profile',
        // redirect back to the signup page if there is an error
        failureRedirect: '/signup',
        // allow flash messages
        failureFlash: true
    }));

    // PROFILE SECTION
    // Protected view, needs to be logged in to visit, uses middleware
    app.get('/profile', isLoggedIn, (req, res) => {
        User.find({}).exec((err, users) => {
            if (err) throw err;
            res.render('profile.ejs', {
                users: users,
                user: req.user
            });
        });
        /*
        res.render('profile.ejs', {
            // get the user out of session and pass to template
            user: req.user
        });*/
    });

    // LOGOUT
    app.get('/logout', (req, res) => {
        req.logout();
        res.redirect('/');
    });

    // DELETE USER
    app.post('/delete/:_id', isLoggedIn, (req, res) => {
        // Check if session user is admin
        if (req.user.local.role == "ROLE_ADMIN") {
            User.findByIdAndRemove(req.params._id, (err, res) => {
                if (err) throw err;
            });
        } else {
            res.render('profile.ejs', { message: req.flash("adminMessage", "You need to be an admin in order to perform this function") });
        }
        res.redirect('/profile');
    });
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated()) {
        return next();
    } else {
        // if they aren't redirect them to the home page
        res.redirect('/');
    }
}
