const cursor = document.querySelector('.cursor');
const holes = [...document.querySelectorAll('.hole')];
const scoreEl = document.querySelector('.score span');
const modal = document.getElementById('gameOverModal');
let score = 0;
const sound = new Audio("whack-a-mole-assets/smash.mp3");
let gameTimer;
let gameActive = false;

const finalScore = document.querySelector('.modal-body'); // Update this line

// CURSOR 
document.addEventListener('DOMContentLoaded', function () {
    const cursor = document.querySelector('.cursor');
    const modal = document.querySelector('.modal');

    modal.addEventListener('mouseenter', function () {
        cursor.classList.add('inside-modal');
    });

    modal.addEventListener('mouseleave', function () {
        cursor.classList.remove('inside-modal');
    });
});


function showGameOverModal() {
    gameActive = false;
    finalScore.textContent = `Your score is ${score}`; // Update the final score text
    modal.style.display = 'block'; // Show the game over modal
}

function closeGameOverModal() {
    modal.style.display = 'none'; // Hide the game over modal
}

function startGame() {
    closeGameOverModal();
    score = 0; // Reset score
    scoreEl.textContent = score; // Update score display
    clearTimeout(gameTimer); // Clear any existing game timer
    gameActive = true;

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
        }, 1500);
    }

    run();

    // Set a timeout to end the game after 5 minutes
    gameTimer = setTimeout(showGameOverModal, 3000); // 1 minutes in milliseconds = 60000
}

// Event listener for the close button on the modal
document.querySelector('.modal-close-btn').addEventListener('click', () => {
    startGame(); // Restart the game when the modal is closed
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

// Initialize the game
startGame();