const express = require('express');
const app = express();

app.get('/', async (req, res) => {
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

module.exports = app;
