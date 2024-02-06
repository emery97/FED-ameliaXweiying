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
    clearInterval(countdown);
    gameActive = true;

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
        }, 1500);
    }

    run();

    // Set a timeout to end the game after 5 minutes
    gameTimer = setTimeout(showGameOverModal, 60000); // 1 minutes in milliseconds = 60000
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
