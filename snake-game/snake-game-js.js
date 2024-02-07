document.addEventListener('DOMContentLoaded', (event) => {
    const canvas = document.getElementById('game');
    const context = canvas.getContext('2d');

    const grid = 16;
    let count = 0;
    let isGameOver = false; // track game state

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
    }
    function loop() {
        if (isGameOver) return; // Stop the game loop if the game is over
        requestAnimationFrame(loop);

        if (++count < 4) {
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
});
