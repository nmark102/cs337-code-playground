/*
 * Author(s): Angel Benavides, Mark Nguyen, Nishant Athawale                       
 * Class: CS 337, Spring 2023                                                      
 * File: code.js                                                                
 * Assignment: Final Project - LeetCode Clone                                      
 * Purpose: Implement functions for index.html that will make requests to
 * server or implement function.
 */

/* ------ Start index.hmtl functions ----------

/*
 * Chanaes window to webpage for user to create new profile.
 */
function createUser() {
  window.location.href = './newUser.html';
}

/*
 * Sends request to server for login.
 */
function login() {
  let userName = document.getElementById("username").value;
  let passWord = document.getElementById("password").value;
  let data = {username: userName, password: passWord};
  url = "/user/auth/"
  fetch(url,  {
    method: 'POST',                                                             
    body: JSON.stringify(data),                                                 
    headers: {"Content-Type": "application/json"}                               
  })
  .then((response) => {
    return response.text();
  })
  .then((text) => {   
    console.log(text);                                                             
    if(text === "OK"){
      window.location.href = './userHome.html';
      // console.log("Bruh Moment");
    }
    else if(text === "NOPASS"){
      window.alert("Wrong Password");
    }
    else{
      window.alert("Account not found. Create a new one.");
    }
  })                                                                           
  .catch(() => {                                                               
    alert('something went wrong');                                              
  });
}
/* ------ End index.html functions  ------------*/


/* ------ Start newUser.html functions ---------*/

/*                                                
 * Changes window to webpage for user to create new profile.                       
 */                                                                                
function create() {            
  let userName = document.getElementById("username").value;
  let passWord = document.getElementById("password").value;          
  let primaryEmail = document.getElementById("primaryEmail").value; 
  let data = {username: userName, password: passWord, email:primaryEmail};
  let url = "/user/createAccount/"  
  fetch(url,{
    method: 'POST',                                                             
    body: JSON.stringify(data),                                                 
    headers: {"Content-Type": "application/json"}                               
  })     
  .then(() => {                                                                
    window.alert('New User Created! Log In');                                                         
    window.location.href = './index.html';
  })                                                                           
  .catch(() => {                                                               
    alert('something went wrong');                                              
  });                                                                           
}   

/* ------ End newUser.html functions -----------*/

/* ------ Start admin.html functions -----------*/
function uploadProblem() {
  let d = document.getElementById("desc").value;
  let e1 = document.getElementById("exmp1").value;
  let e2 = document.getElementById("exmp2").value;
  let c = document.getElementById("constraints").value;
  let data = {desc: d, example1: e1, example2: e2, constraints: c}
  let url = '/add/problem/'
  fetch(url,  {
    method: 'POST',                                                             
    body: JSON.stringify(data),                                                 
    headers: {"Content-Type": "application/json"}                               
  })
  .then(() => {                                                                
    window.alert('Problem added!');
  })                                                                           
  .catch(() => {                                                               
    alert('something went wrong');                                              
  });   
}


/* ------ End admin.html functions -------------*/
