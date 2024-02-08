// ******************** LINKING OF USER LOG IN  ETC ETC ***************************************
// Define the sign in event handler function outside the DOMContentLoaded listener
function signInEventHandler(e) {
  e.preventDefault();
  const APIKEY = "65b334a346893806b17bde81"; // Define API key here or outside the function if needed elsewhere
  let userName = document.getElementById("user-name").value;
  let userEmail = document.getElementById("user-email").value;
  let userPwd = document.getElementById("user-pwd").value;

  // Construct the query URL
  let signInUrl = `https://fedpairassgn-14ba.restdb.io/rest/customer?q={"user-email": "${userEmail}", "user-pwd": "${userPwd}"}`;

  let settings = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-apikey": APIKEY,
      "Cache-Control": "no-cache"
    }
  };

  fetch(signInUrl, settings)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      // Check if any user data is returned
      if (data && data.length > 0) {
        let user = data[0];
        onSignIn(user['_id'], user['user-name'], user['user-email']); // Call onSignIn with the user ID
      } else {
        alert("Incorrect username or password or no such user exists.");
      }
    })
    .catch(error => {
      console.error("Error during sign in:", error);
      alert("There was an error during the sign in process.");
    });
}

// Define the sign up event handler function outside the DOMContentLoaded listener
function signUpEventHandler(e) {
  e.preventDefault();
  const APIKEY = "65b334a346893806b17bde81"; // Define API key here or outside the function if needed elsewhere
  let apiUrl = "https://fedpairassgn-14ba.restdb.io/rest/customer"; // Define API URL here or outside the function if needed elsewhere
  let userName = document.getElementById("user-name").value;
  let userEmail = document.getElementById("user-email").value;
  let userPwd = document.getElementById("user-pwd").value;

  let jsondata = {
    "user-name": userName,
    "user-email": userEmail,
    "user-pwd": userPwd,
    "user-points": 0
  };

  let settings = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-apikey": APIKEY,
      "Cache-Control": "no-cache"
    },
    body: JSON.stringify(jsondata)
  };

  fetch(apiUrl, settings)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log(data);
      alert("Sign Up success!");
      document.getElementById("user-form").reset();
    })
    .catch(error => {
      console.error("Error:", error);
      alert("There was an error creating the account. Please ensure that email written does not belong to any existing user before signing up.");
    });
}

// This function displays the welcome message on the page
function displayWelcome(userName) {
  var welcomeMessageElement = document.getElementById('welcome-message');
  if (welcomeMessageElement) {
    if (!userName) { // Check if userName is null or undefined
      userName = "Guest"; // Set userName to "Guest" if not signed in
    }
    welcomeMessageElement.textContent = `Welcome, ${userName}`;
    sessionStorage.setItem('userName', userName);
  }
}


// This function is called when a user successfully signs in
function onSignIn(userId, userName, userEmail) {
  localStorage.setItem('userName', userName);
  localStorage.setItem('userId', userId); // This should be the _id from the database
  localStorage.setItem('userEmail', userEmail);
  localStorage.setItem('loggedIn', true);
  displayWelcome(userName);
}

// This function is called when a user clicks the log out button
function onSignOut() {
  localStorage.removeItem('userName');
  localStorage.removeItem('userId');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('loggedIn');
  displayWelcome("Guest");
}

document.addEventListener("DOMContentLoaded", function () {
  // Display welcome message based on whether user is signed in or not
  displayWelcome(localStorage.getItem('userName'));

  // Sign In Button Event Listener
  var signInButton = document.getElementById("sign-in-button");
  if (signInButton) {
    signInButton.addEventListener("click", signInEventHandler);
  }

  // Sign Up Button Event Listener
  var signUpButton = document.getElementById("sign-up-button");
  if (signUpButton) {
    signUpButton.addEventListener("click", signUpEventHandler);
  }

  // Log Out Button Event Listener
  var logOutButton = document.getElementById("log-out-button");
  if (logOutButton) {
    logOutButton.addEventListener("click", onSignOut);
  }
});
