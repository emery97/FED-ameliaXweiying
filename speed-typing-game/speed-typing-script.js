const RANDOM_QUOTE_API_URL = 'http://api.quotable.io/random';
const quoteDisplayElement = document.getElementById('quoteDisplay');
const quoteInputElement = document.getElementById('quoteInput');
const timerElement = document.getElementById('timer');
let score = 0;
let scoreUpdateAttempted = false; // Declare the variable at the top level of your script

// Call this function when the page loads to initialize the play count if it's a new day
initializePlayCount();

quoteInputElement.addEventListener('input', () => {
  const arrayQuote = quoteDisplayElement.querySelectorAll('span');
  const arrayValue = quoteInputElement.value.split('');

  let correct = true;
  arrayQuote.forEach((characterSpan, index) => {
    const character = arrayValue[index];
    if (character == null) {
      characterSpan.classList.remove('correct');
      characterSpan.classList.remove('incorrect');
      correct = false;
    } else if (character === characterSpan.innerText) {
      characterSpan.classList.add('correct');
      characterSpan.classList.remove('incorrect');
    } else {
      characterSpan.classList.remove('correct');
      characterSpan.classList.add('incorrect');
      correct = false;
    }
  });

  if (correct) {
    if (canPlay()) {
      incrementPlayCount();
      renderNewQuote();
    } else {
      showModal(score);
    }
  }
});

function showModal(score) {
  document.querySelector('.modal-body h6').textContent = `YOUR FINAL SCORE IS: ${score}`;
  document.getElementById('gameOverModal').style.display = 'block';
}

function closeModal() {
  document.getElementById('gameOverModal').style.display = 'none';
}

async function renderNewQuote() {
  const quote = await getRandomQuote();
  quoteDisplayElement.innerHTML = '';
  quote.split('').forEach(character => {
    const characterSpan = document.createElement('span');
    characterSpan.innerText = character;
    quoteDisplayElement.appendChild(characterSpan);
  });
  quoteInputElement.value = null;
  startTimer();
  score += 10;
}

function startTimer() {
  timerElement.innerText = 0;
  startTime = new Date();
  setInterval(() => {
    timer.innerText = getTimerTime();
  }, 1000);
}

function getTimerTime() {
  return Math.floor((new Date() - startTime) / 1000);
}

function initializePlayCount() {
  const today = new Date().toDateString();
  const savedDate = localStorage.getItem('date');

  if (savedDate !== today) {
    localStorage.setItem('date', today);
    localStorage.setItem('playCount', '0');
    score = 0; //  reset the score for the new day
  }
}
quoteInputElement.addEventListener('input', () => {
  const arrayQuote = quoteDisplayElement.querySelectorAll('span');
  const arrayValue = quoteInputElement.value.split('');

  let correct = true;
  arrayQuote.forEach((characterSpan, index) => {
    const character = arrayValue[index];
    if (character == null) {
      characterSpan.classList.remove('correct');
      characterSpan.classList.remove('incorrect');
      correct = false;
    } else if (character === characterSpan.innerText) {
      characterSpan.classList.add('correct');
      characterSpan.classList.remove('incorrect');
    } else {
      characterSpan.classList.remove('correct');
      characterSpan.classList.add('incorrect');
      correct = false;
    }
  });

  if (correct) {
    incrementPlayCount(); // Move this outside of canPlay check so it increments even on last play
    if (canPlay()) {
      renderNewQuote();
    } else {
      if (!scoreUpdateAttempted) { // Check if score update has been attempted
        updatePlayerScore(score); // Call updatePlayerScore here
      }
      showModal(score); // Show the modal after updating the score
    }
  }
});
function canPlay() {
  const playCount = parseInt(localStorage.getItem('playCount'), 10);
  return playCount < 10; // this checks if the player can still play
}
// Make sure to define the updatePlayerScore function and other necessary parts of your code as before.
function updatePlayerScore(newScore) {
  // Check if we already attempted to update the score to avoid double alerts
  if (scoreUpdateAttempted) {
      console.log('Score update was already attempted. Skipping.');
      return;
  }

  const userId = localStorage.getItem('userId');
  if (!userId) {
      console.error('User _id not found. User must be signed in to update score.');
      alert('Your points could not be added as you do not have an account.');
      scoreUpdateAttempted = true; // Set the flag after the first attempt
      return;
  }

  // Fetch current user data
  const urlGet = `https://fedpairassgn-14ba.restdb.io/rest/customer/${userId}`;
  const settingsGet = {
      method: "GET",
      headers: {
          "Content-Type": "application/json",
          "x-apikey": "65b334a346893806b17bde81",
          "Cache-Control": "no-cache"
      }
  };

  fetch(urlGet, settingsGet)
      .then(response => response.json())
      .then(userData => {
          // Calculate new score by adding newScore to the current score
          // Ensure we handle if "user-points" does not exist or is undefined
          const currentScore = userData["user-points"] || 0;
          const updatedScore = currentScore + newScore;

          // Prepare updated user data with new score
          const updatedUserData = {
              ...userData,
              "user-points": updatedScore // Update the score with new total
          };

          // Prepare PUT request to update user data
          const settingsPut = {
              method: "PUT",
              headers: {
                  "Content-Type": "application/json",
                  "x-apikey": "65b334a346893806b17bde81",
                  "Cache-Control": "no-cache"
              },
              body: JSON.stringify(updatedUserData)
          };

          return fetch(urlGet, settingsPut); // Reuse urlGet since it's the same endpoint
      })
      .then(response => {
          if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
      })
      .then(updatedUser => {
          console.log('Score updated successfully', updatedUser);
          alert('Your score has been added successfully!');
      })
      .catch(error => {
          console.error('Error updating score:', error);
          alert('There was an error adding your score.');
      });

      scoreUpdateAttempted = true; // Move this to the end of successful score update
}

function incrementPlayCount() {
  const playCount = parseInt(localStorage.getItem('playCount'), 10);
  localStorage.setItem('playCount', playCount + 1);
}

function getRandomQuote() {
  return fetch(RANDOM_QUOTE_API_URL)
    .then(response => response.json())
    .then(data => data.content);
}

renderNewQuote();

// Set MIME type for CSS files
document.addEventListener("DOMContentLoaded", function() {
  var links = document.getElementsByTagName("link");
  for (var i = 0; i < links.length; i++) {
    if (links[i].getAttribute("rel") === "stylesheet") {
      links[i].type = "text/css";
    }
  }
});
