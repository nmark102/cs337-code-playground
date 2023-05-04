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

/*
 * Sends request to server for login.
 */
function login() {
  console.log("login");
  let u = document.getElementById('username').value;
  let p = document.getElementById('password').value;
  let url = '/account/login/' + u + '/' + encodeURIComponent(p);
  fetch(url)
  .then((response) => {
    return response.text();
  })
  .then((text) => {
    if(text == 'SUCCESS') {
      window.location.href = './index.html';
    } else {
      window.alert('Login failed');
    }
  })
}

/*** ------ End index.html functions  ------------*/


/*** ------ Start newUser.html functions ---------*/

/*                                                
 * Changes window to webpage for user to create new profile.                       
 */                                                                                

function createAccount() {
  let u = document.getElementById('username').value;
  let p = document.getElementById('password').value;
  let e = document.getElementById('primaryEmail').value;
  console.log(u);
  console.log(p);
  console.log(e);
  let url = '/account/create/' + u + '/' + encodeURIComponent(p) + '/' + e;
  fetch(url)
  .then((response) => {
    console.log(response);
    return response.text();
  })
  .then((text) => {
    if(text == 'Created new account!') {
      window.location.href = './userHome.html';
    } else {
      window.alert('Failed to create new account');
    }
    window.alert(text);
  })
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
      console.log(data.names[i]);
      let name = data.names[i];
      html += '<div class="prompt"><button class="button" value="' + name + 
        '" onclick="switchWindow(this.value)">' + name + '</button>';
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
  let currLang = document.getElementById('currLang');
  if(currLang.value == string) {
    return;
  }
  let v = "";
  let l = "";
  if(string == 'javascript') {
    v = 'function hello() {\n\talert("Hello World!");\n}';
    l = string; 
  }
  if(string == 'python') {
    v = 'class Solution(object):\n\tdef main():\n\t\tprint("Hello World!")';
    l = string;
    currLang.value = 'python3';
  }
  if(string == 'c') {
    v = '#include <stdio>\n\n\nint main(argc, argv[])';
    l = string;
  }
  currLang.value = string;
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

function closeConsole() {
  document.getElementById('infoSmall').id = 'info';
  document.getElementById('results').remove();
}

function logout() {
  alert("logging out");
/*  fetch('user/logout')
  .then(() => {
    console.log("logged out");
  })
  .catch((error) => {
    console.error(error);
  });
*/
}

/*** ------ Start problem.html functions ------------------*/

/* Assign testcase name according to problem selected */
function getTestCase() {
  let p = localStorage.getItem('problem');
  if(p == "Two Sum") {
    return '2-two-sum'; 
  }
  if(p == 'Add Two Numbers') {
    return '1-add-two-numbers';
  }
  if(p == 'Find Median') {
    return '3-find-median';
  }
  return 'none';
}

function submitAndExecute(){
  let check = document.getElementById('results');
  if(check !== null) {
    console.log("test");
    return;
  }
  let code = codespace.getValue(); // Gets string from monaco editor
  document.getElementById('info').id = 'infoSmall';
  let html = `<div id="results" class="box"><button id="close" class="button"`+
              `onclick="closeConsole()">X</button>` + 
              `<h3>Failed!</h3></div>`;
  document.getElementById('parent').innerHTML += html;
  let currLang = document.getElementById('currLang'); 
  url = "/problem/execute/"
  let testCase = getTestCase();
  if(testCase == 'none') {
    alert('Administrators have not added test cases yet, Sorry =(');
    return; 
  }
  data = {code: code, language: currLang.value, testcase: testCase};
/*  fetch(url, {
    method: 'POST',                                                             
    body: JSON.stringify(data),                                                 
    headers: {"Content-Type": "application/json"}  
  })
  .then((response) => {                                                                
    return response.text;
  })  
  .then((text) => {                                                             
    alert(text);
  })                                                                           
  .catch(() => {                                                               
    alert('something went wrong');                                              
  }); 
  alert('completed function');*/
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
     let p = localStorage.getItem('problem');
     getProblem(p);
   }
});

