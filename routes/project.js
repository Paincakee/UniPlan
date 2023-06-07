const express = require('express');
const multer = require('multer');
const { body, validationResult } = require('express-validator');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const upload = multer({ dest: __dirname + '/../resources/upload/' });

// Define validation rules for the project creation route
const projectValidationRules = [
  body('title').trim().isString(),
  body('description').trim().isString(),
  body('contact').trim().isString(),
  // Add more validation rules for other fields
];

// Define a middleware function to handle validation errors
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  // Handle validation errors
  const extractedErrors = errors.array().map((err) => err.msg);
  res.status(400).json({ errors: extractedErrors });
};

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
    res.redirect('../account/login');
  }
});

//Router for project creation
app.route('/new')
  .get(async (req, res) => {
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
      res.redirect('../account/login');
    }
  })
  .post(
    projectValidationRules,
    validate,
    upload.any(['files', 'fotos']),
    async (req, res) => {
      console.log(body);
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

        await db.sql("project/create_project", {
          table: "projects_pending",
          userId: `${resultAccount.data[0].id}`,
          title: req.body.title,
          description: req.body.description,
          contact_info: req.body.contact,
          courses: JSON.stringify(req.body.courses),
          email
        });

        const resultProject = await db.sql("global/get_user_info", {
          table: "projects_pending",
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
          // console.log(fieldname)
          const folderPath = `${__dirname}/../resources/upload/${req.session.email}/${lastIndex[0].id}/${fieldname}/`;
          fs.mkdirSync(folderPath, { recursive: true })
          fs.renameSync(file.path, folderPath + file.originalname);
        });

        res.redirect("./")
      } catch (error) {
        console.log(error);
        res.redirect('../account/login');
      }
    }
  );


//Router for specific project
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

    let courseList = JSON.parse(resultProject.data[0].courses);
    if (courseList.constructor !== Array){
      courseList = [courseList];
      console.log(courseList);
    }
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
      makerMail: resultProject.data[0].email,
      firstname: req.session.firstName,
      lastname: req.session.lastName
    });
  } catch (error) {
    console.log(error);
    res.redirect('/account/login');
  }
});
//Router for fetch chat
app.post('/:id/new', async (req, res) => {
  try {
    if (req.body.chat === "" || req.body.chat === null || req.body.user === "%userId%") {
      throw new Error("Chat is empty")
    }

    const saveChat = await db.sql("chat/saveChat", {
      userId: req.body.user,
      chat: req.body.chat,
      time: req.body.time,
      roomId: req.body.roomId,
      fullName: req.body.fullName
    })
    res.json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to save the chat' });
  }
});


module.exports = app;