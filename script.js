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

  if (!gameActive) return;

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
    createBoard();

    if (checkWinner()) return;

    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusText.innerText = "Turn: " + currentPlayer;
    return;
  }

  cells[index] = "X";
  createBoard();

  if (checkWinner()) return;

  if (mode === "ai" && gameActive) {
    statusText.innerText = "Computer Thinking...";
    setTimeout(aiMove, 400);
  }
}

function aiMove() {
  if (!gameActive) return;

  let move;

  if (level === "easy") {
    move = randomMove();
  } else if (level === "medium") {
    move = Math.random() < 0.5 ? bestMove() : randomMove();
  } else {
    move = bestMove();
  }

  if (move === null || move === undefined) return;

  cells[move] = "O";
  createBoard();
  checkWinner();
}

function randomMove() {
  let empty = cells
    .map((value, index) => (value === "" ? index : null))
    .filter(value => value !== null);

  if (empty.length === 0) return null;

  return empty[Math.floor(Math.random() * empty.length)];
}

function bestMove() {
  for (let i = 0; i < 9; i++) {
    if (cells[i] === "") {
      cells[i] = "O";
      const win = isWinning("O");
      cells[i] = "";
      if (win) return i;
    }
  }

  for (let i = 0; i < 9; i++) {
    if (cells[i] === "") {
      cells[i] = "X";
      const win = isWinning("X");
      cells[i] = "";
      if (win) return i;
    }
  }

  if (cells[4] === "") return 4;

  const corners = [0, 2, 6, 8].filter(i => cells[i] === "");
  if (corners.length > 0) {
    return corners[Math.floor(Math.random() * corners.length)];
  }

  return randomMove();
}

function isWinning(player) {
  const wins = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  return wins.some(([a, b, c]) => {
    return cells[a] === player && cells[b] === player && cells[c] === player;
  });
}

function checkWinner() {
  const wins = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (let combo of wins) {
    const [a, b, c] = combo;

    if (cells[a] !== "" && cells[a] === cells[b] && cells[a] === cells[c]) {
      highlightWin(combo);

      if (cells[a] === "X") {
        scoreX++;
        document.getElementById("scoreX").innerText = scoreX;
      } else {
        scoreO++;
        document.getElementById("scoreO").innerText = scoreO;
      }

      statusText.innerText = cells[a] + " Wins 🎉";
      gameActive = false;
      return true;
    }
  }

  if (!cells.includes("")) {
    statusText.innerText = "Draw!";
    gameActive = false;
    return true;
  }

  return false;
}

function highlightWin(combo) {
  const cellsDiv = document.querySelectorAll(".cell");
  combo.forEach(i => {
    cellsDiv[i].classList.add("win");
  });
}

function resetGame() {
  cells = ["", "", "", "", "", "", "", "", ""];
  gameActive = true;
  currentPlayer = "X";
  createBoard();

  if (mode === "solo") {
    statusText.innerText = "Turn: X";
  } else {
    statusText.innerText = "Your Turn (X)";
  }
}

createBoard();
