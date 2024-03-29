document.addEventListener('DOMContentLoaded', (event) => {
    const canvas = document.getElementById('game');
    const context = canvas.getContext('2d');

    const grid = 16;
    let count = 0;
    let isGameOver = false; // track game state
    let scoreUpdateAttempted = false; // Ensure this is declared at the top of your script


    const snake = {
        x: 160,
        y: 160,
        dx: grid,
        dy: 0,
        cells: [],
        maxCells: 1 // Start with the length of the snake as 1 box
    };

    let apple = {
        x: getRandomInt(0, 25) * grid,
        y: getRandomInt(0, 25) * grid
    };

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function gameOver() {
        isGameOver = true; // Set the game over flag to true
        showModal(snake.maxCells - 1); // Adjust score calculation if needed
        updatePlayerScore(snake.maxCells - 1); // Update the player score when the game ends
    }

    function loop() {
        if (isGameOver) return; // Stop the game loop if the game is over
        requestAnimationFrame(loop);

        if (++count < 8) {
            return;
        }
        count = 0;
        context.clearRect(0, 0, canvas.width, canvas.height);

        snake.x += snake.dx;
        snake.y += snake.dy;

        // Check if the snake hits the borders
        if (snake.x < 0 || snake.x >= canvas.width || snake.y < 0 || snake.y >= canvas.height) {
            gameOver();
            return;
        }

        snake.cells.unshift({x: snake.x, y: snake.y});
        if (snake.cells.length > snake.maxCells) {
            snake.cells.pop();
        }

        context.fillStyle = 'red';
        context.fillRect(apple.x, apple.y, grid-1, grid-1);

        context.fillStyle = 'green';
        snake.cells.forEach(function(cell, index) {
            context.fillRect(cell.x, cell.y, grid-1, grid-1);
            // Snake ate apple
            if (cell.x === apple.x && cell.y === apple.y) {
                snake.maxCells++;
                apple = {
                    x: getRandomInt(0, 25) * grid,
                    y: getRandomInt(0, 25) * grid
                };
                updateScore();
                // Removed updatePlayerScore call here
            }
        });
    }
    document.addEventListener('keydown', function(e) {
        // Prevent the default action to stop scrolling when arrow keys are pressed
        if ([37, 38, 39, 40].includes(e.which)) {
            e.preventDefault();
        }

        // Left arrow key pressed
        if (e.which === 37 && snake.dx === 0) {
            snake.dx = -grid;
            snake.dy = 0;
        }
        // Up arrow key pressed
        else if (e.which === 38 && snake.dy === 0) {
            snake.dy = -grid;
            snake.dx = 0;
        }
        // Right arrow key pressed
        else if (e.which === 39 && snake.dx === 0) {
            snake.dx = grid;
            snake.dy = 0;
        }
        // Down arrow key pressed
        else if (e.which === 40 && snake.dy === 0) {
            snake.dy = grid;
            snake.dx = 0;
        }
    });

    function updateScore() {
        document.getElementById('score').textContent = 'Score: ' + (snake.maxCells - 1); // Starting at 1 to adjust for initial length
    }

    function showModal(score) {
        document.getElementById('finalScore').innerHTML = `YOUR FINAL SCORE IS: ${score}`;
        document.getElementById('gameOverModal').style.display = 'block';
    }

    function closeModal() {
        document.getElementById('gameOverModal').style.display = 'none';
        restartGame();
    }

    function restartGame() {
        isGameOver = false;
        snake.x = 160;
        snake.y = 160;
        snake.cells = [];
        snake.maxCells = 1;
        snake.dx = grid;
        snake.dy = 0;
        apple.x = getRandomInt(0, 25) * grid;
        apple.y = getRandomInt(0, 25) * grid;
        updateScore();
        requestAnimationFrame(loop);
    }

    // Attach event listener to the close button within the modal
    document.querySelector('.modal-close-btn').addEventListener('click', closeModal);

    requestAnimationFrame(loop);
    


    // The updatePlayerScore function adapted from your reference code...
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
    
});


// -------------------------------------- SNAKE GAME POP UP INSTRUCTIONS ----------------------------------------------
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