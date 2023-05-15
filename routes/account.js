const express = require('express')
const router = express.Router()

router.get("/new", (req, res) => {
    res.render("account/register")
})

router.get("/login", (req, res) => {
    res.render("account/login")
})

router.post("/login", async (req, res) => {
    try {
        // Check if email or student number already exists
        const get_studentNumber = await db.sql("auth/get_student", {studentNumber: req.body.studentNumber})
        const get_email = await db.sql("auth/get_mail", {email: req.body.email})
        if (get_studentNumber.data.length > 0) {
          throw new Error("Student number already exists")
        }
        if (get_email.data.length > 0) {
          throw new Error("Email already exists")
        }
      
        // Create new account
        const result = await db.sql("auth/register", {
          firstName: req.body.firstName, 
          lastName: req.body.lastName,
          studentNumber: req.body.studentNumber,
          email: req.body.email,
          password: req.body.password,
          accountType: req.body.accountType
        });
        console.log(result);
      
        // Redirect to login page
        res.redirect("./login")
      } catch (err) {
        console.error(err)
        res.render("account/register", {
          firstName: req.body.firstName, 
          lastName: req.body.lastName,
          studentNumber: req.body.studentNumber,
          email: req.body.email,
          error: err.message // Pass the error message to the view
        })
      }      
})



module.exports = router