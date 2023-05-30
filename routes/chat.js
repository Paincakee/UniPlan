const express = require('express')
const router = express.Router()


router.get('/', (req, res) => {
    try {
        // console.log(req.session.email)
        if(!req.session.email){
            throw new Error("Not logged in")
        }
        res.render("chat/chatpage", {
            email: req.session.email,
            db: db
        })
    } catch (error) {
        res.redirect("./account/login")
    }
    
})


module.exports = router
