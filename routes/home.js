const express = require('express');
const app = express();

app.get('/', checkLoggedIn, async (req, res) => {
  try {
    // Add your code here to handle the request and send a response
    res.render("home/dashboard", {
        admin_: req.session.admin
    })
  } catch (error) {
    // Handle any errors that occur during request processing
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Helper Functions

//This function checks if the user is logged in, if thats not the case go to login page
function checkLoggedIn(req, res, next) {
    // Check if the email session is set and not null
    if (!req.session.email || !req.session.loggedIn) {
      // Redirect the user to a specific route if they are not logged in
      res.redirect('/account/login');
    }
    else {
      // If the user is logged in,Move to the next middleware/route handler
      next();
    }
  }

module.exports = app;
