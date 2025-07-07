// ✅ Sound effects
const clickSound = new Audio("sounds/click.mp3");
const winSound = new Audio("sounds/win.mp3");
const drawSound = new Audio("sounds/draw.mp3");

// ✅ Elements
const cells = document.querySelectorAll("[data-cell]");
const winningMessage = document.getElementById("winningMessage");
const messageText = document.getElementById("messageText");
const restartBtn = document.getElementById("restartBtn");

let board = ["", "", "", "", "", "", "", "", ""];
let isPlayerTurn = true;

const HUMAN = "X";
const AI = "O";

// ✅ Score
let playerScore = 0;
let computerScore = 0;
let drawScore = 0;

const WINNING_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

// Start game
startGame();

function startGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  isPlayerTurn = true;

  cells.forEach((cell, index) => {
    cell.innerText = "";
    cell.classList.remove("x", "o");
    cell.addEventListener("click", () => handleClick(index), { once: true });
  });

  winningMessage.style.display = "none";
}

function handleClick(index) {
  if (!isPlayerTurn || board[index] !== "") return;

  clickSound.play();
  makeMove(index, HUMAN);
  if (checkWin(HUMAN)) return endGame("You Win!");
  if (isDraw()) return endGame("Draw!");

  isPlayerTurn = false;

  setTimeout(() => {
    const aiMove = getBestMove();
    makeMove(aiMove, AI);
    if (checkWin(AI)) return endGame("Computer Wins!");
    if (isDraw()) return endGame("Draw!");
    isPlayerTurn = true;
  }, 400);
}

function makeMove(index, player) {
  board[index] = player;
  cells[index].innerText = player;
  cells[index].classList.add(player === HUMAN ? "x" : "o");
}

function checkWin(player) {
  return WINNING_COMBINATIONS.some(comb =>
    comb.every(index => board[index] === player)
  );
}

function isDraw() {
  return board.every(cell => cell !== "");
}

function endGame(message) {
  messageText.innerText = message;
  winningMessage.style.display = "block";

  if (message === "You Win!") {
    winSound.play();
    playerScore++;
  } else if (message === "Computer Wins!") {
    winSound.play();
    computerScore++;
  } else if (message === "Draw!") {
    drawSound.play();
    drawScore++;
  }

  document.getElementById("playerScore").innerText = playerScore;
  document.getElementById("computerScore").innerText = computerScore;
  document.getElementById("drawScore").innerText = drawScore;
}

restartBtn.addEventListener("click", startGame);

// ✅ Minimax AI
function getBestMove() {
  let bestScore = -Infinity;
  let move;

  board.forEach((cell, index) => {
    if (cell === "") {
      board[index] = AI;
      let score = minimax(board, 0, false);
      board[index] = "";
      if (score > bestScore) {
        bestScore = score;
        move = index;
      }
    }
  });

  return move;
}

function minimax(newBoard, depth, isMaximizing) {
  if (checkWin(HUMAN)) return -10 + depth;
  if (checkWin(AI)) return 10 - depth;
  if (isDraw()) return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    newBoard.forEach((cell, index) => {
      if (cell === "") {
        newBoard[index] = AI;
        let score = minimax(newBoard, depth + 1, false);
        newBoard[index] = "";
        bestScore = Math.max(score, bestScore);
      }
    });
    return bestScore;
  } else {
    let bestScore = Infinity;
    newBoard.forEach((cell, index) => {
      if (cell === "") {
        newBoard[index] = HUMAN;
        let score = minimax(newBoard, depth + 1, true);
        newBoard[index] = "";
        bestScore = Math.min(score, bestScore);
      }
    });
    return bestScore;
  }
}
