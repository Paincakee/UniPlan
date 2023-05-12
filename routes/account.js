const express = require('express')
const router = express.Router()

router.get("/new", (req, res) => {
    res.render("account/register")
})

router.get("/login", (req, res) => {
    res.render("account/login")
})

router.post("/login", (req, res) => {
    const isValid = true;
    if(isValid){
        
        const createAccount = async () => {
            const result = await db.sql("auth/register", {
                firstName: req.body.firstName, 
                lastName: req.body.lastName,
                studentNumber: req.body.studentNumber,
                email: req.body.email,
                password: req.body.password,
                accountType: req.body.accountType
            })
            console.log(result)
            res.redirect("./login")
        }
        createAccount()
    
    }
    else{
        res.render("account/register", {
            firstName: req.body.firstName, 
            lastName: req.body.lastName,
            studentNumber: req.body.studentNumber,
            email: req.body.email,
        })
    }
})


module.exports = router