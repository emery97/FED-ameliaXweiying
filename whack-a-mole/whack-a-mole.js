
const cursor = document.querySelector('.cursor');
const holes = [...document.querySelectorAll('.hole')];
const scoreEl = document.querySelector('.score span');
const modal = document.getElementById('gameOverModal');
let score = 0;
const sound = new Audio("whack-a-mole-assets/smash.mp3");
let gameTimer;
let gameActive = false;
let countdown; // keep track of countdown interval
const finalScore = document.querySelector('.modal-body'); // Update this line

function startCountdown(duration) {
    let timer = duration, minutes, seconds;
    countdown = setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        document.getElementById('countdown').textContent = minutes + ":" + seconds;

        if (--timer < 0) {
            clearInterval(countdown);
            showGameOverModal();
        }
    }, 1000);
}
let scoreUpdateAttempted = false; // Flag to track if the score update was already attempted

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

// Modify showGameOverModal to call updatePlayerScore
function showGameOverModal() {
    if (!gameActive) return; // Prevents double invocation if the game is already over

    gameActive = false;
    finalScore.textContent = `YOUR FINAL SCORE IS: ${score}`;
    modal.style.display = 'block';

    // Call updatePlayerScore only if it hasn't been attempted yet
    if (!scoreUpdateAttempted) {
        updatePlayerScore(score);
    }
}
function closeGameOverModal() {
    modal.style.display = 'none'; // Hide the game over modal
}

function startGame() {
    closeGameOverModal();
    score = 0; // Reset score
    scoreEl.textContent = score; // Update score display
    clearTimeout(gameTimer); // Clear any existing game timer
    clearInterval(countdown);
    gameActive = true;
    scoreUpdateAttempted = false; //Reset flag when game starts

    // start the countdown 1min = 60s
    startCountdown(60);
    function run() {
        if (!gameActive) return; // Stop if game is not active

        const i = Math.floor(Math.random() * holes.length);
        const hole = holes[i];
        let timer = null;

        const img = document.createElement('img');
        img.classList.add('mole');
        img.src = 'whack-a-mole-assets/mole.png';

        img.addEventListener('click', () => {
            if (!gameActive) return; // Do nothing if game is not active
            score += 10;
            sound.play();
            scoreEl.textContent = score;
            img.src = 'whack-a-mole-assets/mole-whacked.png';
            clearTimeout(timer);
            setTimeout(() => {
                hole.removeChild(img);
                run();
            }, 500);
        });

        hole.appendChild(img);

        timer = setTimeout(() => {
            hole.removeChild(img);
            run();
        }, 760);
    }

    run();

    // Set a timeout to end the game after 5 minutes
    gameTimer = setTimeout(showGameOverModal, 60000); // 1 minutes in milliseconds = 60000
}

// Make sure to properly handle game restarts and modal closure to avoid re-triggering end game logic
// Remove this part from your current code
document.querySelector('.modal-close-btn').addEventListener('click', () => {
});


window.addEventListener('mousemove', e => {
    cursor.style.top = e.pageY + 'px';
    cursor.style.left = e.pageX + 'px';
});

window.addEventListener('mousedown', () => {
    cursor.classList.add('active');
});

window.addEventListener('mouseup', () => {
    cursor.classList.remove('active');
});




// -------------------------------------- WHACK A MOLE POP UP INSTRUCTIONS ----------------------------------------------
window.addEventListener('DOMContentLoaded', (event) => {
    // Assuming the game instructions modal has a unique ID 'gameInstructionsModal'
    const gameInstructionsModal = document.getElementById('gameInstructionsModal');
    const closeInstructionsButton = document.querySelector('.close-button'); // Make sure this class is unique to the close button of the instructions modal
  
    // Function to open the game instructions modal
    function openGameInstructions() {
      console.log('Trying to open game instructions'); // This should show up in the console
      if (gameInstructionsModal) {
          gameInstructionsModal.style.display = 'block';
      }
    }
  
    // Function to close the game instructions modal
    function closeGameInstructions() {
        const gameInstructionsModal = document.getElementById('gameInstructionsModal');
        if (gameInstructionsModal) {
            gameInstructionsModal.style.display = 'none';
            startGame(); // This starts the game and the countdown timer when the instructions modal is closed.
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

  document.addEventListener('DOMContentLoaded', () => {
    // Test the game instructions modal independently
    openGameInstructions();
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
    function closeGameInstructions() {
        const gameInstructionsModal = document.getElementById('gameInstructionsModal');
        if (gameInstructionsModal) {
            gameInstructionsModal.style.display = 'none';
            startGame(); // Start the game when the instructions are closed
        }
    }

  

