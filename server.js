// Server Setup

// Imports and Server Setup
const express  = require('express');
const parser = require('body-parser');
const exec = require('child_process').exec;
const app = express();
const port = 3000;
const mongoose = require('mongoose');
const fs = require('fs');
const Schema = mongoose.Schema
const url = "mongodb+srv://nishant3j:dKbkythUhL31a5EL@cluster337.jn1tr0y.mongodb.net/test"
app.use(express.static('public_html'));
app.use(express.json());

// Database Connection setup

mongoose.connect(url, { useNewUrlParser: true })

const db = mongoose.connection
db.once('open', _ => {
  console.log('Database connected:', url)
})

db.on('error', err => {
  console.error('connection error:', err)
})


// Schema setup

// User Schema
const Users = new Schema({
  name:String,  // Name
  password:String,// Password
  // Salt 
  // Hash
  email:String,// email
  problemlist:[Schema.Types.ObjectId]// ProblemList (A list of problem instances)
  // 
});

// Problem Schema
const Problems = new Schema({
  description: String,// Description
  // A list of two examples
  example1: String,
  example2: String,
  constraints: String// Sample input
});

// Problem Instance Schema
const ProblemInstance = new Schema({
  // problem id
  // List of submissions

});

// Submission Schema
const Submission = new Schema({
    // problem id
    language: String,
    testcase: String
    // timestamp
    // Code
});

// Setting up models

const Problem = mongoose.model('Problem', Problems);
const User = mongoose.model("User", Users);


// Server Routes

// Login Auth
app.post("/user/auth/", async function(req,res){
  userData = req.body;
  const temp = await User.find({name:userData.username}).exec()
  if(temp !== []){
    if(temp[0].password === userData.password){
      res.send("OK");
    }
    else{
      res.send("NOPASS");
    }
    // Set current user to the this one
  }
  else{
    res.send("NOPE");
  }
});

// Create User API
app.post("/user/createAccount/", async function(req,res){
  userData = req.body;
  const Usr = new User({
    name:userData.username,  // Name
    password:userData.password,// Password
  // Salt 
  // Hash
    email:userData.email,// email
    problemlist:[]
  });
  Usr.save();
  console.log("Saved");
  res.send("OK");
})

// Problem List API

// Problem Load API

app.post("/problem/execute/", async function(req, res) { // Program execution API
  userData = req.body;
  code = userData.code;
  
  // TODO: use the code to run the code and store the status in the variable
  var submission = new Submission({
    
    // Extract source code, language, and chosen problemset to create a new submission
    language: userData.language,
    testcase: userData.testcase,
    code: userData.code
  }).save()
  .then(item => {
    // Write the sourcode code
    var srcPath = "./submissions/" + item._id + "/";

    switch (item.language) {
        case "python3":
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
        default:
            console.log("ERROR: Language " + item.language + " not supported");
            return;
    }

    fs.writeFile(srcPath, item.code, function(err) {
        if (err) {
            console.log(err);
            return;
        }
    });

  })
  .then(item => {
    // Run the code
    var verdict = gradeSubmission(item._id);
  })
  .then(verdict => {
    return verdict;
  })
  .catch(err => {
    console.error(err);
  });
});

// Add Problem API

app.post("/add/problem/", async function(req,res){
  userData = req.body;
  queryName = req.params.USERNAME;
  const prob = new Problem({
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


/**
 * function gradeSubmission: Grade the submission
 * 
 * Save the source code to ~/submissions/{submissionId}/. Expected source code file names:
 * Python:  main.py
 * Java:    Main.java
 * C:       main.c
 * C++:     main.cpp
 * 
 * @param {*} submissionId: String.
 * 
 * @returns: A number representing the grader verdict, where:
 * 0 = Accepted
 * 1 = Compile Error or Compile Time Exceeded (default limit: 30 seconds)
 * 2 = ???
 * 3 = ???
 * 4 = TBD
 */
async function gradeSubmission(submissionId) {
    var submissionPath = null;
    var testcasePath = null;

    await Submission.findById(submissionId, function(err, submission) {
        if (err) {
            console.log(err);
            return;
        }
    
        submissionPath = "./submissions/" + submissionId + "/";

        switch (submission.language) {
            case "python3":
                submissionPath += "main.py";
                break;
            case "java":
                submissionPath += "Main.java";
                break;
            case "c":
                submissionPath += "main.c";
                break;
            case "cpp":
                submissionPath += "main.cpp";
                break;
            default:
                console.log("ERROR: Language " + submission.language + " not supported");
                return;
        }
    });

    

}

// Set up the listen
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
