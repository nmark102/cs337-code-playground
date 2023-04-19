/*
 * Author(s): Angel Benavides, Mark Nguyen, Nishant Athawale                       
 * Class: CS 337, Spring 2023                                                      
 * File: code.js                                                                
 * Assignment: Final Project - LeetCode Clone                                      
 * Purpose: Implement functions for index.html that will make requests to
 * server or implement function.
 */

/*** ------ Start index.hmtl functions ----------

/*
 * Chanaes window to webpage for user to create new profile.
 */
function newUser() {
  
  window.location.href = './newUser.html';
}

/*
 * Sends request to server for login.
 */
function login() {
  let u = document.getElementById("username").value;
  let p = document.getElementById("password").value;
  let url = `/account/login/${u}/${encodeURIComponent(p)}`;
  if(u == "" || p == "") {
    window.alert("empty fields");
    return;
  }
  fetch(url)
  .then((response) => {
    if(response.ok) {
      window.location.href = './userHome.html';
    } else {
      window.alert("Issue logging in");
    }
  })
  .catch((error) => {
    window.alert("Server issue logging in");
    console.log(error);
  });
}
/*** ------ End index.html functions  ------------*/


/*** ------ Start newUser.html functions ---------*/

/*                                                
 * Changes window to webpage for user to create new profile.                       
 */                                                                                
function createUser() {
  let u = document.getElementById("create_username").value;
  let p = document.getElementById("create_password").value;
  let e = document.getElementById("email"),value;
  if(u == "" || p == "" || e == "") {
    window.alert("empty fields");
    return;
  }
  let data = {Name: u, Password: p, email: e};
  let url = `/create/account/`;
  fetch(url, {
    method: 'POST',                                                             
    body: JSON.stringify(data),                                                 
    headers: {"Content-Type": "application/json"}                               
  })
  .then((response) => {
    if(response.ok) {
      window.alert('New User Created!');          
      window.location.href = './index.html';
    } else {
      window.alert("Issue creating user");
    }
  })
  .catch((error) => {
    window.alert("Server issue creating account");
    console.log(error);
  });
}   

/*** ------ End newUser.html functions -----------*/

/*** ------ Start admin.html functions -----------*/
function uploadProblem() {
  let n = document.getElementById("Name").value;
  let d = document.getElementById("desc").value;
  let e1 = document.getElementById("exmp1").value;
  let e2 = document.getElementById("exmp2").value;
  let c = document.getElementById("constraints").value;
  let data = {name: n, desc: d, example1: e1, example2: e2, constraints: c}
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
/*** ------ End admin.html functions -------------*/

/*** ------ Start userHome.html ------------------*/

/*
 * Get list of problemes from server 
 *
 */
function downloadProblems() {
  let url = '/download/problems/'
  fetch(url)
  .then(response => response.json())
  .then(data => {
    html = "";
    (for i in data) {
      html += `<div><button value="${data[i].name}">
    }
  }
  .catch((error) => {
    console.error(error);
  });

  
}







