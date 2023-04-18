// Server Setup

// Imports and Server Setup
const express  = require('express');
const parser = require('body-parser');
const exec = require('child_process').exec;
const app = express();
const port = 3000;
const mongoose = require('mongoose');
const Schema = mongoose.Schema
const url = ""
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
const Users = new Schema({});

// Problem Schema
const Problem = new Schema({});

// Problem Instance Schema
const ProblemInstance = new Schema({});

// Submission Schema
const Submission = new Schema({
    language: String,
    path: String,
    testcase: String
});

// Server Routes

// Login Auth

// Create Login API

// Problem List API

// Problem Load API

// Program execution API

// 

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
