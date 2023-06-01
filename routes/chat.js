const express = require('express')
const bodyParser = require('body-parser')
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })) // Add this line

app.get('/', async (req, res) => {
    try {
        // console.log(req.session.email)
        if (!req.session.email) {
            throw new Error("Not logged in")
        }
        const showChat = await db.sql("account/get_all",{
            table: "chat_history"
        })

        res.render("chat/chatpage", {
            email: req.session.email,
            history: showChat.data
        })
    } catch (error) {
        res.redirect("./account/login")
    }

})
// app.post('/new', async (req, res) => {
//     try {
//         if(req.body.chat == "" || req.body.chat == null || req.body.user == "%userId%"  ){
//             throw new Error("Chat is empty")
//         }

//         const saveChat = await db.sql("chat/saveChat", {
//             userId: req.body.user,
//             chat: req.body.chat,
//             time: req.body.time
//         })

//         res.json({ success: true })

//     } catch (error) {
        
//         res.status(500).json({ error: 'Failed to save the chat' })
//     }
// })


module.exports = app
