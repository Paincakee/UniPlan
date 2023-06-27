const express = require('express')
const app = express.Router()
const bcrypt = require('bcrypt')
const fs = require('fs');

const saltRounds = 10 // Time for hashing algorithm

const validator = require('validator');

app.route('/')
  .get(checkLoggedIn, (req, res) => {
    res.render('account/manage',{
      admin_: req.session.admin
    })
  })
  .post(checkLoggedIn, async (req, res) => {
    if (req.body.newpass == req.body.confirmpass) {
      req.session.newpass = await hashPassword(req.body.newpass);
      req.session.token = Math.floor(Math.random() * 100000 + 10000);
      let info = await global.sender.sendMail({
        from: '"pixeltrading" pixeltrading@outlook.com', // sender address
        to: email, // receiver
        subject: "UniPlan password reset", // Subject line
        // text: "Click the link to verify.", // plain text body
        html: `<h5>Your verification code is: ${req.session.token}</h5>` // html body
      })
      res.render('account/verification', { firstName: req.session.firstName, password: true });
    } else {
      res.render('account/manage', { error: 'New password and confirmed password are not the same! Please try again', wrongpass: true })
    }
  })
app.post('/setpass', async (req, res) => {
  if (parseInt(req.body.tokenInput) == req.session.token) {
    await db.sql('global/set_user_info', {
      table: 'accounts',
      collumn: 'password',
      input: req.session.newpass,
      type: 'email',
      typeValue: req.session.email
    })
    console.log("Message sent: %s", info.messageId);
    res.render('acount/login')
  } else {
    res.render('account/verification', { error: 'wrong token', password: true })
  }
})

// Account Registration
app.route('/new')
  .get(async (req, res) => {
    res.render('account/register')
  })
  .post(async (req, res) => {
    try {
      let email = req.body.email
      req.session.email = email
      let studentNumber = req.body.studentNumber

      // Check if email or student number already exists
      const get_studentNumber = await db.sql('account/get_studentNumbers', { studentNumber: studentNumber })
      const get_email = await db.sql('account/get_emails', { email: email })

      if (get_studentNumber.data.length > 0) {
        throw new Error('Student number already exists')
      }
      if (get_email.data.length > 0) {
        throw new Error('Email already exists')
      }

      // Hash Password
      const password = req.body.password
      const hash = await hashPassword(password)

      req.session.token = Math.floor(Math.random() * 100000 + 10000)

      let info = await global.sender.sendMail({
        from: '"pixeltrading" pixeltrading@outlook.com', // sender address
        to: email, // receiver
        subject: "UniPlan account verification", // Subject line
        // text: "Click the link to verify.", // plain text body
        html: `<h5>Your verification code is: ${req.session.token}</h5>` // html body
      })
  
      console.log("Message sent: %s", info.messageId);
      //Declare session variables
      req.session.firstName = validator.escape(req.body.firstName);
      req.session.lastName = validator.escape(req.body.lastName);
      req.session.studentNumber = validator.escape(studentNumber);
      req.session.email = validator.normalizeEmail(email);
      req.session.hash = hash;
      req.session.accountType = validator.escape(req.body.accountType);

      res.render('account/verification', { firstName: req.session.firstName });
    } catch (error) {
      res.render('account/register', {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        studentNumber: req.body.studentNumber,
        email: req.body.email,
        error: error.message // Pass the error message to the view
      })
    }
  })


// Account Verification
app.route('/verify')
  .get(async (req, res) =>{
    res.render('account/verification', { firstName: req.session.firstname, error: 'Invalid input! Try again.' })
  })
  .post(async (req, res) => {
    console.log(req.body.tokenInput);
    console.log(req.session.token);
    if (parseInt(req.body.tokenInput) == req.session.token) {
      await db.sql('account/createAccount', {
        firstName: validator.escape(req.session.firstName),
        lastName: validator.escape(req.session.lastName),
        studentNumber: validator.escape(req.session.studentNumber),
        email: validator.normalizeEmail(req.session.email),
        password: req.session.hash,
        accountType: validator.escape(req.session.accountType),
        table: 'accounts_pending',
      })
      res.redirect('/account/login')
    } else {
      res.render('account/verification', { firstName: req.session.firstname, error: 'Invalid input! Try again.' })
    }
  })

// Account Login
app.route('/login')
  .get(checkNotLoggedInRedirect, (req, res) => {
    res.render('account/login')
  })
  .post(checkNotLoggedInRedirect, async (req, res) => {
    try {
      const dbPass = await db.sql("global/get_user_info", {
        typeValue: req.body.email,
        type: 'email',
        table: 'accounts'
      })

      if (dbPass.data.length === 0) {
        throw new Error("Wrong credentials")
      }

      const match = await comparePasswords(req.body.password, dbPass.data[0].password)

      if (!match) {
        throw new Error("Wrong credentials")
      }

      // Successful login
      req.session.loggedIn = true // Set session variable
      req.session.email = dbPass.data[0].email // Set session variable
      req.session.admin = dbPass.data[0].admin // Set session variable
      req.session.firstName = dbPass.data[0].firstName // Set session variable
      req.session.lastName = dbPass.data[0].lastName // Set session variable
      req.session.userId = dbPass.data[0].id // Set session variable
      req.session.id = req.body.id // Set session variable
      
      res.redirect('./')
    } catch (error) {
      console.error(error)
      res.status(400).render('account/login', {
        email: req.body.email,
        error: error.message // Pass the error message to the view
      })
    }
  })

// Admin Panel
app.get('/admin', checkAdminAccess, async (req, res) => {
  try {


    const pending_accounts = await db.sql('global/get_all', {
      table: 'accounts_pending'
    })

    const pending_projects = await db.sql('global/get_all', {
      table: 'projects_pending'
    })
    res.render("account/adminPanel", {
      data_accounts: pending_accounts.data,
      data_projects: pending_projects.data,
      admin_: req.session.admin
    })
  } catch (error) {
    // Redirect to dashboard page
    console.log(error)
    res.redirect('/')
  }
})
//View Project
app.get('/admin/view/:id', checkAdminAccess, async (req, res) => {
  try {
    const id = req.params.id;
    let courseListFinal = [];

    const showChat = await db.sql("global/get_user_info", {
      table: "chat_history",
      type: "projectId",
      typeValue: `${id}`
    });

    const resultProject = await db.sql("global/get_user_info", {
      table: "projects_pending",
      type: "id",
      typeValue: `${id}`
    });

    console.log(resultProject);
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
})

// Approve Account
app.get("/admin/approve/account/all", checkAdminAccess, async (req, res) => {
  try {


    const approveAll = await db.sql("account/approve_all")
    const deleteAll = await db.sql("global/delete_all", { table: "accounts_pending" })

    res.redirect("/account/admin")
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
})

app.get("/admin/approve/account/:id", checkAdminAccess, async (req, res) => {
  try {


    let userId = req.params.id

    const getUser = await db.sql("global/get_user_info", {
      table: "accounts_pending",
      type: 'id',
      typeValue: userId,
    })
    // console.log(getUser);
    const createAccount = await db.sql("account/createAccount", {
      table: "accounts",
      firstName: getUser.data[0].firstName,
      lastName: getUser.data[0].lastName,
      email: getUser.data[0].email,
      studentNumber: getUser.data[0].studentNumber,
      password: getUser.data[0].password,
      accountType: getUser.data[0].accountType,
    })

    const deleteOld = await db.sql("global/delete_row", {
      table: "accounts_pending",
      id: userId,
    })

    res.redirect("/account/admin")
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
})

//Notification page
app.route('/notifications')
  .get(checkLoggedIn, async (req, res) => {
    const resultNoti = await db.sql('global/get_all', {
      table: 'notifications',
    })
    
    const resultAccount = await db.sql('global/get_user_info', {
      table: 'accounts',
      type: 'email',
      typeValue: req.session.email
    })
    let notiList = []
    resultNoti.data.forEach(row => {
      if(row.userId == resultAccount.data[0].id){
        notiList.push(row);
      }
    })
    res.render('account/notifications', {
      notiList,
      admin_: req.session.admin
    })
  })
  app.route('/notifications/delete/:id')
  .get(checkLoggedIn, async (req, res) => {
    const id = req.params.id
    await db.sql('global/delete_row', {
      table: 'notifications',
      id: id
    })
    console.log("deleted");
    res.redirect("/account/notifications")
  })
// Decline Account
app.get("/admin/decline/account/all", checkAdminAccess, async (req, res) => {
  try {

    const deleteAll = await db.sql("global/delete_all", { table: "accounts_pending" })

    res.redirect("/account/admin")
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
})

app.get("/admin/decline/account/:id", checkAdminAccess, async (req, res) => {
  try {


    let userId = req.params.id

    const deleteOld = await db.sql("global/delete_row", {
      table: "accounts_pending",
      id: userId,
    })

    res.redirect("/account/admin")
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
})

// Approve project
app.get("/admin/approve/project/all", checkAdminAccess, async (req, res) => {
  try {


    const approveAll = await db.sql("project/approve_all");
    const deleteAll = await db.sql("global/delete_all", { table: "projects_pending" });

    res.redirect("/account/admin");
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

app.get("/admin/approve/project/:id", checkAdminAccess, async (req, res) => {
  try {
    const projectId = req.params.id;

    const project = await db.sql('global/get_user_info', {
      table: "projects_pending",
      type: "id",
      typeValue: projectId
    })
    
    
    await db.sql('notifications/create_notification', {
      userId: project.data[0].userId,
      message: `The admin '${req.session.email}' has accepted your project '${project.data[0].title}'. Click here to view the project details.`,
      class: "succes",
      redirect: `/project/${project.data[0].id}`
    })
    
    await db.sql("project/move_project", { id: projectId });
    await db.sql("global/delete_row", { table: "projects_pending", id: projectId });

    res.redirect("/account/admin");
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

// Decline project
app.get("/admin/decline/project/all", checkAdminAccess, async (req, res) => {
  try {


    const deleteAll = await db.sql("global/delete_all", { table: "projects_pending" });

    res.redirect("/account/admin");
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

app.get("/admin/decline/project/:id", checkAdminAccess, async (req, res) => {
  try {
    let projectId = req.params.id;

    const project = await db.sql('global/get_user_info', {
      table: "projects_pending",
      type: "id",
      typeValue: projectId
    })

    await db.sql('notifications/create_notification', {
      userId: project.data[0].userId,
      message: `The admin '${req.session.email}' has declined your project '${project.data[0].title}'. Click here to view the project details.`,
      class: "warning",
      redirect: `/project/${project.data[0].id}`
    })


    const deleteOld = await db.sql("global/delete_row", { table: "projects_pending", id: projectId });

    res.redirect("/account/admin");
  } catch (error) {
    console.log(error);
    res.redirect("/account");
  }
});

app.get('/logout', checkLoggedIn, (req, res) => {
  try {
    req.session.destroy();
    
    console.log("logged out")
    res.redirect("/account/login")
  } catch (error) {
    
  }

  
})

// Helper Functions

// Hashes the provided password
async function hashPassword(password) {
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  } catch (error) {
    // Handle the error appropriately (e.g., logging, error response)
    console.error('Error hashing password:', error);
    throw new Error('Failed to hash password');
  }
}


// Compares the provided password with the hashed password
async function comparePasswords(password, hashedPassword) {
  const match = await bcrypt.compare(password, hashedPassword)
  return match
}

// Middleware to check if the current user is an admin
function checkAdminAccess(req, res, next) {
  // Query the database or perform any necessary checks to determine if the user is an admin

  if (!req.session.admin) {
    // Redirect the user to a specific route if they are not an admin
    return res.redirect('/account'); // Replace '/unauthorized' with the appropriate route
  }
  else {
    // If the user is an admin, continue to the next middleware or route handler
    next();
  }


}

//This function checks if the user is logged in, if thats not the case go to login page
function checkLoggedIn(req, res, next) {
  // Check if the email session is set and not null
  if (!req.session.email) {
    // Redirect the user to a specific route if they are not logged in
    res.redirect('/account/login');
  }
  else {
    // If the user is logged in,Move to the next middleware/route handler
    next();
  }
}

//This function checks if the user is logged out, if they are logged in go to account page
function checkNotLoggedInRedirect(req, res, next) {
  // Check if the email session is set
  if (req.session.loggedIn) {
    // Redirect the user to a specific route if they are logged in
    res.redirect('/account');
  }
  else {
    // If the user is not logged in, Move to the next middleware/route handler
    next();

  }
}


module.exports = app
