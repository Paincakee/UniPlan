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
    // Check if email or student number already exists
    const get_studentNumber = await db.sql('account/get_student', {
      studentNumber: req.body.studentNumber
    })
    const get_email = await db.sql('account/get_mail', {
      email: req.body.email
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
          studentNumber: req.body.studentNumber,
          email: req.body.email,
          password: hash,
          accountType: req.body.accountType
        })
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
    //Hash Password
    const password = req.body.password; // the password to be hashed

    bcrypt.genSalt(saltRounds, function(err, salt) { 
      bcrypt.hash(password, salt, async function(err, hash) { //Hasher
        const login = await db.sql('account/login', {
          email: req.body.email,
          password: hash
        })
    
        if (login.data.length < 1) throw new Error("Credentials aren't correct")
      })
    })

    res.redirect('../home/dashboard')
  } catch (error) {
    console.error(error)
    res.render('account/login', {
      email: req.body.email,
      error: error.message // Pass the error message to the view
    })
  }
})

router.get('/admin', async (req, res) =>{
  try {
    const result = await db.sql('account/get_all') 
    res.json(result)
    console.log(result);
  } catch (error) {
    
  }
})

module.exports = router
