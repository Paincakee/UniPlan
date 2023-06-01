const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')

const saltRounds = 10 // Time for hashing algorithm

const validator = require('validator');

router.get('/', (req, res) => {
  res.send("Bozo")
})

// Account Registration
router.route('/new')
  .get((req, res) => {
    res.render('account/register')
  })
  .post(async (req, res) => {
    try {
      let email = req.body.email
      req.session.email = email
      let studentNumber = req.body.studentNumber

      // Check if email or student number already exists
      const get_studentNumber = await db.sql('account/get_studentNumbers', { studentNumber: studentNumber })
      const get_email = await db.sql('account/get_emails', { email: email })

      if (get_studentNumber.data.length > 0) {
        throw new Error('Student number already exists')
      }
      if (get_email.data.length > 0) {
        throw new Error('Email already exists')
      }

      // Hash Password
      const password = req.body.password
      const hash = await hashPassword(password)

      // Create new account
      await db.sql('account/createAccount', {
        firstName: validator.escape(req.body.firstName),
        lastName: validator.escape(req.body.lastName),
        studentNumber: validator.escape(studentNumber),
        email: validator.normalizeEmail(email),
        password: hash,
        accountType: validator.escape(req.body.accountType),
        table: 'accounts_pending',
      });

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

// Account Login
router.route('/login')
  .get((req, res) => {
    res.render('account/login')
  })
  .post(async (req, res) => {
    try {
      const dbPass = await db.sql("global/get_user_info", {
        typeValue: req.body.email,
        type: 'email',
        table: 'accounts'
      })

      if (dbPass.data.length === 0) {
        throw new Error("Wrong credentials")
      }

      const match = await comparePasswords(req.body.password, dbPass.data[0].password)

      if (!match) {
        throw new Error("Wrong credentials")
      }

      // Successful login
      req.session.email = req.body.email // Set session variable
      req.session.id = req.body.id // Set session variable

      res.redirect('../project')
    } catch (error) {
      console.error(error)
      res.status(400).render('account/login', {
        email: req.body.email,
        error: error.message // Pass the error message to the view
      })
    }
  })

// Admin Panel
router.get('/admin', async (req, res) => {
  try {
    let email = req.session.email
    const adminCheck = await db.sql('global/get_user_info', {
      typeValue: email,
      type: "email",
      table: "accounts"
    })

    if (!adminCheck.data[0].admin) {
      throw new Error("You are not an admin")
    }

    const pending = await db.sql('global/get_all', {
      table: 'accounts_pending'
    })
    res.render("account/adminPanel", {
      data: pending.data
    })
  } catch (error) {
    // Redirect to dashboard page
    console.log(error)
    res.redirect('../home/dashboard')
  }
})

// Approve Account
router.get("/admin/approve/:id", async (req, res) => {
  try {
    let userId = req.params.id

    const getUser = await db.sql("global/get_user_info", {
      table: "accounts_pending",
      type: 'id',
      typeValue: userId,
    })

    const createAccount = await db.sql("account/createAccount", {
      table: "accounts",
      firstName: getUser.data[0].firstName,
      lastName: getUser.data[0].lastName,
      email: getUser.data[0].email,
      studentNumber: getUser.data[0].studentNumber,
      password: getUser.data[0].password,
      accountType: getUser.data[0].accountType,
    })

    const deleteOld = await db.sql("account/deleteAccount", {
      table: "accounts_pending",
      id: userId,
    })

    res.redirect("../")
  } catch (error) {
    console.log(error)
  }
})

// Decline Account
router.get("/admin/decline/:id", async (req, res) => {
  try {
    let userId = req.params.id

    const deleteOld = await db.sql("account/deleteAccount", {
      table: "accounts_pending",
      id: userId,
    })

    res.redirect("../")
  } catch (error) {

  }
})

// Helper Functions

// Hashes the provided password
async function hashPassword(password) {
  const salt = await bcrypt.genSalt(saltRounds)
  const hash = await bcrypt.hash(password, salt)
  return hash
}

// Compares the provided password with the hashed password
async function comparePasswords(password, hashedPassword) {
  const match = await bcrypt.compare(password, hashedPassword)
  return match
}

module.exports = router
