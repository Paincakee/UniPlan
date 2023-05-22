const express = require('express');
const multer = require('multer');
const fs = require('fs');
const router = express.Router();

const upload = multer({ dest: __dirname + '/../resources/upload/' });

router.post('/new', upload.any(['files', 'fotos']), async (req, res) => {
  // Access the uploaded files via req.files
  // Iterate over the files and save them to a folder
  if(req.session.email == 'undefined'){
    res.render('account/login')
  }
  else{
  req.files.forEach((file) => {
    // Save the file to a specific folder using the file.originalname property
    const fieldname = file.fieldname;
    const folderPath = __dirname + `/../resources/upload/${req.session.email}/${req.body.title}/${fieldname}/`;
    fs.mkdirSync(folderPath, {recursive: true})
    fs.renameSync(file.path, folderPath + file.originalname);
  });
  }

  const result = await db.sql("project/createProject", {
    table: "projects",
    user_id: req.session.email,
    title: req.body.title,
    description: req.body.description,
    contact_info: req.body.contact_info
  })

  res.render('project/home');
});

router.get('/', function(req, res) {
  res.render('project/home');
});

router.get('/new', (req, res) => {
  res.render('project/create');
});

module.exports = router;