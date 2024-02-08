// Get references to various HTML elements
const _question = document.getElementById('question');
const _options = document.querySelector('.quiz-options');
const _checkBtn = document.getElementById('check-answer');
const _playAgainBtn = document.getElementById('play-again');
const _result = document.getElementById('result');
const _correctScore = document.getElementById('correct-score');
const _totalQuestion = document.getElementById('total-question');
const _countdownEl = document.getElementById('countdown');
let score = 0;
const finalScore = document.querySelector('.modal-body'); // Update this line

// Initialize variables related to the quiz
let correctAnswer = "", correctScore = askedCount = 0, totalQuestion = 10;
let time, countdownInterval;
let sessionToken = ''; // Add a variable for the session token
// Existing variables from your provided code
let scoreUpdateAttempted = false; // New variable to keep track of the score update attempt

// Function to start the countdown timer
function startCountdown() {
    const startingMinutes = 1;
    time = startingMinutes * 60;

    updateCountdown();  // Update initially to avoid 1-second delay
    countdownInterval = setInterval(updateCountdown, 1000);
}

// Function to update the countdown timer
function updateCountdown() {
    if (time <= 0) {
        // Only update the score and show the game over modal if the time has actually run out
        clearInterval(countdownInterval);
        if (!scoreUpdateAttempted) {
            updatePlayerScore(correctScore);
        }
        showGameOverModal();
    } else {
        const minutes = Math.floor(time / 60);
        const seconds = (time % 60).toFixed(0).padStart(2, '0');
        _countdownEl.innerHTML = `${minutes}:${seconds}`;
        time--;

        if (time <= 10) {
            _countdownEl.style.color = 'red';
        } else {
            _countdownEl.style.color = '';
        }
    }
}


// Function to display the game over modal
function showGameOverModal() {
    const modal = document.getElementById('gameOverModal');
    modal.style.display = 'block';
    finalScore.innerHTML = `<h6>YOUR FINAL SCORE IS: ${correctScore}</h6>`;
}

// Function to close the game over modal and restart the quiz
function closeGameOverModal() {
    const modal = document.getElementById('gameOverModal');
    modal.style.display = 'none';
    restartQuiz();
}

// Function to fetch a session token
async function fetchSessionToken() {
    const tokenUrl = 'https://opentdb.com/api_token.php?command=request';
    try {
        const response = await fetch(tokenUrl);
        const data = await response.json();
        if (data.response_code === 0) {
            sessionToken = data.token;
        }
    } catch (error) {
        console.error('Error fetching session token:', error);
    }
}

// Asynchronous function to fetch and load a new question from an external API
async function loadQuestion() {
    if (askedCount < totalQuestion) {
        const APIUrl = `https://opentdb.com/api.php?amount=1&category=26&difficulty=medium&type=multiple&token=${sessionToken}`;
        let attempts = 0;
        const maxAttempts = 5; // set a max number of attempts
        while (attempts < maxAttempts) {
            try {
                const result = await fetch(APIUrl);
                const data = await result.json();

                if (data.response_code === 0 && data.results.length > 0) {
                    _result.innerHTML = "";
                    showQuestion(data.results[0]);
                    break; // exit the loop if successful
                } else if (data.response_code === 4) {
                    // Token Not Found error code from OpenTDB API
                    await fetchSessionToken(); // refresh the session token
                    continue; // retry the request with the new token
                } else {
                    console.error('Failed to fetch question from the trivia API. Response Code:', data.response_code);
                    await new Promise(r => setTimeout(r, 5000)); // wait 5 seconds before retrying
                }
            } catch (error) {
                console.error('Error fetching question:', error);
                await new Promise(r => setTimeout(r, 5000)); // wait 5 seconds before retrying
            }
            attempts++;
        }
        if (attempts >= maxAttempts) {
            showGameOverModal(); // show game over modal if max attempts reached
            clearInterval(countdownInterval);
        }
    } else {
        showGameOverModal();
        clearInterval(countdownInterval);
    }
}

// Function to set up event listeners for buttons
function eventListeners() {
    _checkBtn.addEventListener('click', checkAnswer);
    _playAgainBtn.addEventListener('click', closeGameOverModal);
}

// Event listener for the DOMContentLoaded event to initialize the quiz
document.addEventListener('DOMContentLoaded', async function () {
    await fetchSessionToken(); // Fetch session token before starting
    loadQuestion();
    eventListeners();
    _totalQuestion.textContent = totalQuestion;
    _correctScore.textContent = correctScore;
    // startCountdown(); // Remove this line
});


// Function to display a question and its options
function showQuestion(data) {
    _checkBtn.disabled = false;
    correctAnswer = data.correct_answer;
    let incorrectAnswers = data.incorrect_answers;
    let optionsList = incorrectAnswers;
    optionsList.splice(Math.floor(Math.random() * (incorrectAnswers.length + 1)), 0, correctAnswer);

    _question.innerHTML = `${data.question} <br> <span class="category"> ${data.category} </span>`;
    _options.innerHTML = optionsList.map((option, index) => `<li> ${index + 1}. <span>${option}</span> </li>`).join('');
    selectOption();
}

// Function to handle the selection of an option
function selectOption() {
    _options.querySelectorAll('li').forEach(option => {
        option.addEventListener('click', function () {
            if (_options.querySelector('.selected')) {
                const activeOption = _options.querySelector('.selected');
                activeOption.classList.remove('selected');
            }
            option.classList.add('selected');
        });
    });
}

// Function to check the selected answer against the correct answer
// Remove the call to `updatePlayerScore` from the `checkAnswer` function
// because we will now only update the score at the end of the game.
function checkAnswer() {
    _checkBtn.disabled = true;
    if (_options.querySelector('.selected')) {
        let selectedAnswer = _options.querySelector('.selected span').textContent;
        if (selectedAnswer === HTMLDecode(correctAnswer)) {
            correctScore++;
            _result.innerHTML = `<p><i class="fas fa-check"></i>Correct Answer!</p>`;
        } else {
            _result.innerHTML = `<p><i class="fas fa-times"></i>Incorrect Answer!</p> <small><b>Correct Answer: </b>${HTMLDecode(correctAnswer)}</small>`;
        }
        checkCount();
        setTimeout(function () {
            loadQuestion(); // Load the next question after a brief delay
        }, 1000); // Adjust the delay as needed
    } else {
        _result.innerHTML = `<p><i class="fas fa-question"></i>Please select an option!</p>`;
        _checkBtn.disabled = false;
    }
}

// Function to decode HTML entities in a text string
function HTMLDecode(textString) {
    let doc = new DOMParser().parseFromString(textString, "text/html");
    return doc.documentElement.textContent;
}

// Function to update the question count and check if the quiz is complete
function checkCount() {
    askedCount++;
    setCount();
    if (askedCount === totalQuestion) {
        _result.innerHTML += `<p>Your score is ${correctScore}.</p>`;
        _playAgainBtn.style.display = "block";
        _checkBtn.style.display = "none";
    } else {
        setTimeout(function () {
            loadQuestion();
        }, 300);
    }
}

// Function to update the displayed question count and score
function setCount() {
    _totalQuestion.textContent = totalQuestion;
    _correctScore.textContent = correctScore;
}
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
            const currentScore = userData["user-points"] || 0;
            const updatedScore = currentScore + newScore;
            const updatedUserData = {
                ...userData,
                "user-points": updatedScore
            };

            const urlPut = `https://fedpairassgn-14ba.restdb.io/rest/customer/${userId}`; // Use correct URL for PUT request
            const settingsPut = {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "x-apikey": "65b334a346893806b17bde81",
                    "Cache-Control": "no-cache"
                },
                body: JSON.stringify(updatedUserData)
            };

            return fetch(urlPut, settingsPut);
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
            scoreUpdateAttempted = true; // Set the flag after a successful score update
        })
        .catch(error => {
            console.error('Error updating score:', error);
            alert('There was an error adding your score.');
        });
}

// Function to restart the quiz
function restartQuiz() {
    correctScore = askedCount = 0;
    _playAgainBtn.style.display = "none";
    _checkBtn.style.display = "block";
    _checkBtn.disabled = false;
    setCount();
    startCountdown(); // Restart the countdown
    loadQuestion(); // Load the first question again
}


// -------------------------------------- TRIVIA QUIZ POP UP INSTRUCTIONS ----------------------------------------------
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
        startCountdown(); // Start the countdown timer when the instructions are closed
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