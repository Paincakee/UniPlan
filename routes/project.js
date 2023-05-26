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
    if(email == null){
      res.render('account/login')
      throw new Error("Email not set")
    }
    else {
      const resultAccount = await db.sql("account/get_user_info", {
        table: "accounts",
        type: "email",
        typeValue: email
      });

      await db.sql("project/createProject", {
        table: "projects",
        userId: `${resultAccount.data[0].id}`,
        title: req.body.title,
        description: req.body.description,
        contact_info: req.body.contact
      });

      const resultProject = await db.sql("account/get_user_info", {
        table: "projects",
        type: "userId",
        typeValue: `${resultAccount.data[0].id}`
      });

      const lastIndex = resultProject.data.slice(-1);
      console.log(lastIndex[0].id);

      req.files.forEach((file) => {
        // Save the file to a specific folder using the file.originalname property
        const fieldname = file.fieldname;
        const folderPath = __dirname + `/../resources/upload/${req.session.email}/${lastIndex[0].id}/${fieldname}/`;
        fs.mkdirSync(folderPath, { recursive: true })
        fs.renameSync(file.path, folderPath + file.originalname);
      });

      res.redirect("./")
    }
  } catch (error) {
    console.log(error);
  }
});

router.get('/', async (req, res) => {
  const email = req.session.email
  
  if(email == null){
    res.render('account/login')
    throw new Error("Email not set")
  }
  else {
    const resultAccount = await db.sql("account/get_user_info", {
      table: "accounts",
      type: "email",
      typeValue: email
    });

    const resultProject = await db.sql("account/get_user_info", {
      table: "projects",
      type: "userId",
      typeValue: `${resultAccount.data[0].id}`
    });

    console.log(resultProject);
    res.render('project/home', {resultProject});
  }
});



module.exports = router;