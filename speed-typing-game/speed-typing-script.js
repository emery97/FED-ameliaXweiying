// Declaration of constants and variables
const RANDOM_QUOTE_API_URL = 'http://api.quotable.io/random';
const quoteDisplayElement = document.getElementById('quoteDisplay');
const quoteInputElement = document.getElementById('quoteInput');
const timerElement = document.getElementById('timer');
let score = 0;
let scoreUpdateAttempted = false; // Flag to track if score update has been attempted

// Function to initialize play count and score on page load
initializePlayCount();

// Event listener to handle user input in the quote input field
quoteInputElement.addEventListener('input', () => {
  // Extracting characters from quote display and user input
  const arrayQuote = quoteDisplayElement.querySelectorAll('span');
  const arrayValue = quoteInputElement.value.split('');

  let correct = true; // Flag to check if the input matches the quote
  // Loop through each character in the quote display and user input
  arrayQuote.forEach((characterSpan, index) => {
    const character = arrayValue[index];
    // Check if the character is null, correct, or incorrect
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

  // If the input matches the quote, proceed to the next step
  if (correct) {
    if (canPlay()) {
      incrementPlayCount(); // Increment play count
      renderNewQuote(); // Render a new quote
    } else {
      showModal(score); // Show the modal with the final score
    }
  }
});

// Function to display the modal with the final score
function showModal(score) {
  document.querySelector('.modal-body h6').textContent = `YOUR FINAL SCORE IS: ${score}`;
  document.getElementById('gameOverModal').style.display = 'block';
}

// Function to close the modal
function closeModal() {
  document.getElementById('gameOverModal').style.display = 'none';
}

// Asynchronous function to render a new quote
async function renderNewQuote() {
  const quote = await getRandomQuote(); // Fetch a new random quote
  quoteDisplayElement.innerHTML = ''; // Clear previous quote
  // Display each character of the new quote
  quote.split('').forEach(character => {
    const characterSpan = document.createElement('span');
    characterSpan.innerText = character;
    quoteDisplayElement.appendChild(characterSpan);
  });
  quoteInputElement.value = null; // Reset input field
  startTimer(); // Start the timer
  score += 10; // Increment the score
}

// Function to start the timer
function startTimer() {
  timerElement.innerText = 0;
  startTime = new Date();
  setInterval(() => {
    timer.innerText = getTimerTime();
  }, 1000);
}

// Function to calculate the elapsed time
function getTimerTime() {
  return Math.floor((new Date() - startTime) / 1000);
}

// Function to initialize play count and score for the day
function initializePlayCount() {
  const today = new Date().toDateString();
  const savedDate = localStorage.getItem('date');

  if (savedDate !== today) {
    localStorage.setItem('date', today);
    localStorage.setItem('playCount', '0');
    score = 0; // Reset the score for the new day
  }
}

// Event listener to check user input after each keystroke
quoteInputElement.addEventListener('input', () => {
  const arrayQuote = quoteDisplayElement.querySelectorAll('span');
  const arrayValue = quoteInputElement.value.split('');

  let correct = true;
  arrayQuote.forEach((characterSpan, index) => {
    const character = arrayValue[index];
    // Check if the character is null, correct, or incorrect
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

  // If the input matches the quote, proceed to the next step
  if (correct) {
    incrementPlayCount(); // Increment play count even on last play
    if (canPlay()) {
      renderNewQuote(); // Render a new quote
    } else {
      if (!scoreUpdateAttempted) { // Check if score update has been attempted
        updatePlayerScore(score); // Update the player's score
      }
      showModal(score); // Show the modal after updating the score
    }
  }
});

// Function to check if the player can still play
function canPlay() {
  const playCount = parseInt(localStorage.getItem('playCount'), 10);
  return playCount < 10; // Check if the player can still play
}

// Function to update the player's score
function updatePlayerScore(newScore) {
  if (scoreUpdateAttempted) {
    console.log('Score update was already attempted. Skipping.');
    return;
  }

  const userId = localStorage.getItem('userId');
  if (!userId) {
    console.error('User _id not found. User must be signed in to update score.');
    alert('Your points could not be added as you do not have an account.');
    scoreUpdateAttempted = true;
    return;
  }

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
      const currentScore = userData["user-points"] || 0;
      const updatedScore = currentScore + newScore;
      const updatedUserData = {
        ...userData,
        "user-points": updatedScore
      };
      const settingsPut = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-apikey": "65b334a346893806b17bde81",
          "Cache-Control": "no-cache"
        },
        body: JSON.stringify(updatedUserData)
      };
      return fetch(urlGet, settingsPut);
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

  scoreUpdateAttempted = true;
}

// Function to increment the play count
function incrementPlayCount() {
  const playCount = parseInt(localStorage.getItem('playCount'), 10);
  localStorage.setItem('playCount', playCount + 1);
}

// Function to fetch a random quote from the API
function getRandomQuote() {
  return fetch(RANDOM_QUOTE_API_URL)
    .then(response => response.json())
    .then(data => data.content);
}

// Initial rendering of a new quote
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
