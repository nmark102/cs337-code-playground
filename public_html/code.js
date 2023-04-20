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
  let userName = document.getElementById("username").value;
  let passWord = document.getElementById("password").value;
  if(userName == "" || passWord == "") {
    window.alert("empty fields");
    return ;
  }
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

function create() {            
  let userName = document.getElementById("username").value;
  let passWord = document.getElementById("password").value;          
  let primaryEmail = document.getElementById("primaryEmail").value;
  if(userName == "" || passWord == "" || primaryEmail == "") {
    window.alert("empty fields");
    return ;
  }
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

/*** ------ End newUser.html functions -----------*/

/*** ------ Start admin.html functions -----------*/
function uploadProblem() {
  let n = document.getElementById("Name").value;
  let d = document.getElementById("desc").value;
  let e1 = document.getElementById("exmp1").value;
  let e2 = document.getElementById("exmp2").value;
  let c = document.getElementById("constraints").value;
  let data = {name: n, desc: d, example1: e1, example2: e2, constraints: c}
  let url = '/problem/add/'
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

function downloadProblems() {
  let url = '/download/problems/'
  fetch(url)
  .then(response => response.json())
  .then(data => {
    html = "";
    (for i in data) {
      let name = data[i].name;
      html += '<div><button value="' + name + 
        '" onclick="getProblem(this.value)">' + name + "</button></div>\n";
    }
    document.getElementById('choices').innerHTML = html;
  }
  .catch((error) => {
    console.error(error);
  }); 
}

/*
 * Changes to problem window and uploads problem for user.
 *
 * @param problem, the name of a problem the user wants.
 */
function getProblem(problem) {
  window.location.href = 'problem.html';
  let url = '/get/problem/'
  fetch(url)
  .then(response => response.json())
  .then(data => {
    let text = `${data.name}\n${data.description}\n` + 
      `${data.example1}\n${data.example2}\n` + `${data.constraints}`;
    document.getElementById('desc').value = text;
  })
  .catch((error) => {
    console.error(error);
  })

}


/*** ------ Start problem.html functions ------------------*/
function submitAndExecute(){
  let code = document.getElementById("board").value
  console.log(code);
  url = "/problem/execute/"
  data = {codeData: code};
  fetch(url, {
    method: 'POST',                                                             
    body: JSON.stringify(data),                                                 
    headers: {"Content-Type": "application/json"}  
  })
  .then((response) => {                                                                
    return response.text;
  })  
  .then((text) => {                                                                
    window.alert(text);
  })                                                                           
  .catch(() => {                                                               
    alert('something went wrong');                                              
  });  

}
/*** ------ End problem.html functions -------------*/








