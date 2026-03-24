const GRID_SIZE = 16;
let scores = {
    player: 0,
    bot1: 0,
    bot2: 0
};

let activeBoxId = null;
let gameActive = false;
let roundTimeout = null;
let bot1Timer = null;
let bot2Timer = null;

// DOM Elements
const gridContainer = document.getElementById('game-grid');
const startScreen = document.getElementById('start-screen');
const startBtn = document.getElementById('start-btn');
const scorePlayerEl = document.getElementById('score-player');
const scoreBot1El = document.getElementById('score-bot1');
const scoreBot2El = document.getElementById('score-bot2');

// Initialize Grid
function createGrid() {
    gridContainer.innerHTML = '';
    for (let i = 0; i < GRID_SIZE; i++) {
        const box = document.createElement('div');
        box.classList.add('box');
        box.dataset.id = i;
        box.addEventListener('click', () => handlePlayerClick(i));
        gridContainer.appendChild(box);
    }
}

function updateScoreUI() {
    scorePlayerEl.textContent = scores.player;
    scoreBot1El.textContent = scores.bot1;
    scoreBot2El.textContent = scores.bot2;
    
    // Slight animation effect when score updates
    const animateScorecard = (el) => {
        el.parentElement.style.transform = 'scale(1.1)';
        setTimeout(() => el.parentElement.style.transform = 'scale(1)', 200);
    };
    
    // We would need previous state to selectively animate, but this is simple enough.
}

function clearAllTimers() {
    clearTimeout(roundTimeout);
    clearTimeout(bot1Timer);
    clearTimeout(bot2Timer);
}

function resetGame() {
    scores = { player: 0, bot1: 0, bot2: 0 };
    updateScoreUI();
    clearAllTimers();
    document.querySelectorAll('.box').forEach(b => {
        b.className = 'box'; // Reset classes
    });
}

function startGame() {
    startScreen.classList.add('hidden');
    resetGame();
    createGrid();
    gameActive = true;
    
    // Start first round after a brief pause
    setTimeout(startRound, 800);
}

function startRound() {
    if (!gameActive) return;
    clearAllTimers();

    // Reset old boxes visually
    document.querySelectorAll('.box').forEach(b => {
        b.className = 'box';
    });

    // Pick new box
    let newBoxId;
    do {
        newBoxId = Math.floor(Math.random() * GRID_SIZE);
    } while (newBoxId === activeBoxId);
    
    activeBoxId = newBoxId;
    const targetBox = document.querySelector(`.box[data-id="${activeBoxId}"]`);
    if(targetBox) targetBox.classList.add('active');

    // Bot Random Reaction Times
    // Bot 1 generally takes 450 - 750ms
    const bot1Delay = Math.floor(Math.random() * 300) + 450;
    // Bot 2 generally takes 400 - 850ms
    const bot2Delay = Math.floor(Math.random() * 450) + 400;

    bot1Timer = setTimeout(() => handleBotClick('bot1'), bot1Delay);
    bot2Timer = setTimeout(() => handleBotClick('bot2'), bot2Delay);
}

function processWin(winner, box) {
    if (!gameActive || activeBoxId === null) return;
    
    clearAllTimers();
    activeBoxId = null; // Prevent secondary clicks
    scores[winner]++;
    updateScoreUI();

    box.classList.remove('active');
    box.classList.add(`claimed-${winner}`);

    // Schedule next round
    roundTimeout = setTimeout(startRound, 1000);
}

function handlePlayerClick(id) {
    if (!gameActive || activeBoxId === null) return;
    if (id !== activeBoxId) return; // Ignore wrong clicks

    const box = document.querySelector(`.box[data-id="${id}"]`);
    processWin('player', box);
}

function handleBotClick(botId) {
    if (!gameActive || activeBoxId === null) return;
    
    const box = document.querySelector(`.box[data-id="${activeBoxId}"]`);
    if(box) {
        processWin(botId, box);
    }
}

// Event Listeners
startBtn.addEventListener('click', startGame);

// Init empty grid visually
createGrid();
