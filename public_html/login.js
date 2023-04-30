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
        window.location.href = './app/userHome.html';
      } else {
        window.alert('Login failed');
      }
    })
  }

  function newUser() {  
    window.location.href = './newUser.html';
  }

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
        window.location.href = './index.html';
      } else {
        window.alert('Failed to create new account');
      }
      window.alert(text);
    })
  }