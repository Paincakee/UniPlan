const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')


const saltRounds = 10 // Time for hashing algorithm

router.get('/', (req, res) => {
  res.send("Bozo")
})

///////////////
///"account"///
///////////////

//REGISTER ROUTER
router
  .route('/new')
  .get((req, res) => {
    res.render('account/register')
  
  })
  .post(async (req, res) => {
    try {
      let email = req.body.email
      req.session.email = email
      let studentNumber = req.body.studentNumber
      // Check if email or student number already exists
      const get_studentNumber = await db.sql('account/get_studentNumbers', {
        studentNumber: studentNumber
      })
      const get_email = await db.sql('account/get_emails', {
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
          const result = await db.sql("account/createAccount", {
            firstName: req.body.firstName, 
            lastName: req.body.lastName,
            studentNumber: studentNumber,
            email: email,
            password: hash,
            accountType: req.body.accountType,
            table: "accounts_pending"
          })
        })
      })

      // Redirect to login page
      res.redirect('./login')
    } catch (error) {
        res.render('account/register', {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        studentNumber: req.body.studentNumber,
        email: req.body.email,
        error: error.message // Pass the error message to the view
      })
    }
  })

//LOGIN ROUTER
router
  .route('/login')
  .get((req, res) => {

    res.render('account/login')
  })
  .post( async (req, res) => {
    try {
      const dbPass = await db.sql("account/get_user_info", {
        typeValue: req.body.email,
        type: 'email',
        table: 'accounts'
      })
      
      if (dbPass.data.length === 0) {
        throw new Error("Wrong credentials")
      }

      const match = await bcrypt.compare(req.body.password, dbPass.data[0].password)

      if (!match) {
        throw new Error("Wrong credentials")
      }

      // Successful login
      req.session.email = req.body.email; // Set session variable
      req.session.id = req.body.id; // Set session variable

      res.redirect('../chat')
    } catch (error) {
        console.error(error);
        res.status(400).render('account/login', {
          email: req.body.email,
          error: error.message // Pass the error message to the view
        })
    }
  })

//////////////
///"/admin"///
//////////////
router.get('/admin', async (req, res) =>{
  try {

    let email = req.session.email
    const adminCheck = await db.sql('account/get_user_info', {
      typeValue: email,
      type: "email",
      table: "accounts"
    })

    if(!adminCheck.data[0].admin){
      throw new Error ("You are not an admin")
    }
    
    const pending = await db.sql('account/get_all',{
      table: 'accounts_pending'
    })
    res.render("account/adminPanel", {
      data: pending.data
    })
  } catch (error) {
     // Redirect to dashboard page
     console.log(error);
     res.redirect('../home/dashboard')
  }
})

//APPROVE ROUTER
router.get("/admin/approve/:id", async (req, res) =>{
  try {
    let userId = req.params.id

    const getUser = await db.sql("account/get_user_info",{
      table: "accounts_pending",
      type: 'id',
      typeValue: userId,
    })
    console.log(getUser);
    const createAccount = await db.sql("account/createAccount",{
      table: "accounts",
      firstName: getUser.data[0].firstName,
      lastName: getUser.data[0].lastName,
      email: getUser.data[0].email,
      studentNumber: getUser.data[0].studentNumber,
      password: getUser.data[0].password,
      accountType: getUser.data[0].accountType,
    })

    const deleteOld = await db.sql("account/deleteAccount",{
      table: "accounts_pending",
      id: userId,
    })

    res.redirect("../")
   
  } catch (error) {
    console.log(error);
  }
})

//DECLINE ROUTER
router.get("/admin/decline/:id", async (req, res) =>{
  try {

    let userId = req.params.id

    const deleteOld = await db.sql("account/deleteAccount",{
      table: "accounts_pending",
      id: userId,
    })

    res.redirect("../")

   
  } catch (error) {
    
  }
  
})

router.get('/test', (req, res) => {

  const email = req.session.email
  res.send(`Email: ${email}`)
})

module.exports = router
