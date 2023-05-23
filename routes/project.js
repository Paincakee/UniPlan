const express = require('express');
const multer = require('multer');
const fs = require('fs');
const { log } = require('console');
const router = express.Router();

const upload = multer({ dest: __dirname + '/../resources/upload/' });

router.get('/new', (req, res) => {
  res.render('project/create');
});
router.post('/new', upload.any(['files', 'fotos']), async (req, res) => {
  try {
    let email = req.session.email
    if(email == ""){
      throw new Error("Email not set")
    }
    // Access the uploaded files via req.files
    // Iterate over the files and save them to a folder
    if (req.session.email == null) {
      res.render('account/login')
    }
    else {
      req.files.forEach((file) => {
        // Save the file to a specific folder using the file.originalname property
        const fieldname = file.fieldname;
        const folderPath = __dirname + `/../resources/upload/${req.session.email}/${req.body.title}/${fieldname}/`;
        fs.mkdirSync(folderPath, { recursive: true })
        fs.renameSync(file.path, folderPath + file.originalname);
      });


      const result = await db.sql("project/createProject", {
        table: "projects",
        userId: email,
        title: req.body.title,
        description: req.body.description,
        contact_info: req.body.contact
      })

      res.redirect("./")
    }
  } catch (error) {
    console.log(error);
  }
});

router.get('/', function (req, res) {
  res.render('project/home');
});



module.exports = router;