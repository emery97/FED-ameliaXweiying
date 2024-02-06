// ******************** LINKING OF USER LOG IN  ETC ETC ***************************************
// This function displays the welcome message on the page
function displayWelcome(userName) {
  var welcomeMessageElement = document.getElementById('welcome-message');
  welcomeMessageElement.textContent = `Welcome, ${userName}`;
  sessionStorage.setItem('userName', userName);
}

document.addEventListener("DOMContentLoaded", function () {
  if (sessionStorage.getItem('userName')) {
    displayWelcome(sessionStorage.getItem('userName'));
  }
});


// Modify the setWelcomeMessageOnLogin function
function setWelcomeMessageOnLogin(userName, userEmail) {
  displayWelcome(userName);
  sessionStorage.setItem('userName', userName);
  sessionStorage.setItem('userEmail', userEmail); // Use the same key here
}

function onSignIn(userId, userName, userEmail) {
  sessionStorage.setItem('userId', userId);
  setWelcomeMessageOnLogin(userName, userEmail);
}

document.addEventListener("DOMContentLoaded", function () {
  const APIKEY = "65b334a346893806b17bde81"; // Replace with your actual API key
  let apiUrl = "https://fedpairassgn-14ba.restdb.io/rest/customer"; // Replace with your actual URL

  if (sessionStorage.getItem('userName')) {
    displayWelcome(sessionStorage.getItem('userName'));
  }

  // Sign In Event Listener
  const signInButton = document.getElementById("sign-in-button");
  if (signInButton) {
    signInButton.addEventListener("click", function (e) {
      e.preventDefault();

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
          alert("There was an error creating the account.");
        });
    });
  }

  // Sign Up Event Listener
  const signUpButton = document.getElementById("sign-up-button");
  if (signUpButton) {
    signUpButton.addEventListener("click", function (e) {
      e.preventDefault();

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
          alert("There was an error creating the account.");
        });
    });
  }
});


// Function to call when the game ends to update the user's points
function onGameEnd() {
  // Assuming 'score' is a global variable holding the user's score
  let pointsEarned = score;

  // Get the user ID from session storage
  const userId = sessionStorage.getItem('userId');
  if (userId) {
    // Update the points using the user ID and points earned
    updatePoints(userId, pointsEarned);
  } else {
    console.error('User is not logged in.');
    alert('You must be logged in to save your score.');
  }
}

// This function updates the user's points in the database
function updatePoints(userId, pointsEarned) {
  const APIKEY = "65b334a346893806b17bde81";
  let apiUrl = `https://fedpairassgn-14ba.restdb.io/rest/customer/${userId}`;

  // Fetch the current user data
  fetch(apiUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-apikey": APIKEY,
      "Cache-Control": "no-cache"
    }
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then(userData => {
    // Calculate the new points total
    let newPoints = userData['user-points'] + pointsEarned;

    // PUT request to update the user's points
    return fetch(apiUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-apikey": APIKEY,
        "Cache-Control": "no-cache"
      },
      body: JSON.stringify({ "user-points": newPoints })
    });
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then(updatedData => {
    console.log("Points updated successfully:", updatedData);
    alert(`Your new points total is ${updatedData['user-points']}`);
  })
  .catch(error => {
    console.error("Error updating points:", error);
    alert("There was an error updating your points.");
  });
}

// Ensure that onGameEnd is called when the game ends
// For example, if you have a game over button, you could add:
document.addEventListener("DOMContentLoaded", function () {
  // Check if the game-over-button element exists
  const gameOverButton = document.getElementById('game-over-button');
  if (gameOverButton) {
    // Add event listener only if the element exists
    gameOverButton.addEventListener('click', onGameEnd);
  }
});
