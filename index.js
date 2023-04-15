const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const nodemailer = require('nodemailer');
const Slack = require('slack-api-client');

// Initialize Express app
const app = express();

// Connect to MongoDB database
mongoose.connect('mongodb://localhost/deployinator');

// Define User schema for authentication
const User = mongoose.model('User', {
  username: String,
  password: String
});

// Configure Passport.js with local strategy
passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      if (user.password !== password) { return done(null, false); }
      return done(null, user);
    });
  }
));

// Use Passport.js for authentication in Express app
app.use(passport.initialize());
app.use(passport.session());

// Define routes for login and logout
app.post('/login',
  passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/login' })
);
app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

// Start server listening on port 3000
app.listen(3000, function() {
  console.log('Deployinator app listening on port 3000!');
});
