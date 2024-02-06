const RANDOM_QUOTE_API_URL = 'http://api.quotable.io/random';
const quoteDisplayElement = document.getElementById('quoteDisplay');
const quoteInputElement = document.getElementById('quoteInput');
const timerElement = document.getElementById('timer');
let score = 0;

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
function showModal(score){
  document.querySelector('.modal-body h6').textContent = `YOUR FINAL SCORE IS: ${score}`;
  document.getElementById('gameOverModal').style.display = 'block';
}
function closeModal(){
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
  score+=10;
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

function canPlay() {
  const playCount = parseInt(localStorage.getItem('playCount'), 10);
  return playCount < 10;
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
