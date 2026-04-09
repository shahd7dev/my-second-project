let currentPlayer = "X";

const board = document.getElementById("board");
const statusText = document.getElementById("status");

let cells = ["", "", "", "", "", "", "", "", ""];
let gameActive = true;

let scoreX = 0;
let scoreO = 0;

const urlParams = new URLSearchParams(window.location.search);
const mode = urlParams.get("mode"); 
const level = urlParams.get("level");

const clickSound = new Audio("https://www.soundjay.com/button/beep-07.wav");

function createBoard() {
  board.innerHTML = "";
  cells.forEach((cell, index) => {
    const div = document.createElement("div");
    div.classList.add("cell");

    if (cell === "X") div.classList.add("x");
    if (cell === "O") div.classList.add("o");

    div.innerText = cell;
    div.addEventListener("click", () => handleClick(index));
    board.appendChild(div);
  });

  if (mode === "solo") {
    statusText.innerText = "Turn: " + currentPlayer;
  } else {
    statusText.innerText = "Your Turn (X)";
  }
}

function handleClick(index) {
  if (cells[index] !== "" || !gameActive) return;

  clickSound.play();

  if (mode === "solo") {
    cells[index] = currentPlayer;
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    createBoard();
    checkWinner();
    return;
  }

  cells[index] = "X";
  createBoard();
  checkWinner();

  if (mode === "ai" && gameActive) {
    setTimeout(aiMove, 400);
  }
}

function aiMove() {
  let move;

  if (level === "easy") move = randomMove();
  else if (level === "medium") move = Math.random() < 0.5 ? bestMove() : randomMove();
  else move = bestMove();

  cells[move] = "O";
  createBoard();
  checkWinner();
}

function randomMove() {
  let empty = cells.map((v, i) => v === "" ? i : null).filter(v => v !== null);
  return empty[Math.floor(Math.random() * empty.length)];
}

function bestMove() {
  for (let i = 0; i < 9; i++) {
    if (cells[i] === "") {
      cells[i] = "O";
      if (checkWin("O")) {
        cells[i] = "";
        return i;
      }
      cells[i] = "";
    }
  }

  for (let i = 0; i < 9; i++) {
    if (cells[i] === "") {
      cells[i] = "X";
      if (checkWin("X")) {
        cells[i] = "";
        return i;
      }
      cells[i] = "";
    }
  }

  return randomMove();
}

function checkWin(player) {
  const wins = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  for (let combo of wins) {
    let [a,b,c] = combo;
    if (cells[a] === player && cells[b] === player && cells[c] === player) {
      highlightWin(combo);

      if (player === "X") {
        scoreX++;
        document.getElementById("scoreX").innerText = scoreX;
      } else {
        scoreO++;
        document.getElementById("scoreO").innerText = scoreO;
      }

      statusText.innerText = player + " Wins 🎉";
      gameActive = false;
      return true;
    }
  }
  return false;
}

function highlightWin(combo) {
  const cellsDiv = document.querySelectorAll(".cell");
  combo.forEach(i => {
    cellsDiv[i].classList.add("win");
  });
}

function checkWinner() {
  if (checkWin("X")) return;
  if (checkWin("O")) return;

  if (!cells.includes("")) {
    statusText.innerText = "Draw!";
    gameActive = false;
  }
}

function resetGame() {
  cells = ["", "", "", "", "", "", "", "", ""];
  gameActive = true;
  currentPlayer = "X";
  createBoard();
  statusText.innerText = "New Game";
}

createBoard();
