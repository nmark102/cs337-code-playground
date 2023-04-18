// Server Setup

// Imports and Server Setup
const express  = require('express');
const parser = require('body-parser')
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


// Server Routes

// Login Auth

// Create Login API

// Problem List API

// Problem Load API

// Program execution API

// 

// Set up the listen
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
