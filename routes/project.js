const express = require('express')
const router = express.Router()

router.get('/', function(req, res) {
    res.render('project/home')
});

router.get('/new', (req, res) => {
    res.render('project/create')
})

router.post('/new', (req, res) => {
    res.render('project/home')
})





















module.exports = router
