// Function to fetch leaderboard data from RESTdb
function fetchLeaderboardData() {
  const APIKEY = "65b334a346893806b17bde81"; // Define API key here or outside the function if needed elsewhere

  // Construct the query URL
  let leaderboardUrl = `https://fedpairassgn-14ba.restdb.io/rest/customer?sort=user-points`;

  let settings = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-apikey": APIKEY,
      "Cache-Control": "no-cache"
    }
  };

  fetch(leaderboardUrl, settings)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      // Check if any leaderboard data is returned
      if (data && data.length > 0) {
        populateLeaderboard(data.reverse()); // Reverse the order of players array
      } else {
        alert("No leaderboard data available.");
      }
    })
    .catch(error => {
      console.error("Error fetching leaderboard data:", error);
      alert("There was an error fetching the leaderboard data.");
    });
}

// Function to populate leaderboard with fetched data
function populateLeaderboard(players) {
  const leaderboardList = document.getElementById('leaderboardList');
  leaderboardList.innerHTML = ''; // Clear existing list if any

  players.forEach((player, index) => {
    const listItem = document.createElement('li');
    listItem.classList.add('leaderboard-item');

    // Create the leaderboard item HTML
    listItem.innerHTML = `
      <span class="leaderboard-rank">${index + 1}</span>
      <span class="leaderboard-name">${player['user-name']}</span>
      <span class="leaderboard-score">${player['user-points']}</span>
    `;

    leaderboardList.appendChild(listItem);
  });
}

document.addEventListener("DOMContentLoaded", function () {
  // Fetch and display leaderboard data
  fetchLeaderboardData();

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
