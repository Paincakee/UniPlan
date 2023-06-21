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
    console.log(projectList);
    res.render('project/project-list', {
      resultAccount,
      resultProject, 
      projectList,
      admin_: req.session.admin
    });
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

      res.render('project/create', { 
        resultCourse,
        admin_: req.session.admin
      });
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
    const resultProject = await db.sql('global/get_user_info', {
      table: 'projects',
      type: 'id',
      typeValue: req.body.projectId
    })
    const resultAccount = await db.sql('global/get_user_info', {
      table: 'accounts',
      type: 'email',
      typeValue: req.session.email
    })
    if(resultProject.data[0].userId == resultAccount.data[0].id){
      res.render('project/myprojects');
    }else{
      res.redirect('/project/my');
    }
  })
app.route("/applies")
  .get(checkLoggedIn, async (req, res) => {
    try {
      const applies = await db.sql('global/get_user_info', {
        table: 'projects_applies',
        type: 'makerId',
        typeValue: JSON.stringify(req.session.userId)
      })

      const accounts = await db.sql('global/get_all', {
        table: "accounts",
      })

      const projects = await db.sql('global/get_all', {
        table: "projects",
      })
   
      res.render("project/applies", {
        admin_: req.session.admin,
        applies: applies,
        accounts: accounts,
        projects: projects
      })
      
    } catch (error) {
      
    }
})
//Accept project apply
app.get('/applies/approve/:id',checkLoggedIn, checkMaker, async (req, res) => {
  const applyId = req.params.id;

  const getApply = await db.sql("global/get_user_info", {
    table: 'projects_applies',
    type: 'id',
    typeValue: applyId
  });

  const getContributors = await db.sql('global/get_user_info', {
    table: 'projects',
    type: 'id',
    typeValue: JSON.stringify(getApply.data[0].projectId)
  });

  const contributorsData = getContributors.data[0];
  let contributors = [];

  if (contributorsData && contributorsData.contributors) {
    contributors = JSON.parse(contributorsData.contributors);
    if (!Array.isArray(contributors)) {
      contributors = [];
    }
  }

  contributors.push(getApply.data[0].userId.toString());

  await db.sql('project/update_contributors', {
    contributors: JSON.stringify(contributors),
    projectId: JSON.stringify(getApply.data[0].projectId)
  });

  await db.sql('global/delete_row', {
    table: "projects_applies",
    id: applyId
  })
  
  res.redirect("/project/applies")
});

//Decline project apply
app.get('/applies/decline/:id',checkLoggedIn, checkMaker, async (req, res) => {

  const applyId = req.params.id;

  await db.sql('global/delete_row', {
    table: "projects_applies",
    id: applyId
  })

  res.redirect("/project/applies")
  
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
      lastname: req.session.lastName,
      admin_: req.session.admin
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

// This function checks if the user is the maker of the product
async function checkMaker(req, res, next) {
  const applyId = req.params.id;

  // Retrieve the apply information from the database
  const getApply = await db.sql("global/get_user_info", {
    table: 'projects_applies',
    type: 'id',
    typeValue: applyId
  });

  if (!getApply || getApply.data.length === 0) {
    // If the apply information is not found, redirect the user
    res.redirect('/project/applies');
  } else {
    const makerId = getApply.data[0].makerId;

    if (makerId === req.session.userId) {
      // If the user is the maker, proceed to the next middleware/route handler
      next();
    } else {
      // If the user is not the maker, redirect them
      res.redirect('/project/applies');
    }
  }
}


module.exports = app;