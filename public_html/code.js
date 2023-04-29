/*
 * Author(s): Angel Benavides, Mark Nguyen, Nishant Athawale                       
 * Class: CS 337, Spring 2023                                                      
 * File: code.js                                                                
 * Assignment: Final Project - LeetCode Clone                                      
 * Purpose: Implement functions for index.html that will make requests to
 * server or implement function.
 */

var codespace;

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
  if(n == "" || d == "") {
    window.alert("Please enter problem name and problem description");
    return ;
  }
  let url = '/problem/add/'
  fetch(url,  {
    method: 'POST',                                                             
    body: JSON.stringify(data),                                                 
    headers: {"Content-Type": "application/json"}                               
  })
  .then(() => {               
    if(response.ok) {
      window.alert('Problem already exists');
      return;
    } else {
      window.alert('Problem added!');
    }
  })                                                                           
  .catch(() => {                                                               
    alert('something went wrong');                                              
  });   
}
/*** ------ End admin.html functions -------------*/

/*** ------ Start userHome.html ------------------*/

/*
 * Used to download problems from data base and display on webpage.
 */
function downloadProblems() {
  let url = '/problems/download/'
  fetch(url)
  .then(response => response.json())
  .then(data => {
    html = "";
    for(let i=0; i<data.names.length;i++) {
      console.log(data.names[i])
      let name = data.names[i];
      html += '<div><button value="' + name + 
        '" onclick="switchWindow(this.value)">' + name + "</button></div>\n";
    }
    document.getElementById('choices').innerHTML = html;
  })
  .catch((error) => {
    console.error(error);
  }); 
}
function switchWindow(identifier){
  console.log(identifier)
  localStorage.setItem('problem', identifier);
  window.location.href = 'problem.html'
//  getProblem(identifier);
}


/* 
 * Select language for Monaco code editor api
 *
 * @param string, syntax language
 */
function selectLang(string) {
  let v = "";
  let l = "";
  if(string == 'javascript') {
    v = 'function hello() {\n\talert("Hello, Monaco!");\n}';
    l = string;  
  }
  if(string == 'python') {
    v = 'class Solution(object):\n\tdef main():';
    l = string;
  }
  if(string == 'c') {
    v = '#include <stdio>\n\n\nint main(argc, argv[])';
    l = string;
  }
  monaco.editor.setModelLanguage(codespace.getModel(), string);
  codespace.getModel().setValue(v);
  
}

/* 
 * Switch theme
 *
 */
function theme(string) {
  monaco.editor.setTheme(string);
  codespace.layout();
}

/*
 * Changes to problem window and uploads problem for user.
 *
 * @param problem, the name of a problem the user wants.
 */
function getProblem(p) {
  let url = `/problem/get/${p}`
  fetch(url)
  .then(response => (response.json()))
  .then(data => {
    let text = `<h2>${data.name}</h2><br>` + `<p>${data.description}</p><br>` + 
      `<p>${data.example1}</p><br>` + `<p>${data.example2}</p><br>` + 
      `<p>${data.constraints}</p>`;
      document.getElementById('info').innerHTML = text;
    require.config({ paths: { 'vs': 'https://unpkg.com/monaco-editor@latest/min/vs' }});
    require(['vs/editor/editor.main'], function() {
        codespace = monaco.editor.create(document.getElementById('board'), {
        value: 'function hello() {\n\talert("Hello, Monaco!");\n}',
        theme: 'vs-dark', 
        language: 'javascript'
        });
    });
  })
  .catch((error) => {
    console.error(error);
  })

}

/*** ------ Start problem.html functions ------------------*/
function submitAndExecute(){
  let code = codespace.getValue(); // Gets string from monaco editor
  alert(code);

/*  url = "/problem/execute/"
  data = {codeData: code, language: "python3", testcase: ""};
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
*/
}
/*** ------ End problem.html functions -------------*/

/*** ------ Start Event Listeners ------------------*/

document.addEventListener('DOMContentLoaded', function() {
  if (window.location.href.endsWith('userHome.html')) {
    downloadProblems(); 
  }
});

document.addEventListener('DOMContentLoaded', function() {
   if (window.location.href.endsWith('problem.html')) { 
     let p = localStorage.getItem('problem')
     getProblem(p);
   }
});

