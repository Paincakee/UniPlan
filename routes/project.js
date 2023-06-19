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

app.get('/', checkLoggedIn, async (req, res) => {
  try {

    const resultApply = await db.sql("global/get_all", {
      table: "projects_applies"
    })

    const resultAccount = await db.sql('global/get_user_info', {
      table: 'accounts',
      type: 'email',
      typeValue: req.session.email
    })

    let projectList = []
    resultApply.data.forEach(row => {
      if (resultAccount.data[0].id == row.userId){
        projectList.push(row.projectId);
      }
    })

    const resultProject = await db.sql("global/get_all", {
      table: "projects",
    });

    res.render('project/home', { resultProject , projectList});
  } catch (error) {
    console.log(error);
    res.redirect('/account/login');
  }
});

//Router for project creation
app.route('/new')
  .get(checkLoggedIn, async (req, res) => {
    try {
      const resultCourse = await db.sql("global/get_all", {
        table: "courses",
      });

      res.render('project/create', { resultCourse });
    } catch (error) {
      console.log(error);
      res.redirect('/account/login');
    }
  })
  .post(checkLoggedIn, projectValidationRules, validate, upload.any(['files', 'fotos']), async (req, res) => {
    try {
      const resultAccount = await db.sql("global/get_user_info", {
        table: "accounts",
        type: "email",
        typeValue: req.session.email
      });

      await db.sql("project/create_project", {
        table: "projects_pending",
        userId: `${resultAccount.data[0].id}`,
        title: req.body.title,
        description: req.body.description,
        contact_info: req.body.contact,
        courses: JSON.stringify(req.body.courses),
        email: req.session.email
      });

      const resultProject = await db.sql("global/get_user_info", {
        table: "projects_pending",
        type: "userId",
        typeValue: `${resultAccount.data[0].id}`
      });

      const lastIndex = resultProject.data.slice(-1);
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

//router to get post for project apply
app.post('/apply', checkLoggedIn, projectValidationRules, validate, async (req, res) => {
  const resultAccount = await db.sql('global/get_user_info', {
    table: 'accounts',
    type: 'email',
    typeValue: req.session.email
  })

  const resultProject = await db.sql('global/get_user_info', {
    table: 'projects',
    type: 'id',
    typeValue: req.body.projectId
  })

  await db.sql('project/apply_project', {
    userId: JSON.stringify(resultAccount.data[0].id),
    projectId: req.body.projectId,
    makerId: resultProject.data[0].userId
  })
  console.log(`${req.session.email}: Applied to a project with the id of: ${req.body.projectId}`);
  res.redirect('/project')
})


//router for managing projects
app.route('/my')
  .get(checkLoggedIn, async (req, res) => {
    const resultAccount = await db.sql('global/get_user_info', {
      table: 'accounts',
      type: 'email',
      typeValue: req.session.email
    })
    // const resultApplies = await db.sql('global/get_user_info', {
    //   table: 'project_applies',
    //   type: 'makerId',
    //   typeValue: resultAccount.data[0].id
    // })
    const resultProject = await db.sql('global/get_user_info', {
      table: 'projects',
      type: 'userId',
      typeValue: JSON.stringify(resultAccount.data[0].id)
    })
    res.render('project/home', {resultProject, manage: true});
  })
  .post(checkLoggedIn, async (req, res) => {
    res.render('project/myprojects')
  })

//Router for specific project
app.get('/:id', checkLoggedIn, async (req, res) => {
  try {
    const id = req.params.id;
    let courseListFinal = [];

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
    if (courseList.constructor !== Array) {
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
      email: req.session.email,
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
app.post('/:id/new', checkLoggedIn, async (req, res) => {
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




// Helper Functions

//This function checks if the user is logged in, if thats not the case go to login page
function checkLoggedIn(req, res, next) {
  // Check if the email session is set and not null
  if (!req.session.email || !req.session.loggedIn) {
    // Redirect the user to a specific route if they are not logged in
    res.redirect('/account/login');
  }
  else {
    // If the user is logged in,Move to the next middleware/route handler
    next();
  }
}

module.exports = app;