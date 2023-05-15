const express = require('express')
const router = express.Router()

router.get("/new", (req, res) => {
    res.render("account/register")
})

router.post("/new", async (req, res) => {
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
        console.log(get_studentNumber);

        //Hash Password
        
        const crypto = require('crypto');

        const password = req.body.password; // the password to be hashed

        let mykey = crypto.createCipher('aes-128-cbc', 'J4v7c#$37Zs6p6e');
        let hashedPassword = mykey.update(password, 'utf8', 'hex')
        
        hashedPassword += mykey.final('hex');
        
        // Create new account
        const result = await db.sql("auth/register", {
          firstName: req.body.firstName, 
          lastName: req.body.lastName,
          studentNumber: req.body.studentNumber,
          email: req.body.email,
          password: hashedPassword,
          accountType: req.body.accountType
        });
        console.log(result);
      
        // Redirect to login page
        res.redirect("./login")
    } catch (error) {
        console.error(error)
        res.render("account/register", {
          firstName: req.body.firstName, 
          lastName: req.body.lastName,
          studentNumber: req.body.studentNumber,
          email: req.body.email,
          error: error.message // Pass the error message to the view
        })
    }   
})

router.get("/login", (req, res) => {
    res.render("account/login")
})

router.post("/login", async (req, res) => {
  try {
     //Hash Password
     const crypto = require('crypto');

     const password = req.body.password; // the password to be hashed

     let mykey = crypto.createCipher('aes-128-cbc', 'J4v7c#$37Zs6p6e');
     let hashedPassword = mykey.update(password, 'utf8', 'hex')
     
     hashedPassword += mykey.final('hex');
     

    const login = await db.sql("auth/login", {
      email: req.body.email,
      password: hashedPassword,
    })

    if (login.data.length < 1) throw new Error("Credentials aren't correct")
    
    
    // console.log(login)

    res.redirect("../home/dashboard")
  } catch (error) {
    console.error(error)
    res.render("account/login", {
      email: req.body.email,
      error: error.message // Pass the error message to the view
    })
  }

  

 
  
  
})



module.exports = router