// Imports
const child_process = require("child_process");
const mongoose = require('mongoose');
const express = require('express');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const crypto = require('crypto');
const cm = require('./customsessions');
const Schema = mongoose.Schema
const port = 3000;
global.__basedir = __dirname;

cm.sessions.startCleanup();

// Database connection
const url = 'mongodb+srv://nishant3j:dKbkythUhL31a5EL@cluster337.jn1tr0y.mongodb.net/test';

mongoose.connect(url);
const db = mongoose.connection
db.once('open', _ => {
  console.log('Database connected:', url)
})

db.on('error', err => {
  console.error('connection error:', err)
})

// Schemas and Models

// User Schema
const Users = new Schema({
  username:String,  // Name
  // password:String,  // Password
  salt: Number, // Salt
  hash: String, // Hash
  email:String, // email
  problemlist:[Schema.Types.ObjectId]// ProblemList (A list of problem instances)
});
const User = mongoose.model('User', Users);

// Problem Schema
const Problems = new Schema({
  name: String,
  description: String,// Description
  // A list of two examples
  example1: String,
  example2: String,
  constraints: String// Sample input
});
const Problem = mongoose.model('Problem', Problems);

// Problem Instance Schema
const ProblemInstance = new Schema({
  // problem id
  // List of submissions

});

// Submission Schema
const Submissions = new Schema({
    // problem id
    language: String,
    testcase: String
    // timestamp
    // Code
});
const Submission = mongoose.model('Submission', Submissions);

// Authentication Middleware

function authenticate(req, res, next) {
  let c = req.cookies;
  if (c && c.login) {
    let result = cm.sessions.doesUserHaveSession(c.login.username, c.login.sid);
    if (result) {
      next();
      return;
    }
  }
  console.log('redirecting');
  res.redirect('/index.html');
}

/**
 * Initialize the express app and configure with various features 
 * such as JSON parsing, static file serving, etc.
 */
const app = express();
app.use(cookieParser());    
app.use('/app/*', authenticate);
app.use(express.static('public_html'))
//app.get('/', (req, res) => { res.redirect('/app/index.html'); });
app.use(express.json())
//app.use(parser.text({type: '*/*'}));


// Problem List API
app.get("/problems/download/", async function(req,res){
  problems = await Problem.find().exec();
  nameList = [];
  for(let i = 0; i< problems.length; i++){
    nameList.push(problems[i].name)
  }
  res.send(JSON.stringify({names:nameList}));
})

// Problem Load API
app.get("/problem/get/:problem", async function(req,res){
  const problem = await Problem.find({name: req.params.problem}).exec()
  if(problem.length !== 0){
    res.send(JSON.stringify(problem[0]));
  }
})

/**
 * This route is for creating a new user account.
 */
app.get('/account/create/:username/:password/:email', (req, res) => {
  let p1 = User.find({username: req.params.username}).exec();
  p1.then( (results) => { 
    if (results.length > 0) {
      res.end('Username already exists.');
    } else {
      let newSalt = Math.floor((Math.random() * 1000000));
      let toHash = req.params.password + newSalt;
      var hash = crypto.createHash('sha3-256');
      let data = hash.update(toHash, 'utf-8');
      let newHash = data.digest('hex');

      var newUser = new User({ 
        username: req.params.username,
        salt: newSalt,
        hash: newHash,
        email: req.params.email
      });
      newUser.save().then( (doc) => { 
          res.end('Created new account!');
          console.log("AnD");
        }).catch( (err) => { 
          console.log(err);

        console.log("BnD");
          res.end('Failed to create new account.');
        });
    }
  });
  p1.catch( (error) => {
    console.log("DnD");
    res.end('Failed to create new account.');
  });
});

/**
 * Process a user login request.
 */
app.get('/account/login/:username/:password/', (req, res) => {
  let u = req.params.username;
  let p = req.params.password;
  let p1 = User.find({username:u}).exec();
  p1.then( (results) => { 
    if (results.length == 1) {

      let existingSalt = results[0].salt;
      let toHash = req.params.password + existingSalt;
      var hash = crypto.createHash('sha3-256');
      let data = hash.update(toHash, 'utf-8');
      let newHash = data.digest('hex');
      
      if (newHash == results[0].hash) {
        let id = cm.sessions.addOrUpdateSession(u);
        res.cookie("login", {username: u, sid: id}, {maxAge: 600*60*24});
        res.end('SUCCESS');
      } else {
        res.end('password was incorrect');
      }
    } else {
      res.end('login failed');
    }
  });
  p1.catch( (error) => {
    res.end('login failed');
  });
});


// Set up the listen
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});



/**
 *  This route is for receiving and grading user's code submissions.
 * 
 * Read the source code, language, and chosen problemset from the request body.
 * Log a new submission in the database. 
 * Write the user's source code to /root/submissions/{submission_id}/
 * Call the grader and return a verdict.
 * 
 */
app.post("/problem/execute/", async function(req, res) { // Program execution API
    userData = req.body;
    code = userData.code;
    
    // TODO: use the code to run the code and store the status in the variable
    var submission = new Submission({
        // Extract source code, language, and chosen problemset to create a new submission
        language: userData.language,
        testcase: userData.testcase,
        code: userData.code
    });
    await submission.save();
    
    // Write the source code
    var srcPath = "/root/submissions/" + item._id + "/";
    fs.makeDirSync(srcPath);

    switch (item.language) {
        case "python" | "python3":
            srcPath += "main.py";
            break;
        case "java":
            srcPath += "Main.java";
            break;
        case "c":
            srcPath += "main.c";
            break;
        case "cpp":
            srcPath += "main.cpp";
            break;
        case "javascript":
            srcPath += "main.js";
        default:
            console.log("ERROR: Language " + item.language + " not supported");
            return;
    }

    fs.writeFile(srcPath, submission.code, function(err) {
        if (err) {
            console.log(err);
            return;
        }
    });

    var verdict = await gradeSubmission(submission._id);
    res.send(verdict);
});


// Add Problem API

app.post("/problem/add/", async function(req,res){
  userData = req.body;
  queryName = req.params.USERNAME;
  const prob = new Problem({
    name:userData.name,
    description: userData.desc,// Description
  // A list of two examples
    example1: userData.example1,
    example2: userData.example2,
    constraints: userData.constraints
  });
  prob.save();
  console.log("Saved");
  res.send("OK");
});

const GRADER_PATH = "/root/src/grader/grader.sh ";

/**
 * function gradeSubmission: 
 * 
 * 
 * Save the source code to /root/submissions/{submissionId}/. Expected source code file names:
 * Python:      main.py
 * Java:        Main.java
 * C:           main.c
 * C++:         main.cpp
 * Javascript:  main.js
 * 
 * @param {*} submissionId: String.
 * 
 * @returns: A number representing the grader verdict, where:
 * 0 = Accepted
 * 1 = Compile Error or Compile Time Exceeded (default limit: 30 seconds)
 * 2 = Runtime Error
 * 3 = Wrong Answer
 * 4 = Time limit exceeded
 * 5 = Memory limit exceeded
 */
async function gradeSubmission(submissionId) {
    
    try {
        var submission = await Submission.findById(submissionId);

        var submissionArg = "-s " + submission._id + " ";
        var languageArg = "-l " + submission.language + " ";
        var testcaseArg = "-T " + submission.testcase + " ";
        
        child_process.exec(GRADER_PATH + submissionArg + languageArg + testcaseArg, (err, stdout, stderr) => {
            if (err) {
                return err;
            }
            return "Accepted!";
        }
        );
    }
    catch (err) {
        console.error(err);
        return -1;
    }
}
