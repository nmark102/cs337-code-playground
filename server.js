// Server Setup

// Imports and Server Setup
const express  = require('express');
const parser = require('body-parser');
const exec = require('child_process').exec;
const app = express();
const port = 3000;
const mongoose = require('mongoose');
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
  // Name
  // Password
  // Salt 
  // Hash
  // email
  // ProblemList (A list of problem instances)
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

// Server Routes

// Login Auth

// Create Login API

// Problem List API

// Problem Load API

// Program execution API

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
