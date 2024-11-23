let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameMode = ""; 
let isGameActive = false;

const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

const boardElement = document.getElementById("board");
const statusText = document.getElementById("statusText");
const resetButton = document.getElementById("reset");

function initGame() {
    boardElement.innerHTML = "";
    board = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    isGameActive = true;
    statusText.textContent = `Játékos ${currentPlayer} következik.`;

    for (let i = 0; i < 9; i++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.index = i;
        cell.addEventListener("click", onCellClick);
        boardElement.appendChild(cell);
    }
}

function onCellClick(event) {
    const cell = event.target;
    const index = cell.dataset.index;

    if (board[index] || !isGameActive) return;

    board[index] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.classList.add("taken");

    if (checkWin(currentPlayer)) {
        statusText.textContent = `Játékos ${currentPlayer} nyert!`;
        isGameActive = false;
        return;
    }

    if (board.every(cell => cell)) {
        statusText.textContent = "Döntetlen!";
        isGameActive = false;
        return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusText.textContent = `Játékos ${currentPlayer} következik.`;

    if (gameMode === "vsComputer" && currentPlayer === "O") {
        computerMove();
    }
}

function computerMove() {
    const bestMove = findBestMove();
    board[bestMove] = "O";
    document.querySelector(`.cell[data-index='${bestMove}']`).textContent = "O";
    document.querySelector(`.cell[data-index='${bestMove}']`).classList.add("taken");

    if (checkWin("O")) {
        statusText.textContent = "A számítógép nyert!";
        isGameActive = false;
        return;
    }

    if (board.every(cell => cell)) {
        statusText.textContent = "Döntetlen!";
        isGameActive = false;
        return;
    }

    currentPlayer = "X";
    statusText.textContent = `Játékos ${currentPlayer} következik.`;
}

function findBestMove() {
    let bestScore = -Infinity;
    let move;

    for (let i = 0; i < board.length; i++) {
        if (!board[i]) {
            board[i] = "O";
            let score = minimax(board, 0, false);
            board[i] = "";
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    return move;
}

function minimax(board, depth, isMaximizing) {
    if (checkWin("O")) return 10 - depth;
    if (checkWin("X")) return depth - 10;
    if (board.every(cell => cell)) return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (!board[i]) {
                board[i] = "O";
                let score = minimax(board, depth + 1, false);
                board[i] = "";
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (!board[i]) {
                board[i] = "X";
                let score = minimax(board, depth + 1, true);
                board[i] = "";
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function checkWin(player) {
    return winningCombinations.some(combination =>
        combination.every(index => board[index] === player)
    );
}

document.getElementById("twoPlayers").addEventListener("click", () => {
    gameMode = "twoPlayers";
    initGame();
});

document.getElementById("vsComputer").addEventListener("click", () => {
    gameMode = "vsComputer";
    initGame();
});

resetButton.addEventListener("click", initGame);

const twoPlayersButton = document.getElementById("twoPlayers");
const vsComputerButton = document.getElementById("vsComputer");

function setActiveButton(button) {
    twoPlayersButton.classList.remove("active");
    vsComputerButton.classList.remove("active");
    button.classList.add("active");
}

twoPlayersButton.addEventListener("click", () => {
    gameMode = "twoPlayers";
    setActiveButton(twoPlayersButton);
    initGame();
});

vsComputerButton.addEventListener("click", () => {
    gameMode = "vsComputer";
    setActiveButton(vsComputerButton);
    initGame();
});