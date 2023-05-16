const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')

const saltRounds = 10 // Time for hashing algorithm

router.get('/', (req, res) => {
  res.send("Bozo")
})

router.get('/new', (req, res) => {
  res.render('account/register')
})

router.post('/new', async (req, res) => {
  try {
    let email = req.body.email
    let studentNumber = req.body.studentNumber
    // Check if email or student number already exists
    const get_studentNumber = await db.sql('account/get_student', {
      studentNumber: studentNumber
    })
    const get_email = await db.sql('account/get_mail', {
      email: email
    })

    if (get_studentNumber.data.length > 0) {
      throw new Error('Student number already exists')
    }
    if (get_email.data.length > 0) {
      throw new Error('Email already exists')
    }

    //Hash Password
    const password = req.body.password; // the password to be hashed

    bcrypt.genSalt(saltRounds, function(err, salt) { 
      bcrypt.hash(password, salt, async function(err, hash) { //Hasher
        // Create new account
        const result = await db.sql("account/register", {
          firstName: req.body.firstName, 
          lastName: req.body.lastName,
          studentNumber: studentNumber,
          email: email,
          password: hash,
          accountType: req.body.accountType
        })

        console.log(hash);
      })
    })

    // Redirect to login page
    res.redirect('./login')
  } catch (error) {
    console.error(error)
    res.render('account/register', {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      studentNumber: req.body.studentNumber,
      email: req.body.email,
      error: error.message // Pass the error message to the view
    })
  }
})

router.get('/login', (req, res) => {
  res.render('account/login')
})

router.post('/login', async (req, res) => {
  try {
    const dbPass = await db.sql("account/get_password", {
      email: req.body.email
    });

    if (dbPass.data.length === 0) {
      throw new Error("Wrong credentials");
    }

    const match = await bcrypt.compare(req.body.password, dbPass.data[0].password);

    if (!match) {
      throw new Error("Wrong credentials");
    }

    // Successful login
    req.session.email = req.body.email; // Set session variable

    res.redirect('./example')
  } catch (error) {
    console.error(error);
    res.status(400).render('account/login', {
      email: req.body.email,
      error: error.message // Pass the error message to the view
    })
  }
})




router.get('/admin', async (req, res) =>{
  try {
    const result = await db.sql('account/get_all');
    const admins = [];
    
    result.data.forEach((item) => {
      const adminObj = {
        email: item.email,
        admin: item.admin
      };
      admins.push(adminObj);
    });
    
    res.json(admins);
    
  } catch (error) {
    
  }
})

router.get('/example', (req, res) => {
  const email = req.session.email;
  res.send(`Email: ${email}`);
});

module.exports = router
