const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })) // Add this line

const upload = multer({ dest: __dirname + '/../resources/upload/' });

app.get('/', async (req, res) => {
  try {
    const email = req.session.email

    if (email == null) {
      throw new Error("Not logged in")
    }

    const resultAccount = await db.sql("global/get_user_info", {
      table: "accounts",
      type: "email",
      typeValue: email
    });

    const resultProject = await db.sql("global/get_all", {
      table: "projects",
    });

    res.render('project/home', { resultProject });

  } catch (error) {
    console.log(error);
    res.redirect("../account/login")
  }

});

app.get('/new', async (req, res) => {
  try {
    let email = req.session.email
    if (email == null) {
      throw new Error("Not logged in")
    }

    const resultCourse = await db.sql("global/get_all", {
      table: "courses",
    });

    res.render('project/create', { resultCourse });
  } catch (error) {
    console.log(error);
    res.redirect("../account/login")
  }
});
app.post('/new', upload.any(['files', 'fotos']), async (req, res) => {
  try {
    let email = req.session.email
    if (email == null) {
      throw new Error("Not logged in")
    }

    const resultAccount = await db.sql("global/get_user_info", {
      table: "accounts",
      type: "email",
      typeValue: email
    });

    console.log(JSON.stringify(req.body.courses));

    await db.sql("project/createProject", {
      table: "projects",
      userId: `${resultAccount.data[0].id}`,
      title: req.body.title,
      description: req.body.description,
      contact_info: req.body.contact,
      courses: JSON.stringify(req.body.courses),
      email
    });

    const resultProject = await db.sql("global/get_user_info", {
      table: "projects",
      type: "userId",
      typeValue: `${resultAccount.data[0].id}`
    });

    const lastIndex = resultProject.data.slice(-1);
    console.log(lastIndex[0].id);
    fs.mkdirSync(`${__dirname}/../resources/upload/${req.session.email}/${lastIndex[0].id}/files`, { recursive: true })
    fs.mkdirSync(`${__dirname}/../resources/upload/${req.session.email}/${lastIndex[0].id}/fotos`, { recursive: true })

    req.files.forEach((file) => {
      // Save the file to a specific folder using the file.originalname property
      const fieldname = file.fieldname;
      const folderPath = `${__dirname}/../resources/upload/${req.session.email}/${lastIndex[0].id}/${fieldname}/`;
      fs.mkdirSync(folderPath, { recursive: true })
      fs.renameSync(file.path, folderPath + file.originalname);
    });

    res.redirect("./")

  } catch (error) {
    console.log(error);
    res.redirect("../account/login")
  }
});

app.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const email = req.session.email;
    let courseListFinal = [];

    if (email == null) {
      throw new Error("Not logged in");
    }

    const showChat = await db.sql("global/get_user_info", {
      table: "chat_history",
      type: "projectId",
      typeValue: `${id}`
    });

    const resultProject = await db.sql("global/get_user_info", {
      table: "projects",
      type: "id",
      typeValue: `${id}`
    });

    const courseList = JSON.parse(resultProject.data[0].courses);

    await Promise.all(courseList.map(async (course) => {
      const resultCourse = await db.sql("global/get_user_info", {
        table: "courses",
        type: "id",
        typeValue: `${course}`,
      });
      courseListFinal.push(resultCourse.data[0].courseName);
    }));

    const files = fs.readdirSync(__dirname + `/../resources/upload/${resultProject.data[0].email}/${id}/files`);

    res.render('project/project', {
      resultProject,
      files,
      email,
      courseListFinal,
      history: showChat.data,
      id,
      makermail: resultProject.data[0].email,
    });
  } catch (error) {
    console.log(error);
    res.redirect("../account/login");
  }
});


app.post('/:id/new', async (req, res) => {
  try {
    if (req.body.chat === "" || req.body.chat === null || req.body.user === "%userId%") {
      throw new Error("Chat is empty")
    }

    const saveChat = await db.sql("chat/saveChat", {
      userId: req.body.user,
      chat: req.body.chat,
      time: req.body.time,
      roomId: req.body.roomId
    })

    res.json({ success: true })

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to save the chat' })
  }
})



module.exports = app;