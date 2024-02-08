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
  const modal = document.getElementById('gameOverModal');
  if (modal) {
    modal.style.display = 'none';
    renderNewQuote(); // Render a new quote after closing the modal
  }
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
  // startTimer(); // Remove this line to prevent the timer from starting here
  score += 10;
}


let interval;
function startTimer() {
  clearInterval(interval); // Clear any existing intervals
  timerElement.innerText = 0;
  startTime = new Date();
  interval = setInterval(() => {
    timerElement.innerText = getTimerTime();
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




// Set MIME type for CSS files
document.addEventListener("DOMContentLoaded", function() {
  var links = document.getElementsByTagName("link");
  for (var i = 0; i < links.length; i++) {
    if (links[i].getAttribute("rel") === "stylesheet") {
      links[i].type = "text/css";
    }
  }
});

document.querySelector('.modal-close-btn').addEventListener('click', closeModal);


// -------------------------------------- WHACK A MOLE POP UP INSTRUCTIONS ----------------------------------------------
window.addEventListener('DOMContentLoaded', (event) => {
  // Assuming the game instructions modal has a unique ID 'gameInstructionsModal'
  const gameInstructionsModal = document.getElementById('gameInstructionsModal');
  const closeInstructionsButton = document.querySelector('.close-button'); // Make sure this class is unique to the close button of the instructions modal

  // Function to open the game instructions modal
  function openGameInstructions() {
    console.log('openGameInstructions called'); // This should appear in the console
    const gameInstructionsModal = document.getElementById('gameInstructionsModal');
    if (gameInstructionsModal) {
        gameInstructionsModal.style.display = 'block';
    } else {
        console.error('Game instructions modal not found');
    }
  }
  
  function closeGameInstructions() {
    const gameInstructionsModal = document.getElementById('gameInstructionsModal');
    if (gameInstructionsModal) {
        gameInstructionsModal.style.display = 'none';
        startTimer(); // Start the timer when the instructions are closed
        renderNewQuote(); // Render the new quote immediately
    }
  }
  
    
  // Event listener for the close button of the game instructions modal
  if (closeInstructionsButton) {
      closeInstructionsButton.addEventListener('click', closeGameInstructions);
  }

  // If you have an element that should trigger the game instructions popup when clicked
  // Add a click event listener to that element to open the game instructions
  const openInstructionsBtn = document.getElementById('showInstructionsBtn'); // Replace with your actual button's ID
  if (openInstructionsBtn) {
      openInstructionsBtn.addEventListener('click', openGameInstructions);
  }
});

// Combined DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', async () => {
  await initializePlayCount(); // Ensure play count is initialized
  openGameInstructions(); // Open the instructions modal when the page is fully loaded

  // Setup event listener for the 'X' button of the instructions modal
  const closeInstructionsButton = document.querySelector('.close-button');
  if (closeInstructionsButton) {
    closeInstructionsButton.addEventListener('click', closeGameInstructions);
  }
  
});

function openGameInstructions() {
  console.log('openGameInstructions called'); // This should appear in the console
  const gameInstructionsModal = document.getElementById('gameInstructionsModal');
  if (gameInstructionsModal) {
      gameInstructionsModal.style.display = 'block';
  } else {
      console.error('Game instructions modal not found');
  }
}

  // Modify this function to start the game when the instructions modal is closed
// Function to start the game and timer when the instructions modal is closed
function closeGameInstructions() {
  const gameInstructionsModal = document.getElementById('gameInstructionsModal');
  if (gameInstructionsModal) {
    gameInstructionsModal.style.display = 'none';
    startTimer(); // Start the timer
    renderNewQuote(); // Display a new quote immediately
  }
}

  // Ensure this event listener is at the end of your script
window.addEventListener('DOMContentLoaded', (event) => {
  // This function will display the game instructions modal on page load
  openGameInstructions();
});
