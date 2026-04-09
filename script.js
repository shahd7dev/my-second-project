const board = document.getElementById("board");
const statusText = document.getElementById("status");

let cells = ["", "", "", "", "", "", "", "", ""];
let gameActive = true;

const urlParams = new URLSearchParams(window.location.search);
const mode = urlParams.get("mode"); 
const level = urlParams.get("level");

function createBoard() {
  board.innerHTML = "";
  cells.forEach((cell, index) => {
    const div = document.createElement("div");
    div.classList.add("cell");
    div.innerText = cell;
    div.addEventListener("click", () => handleClick(index));
    board.appendChild(div);
  });
}

function handleClick(index) {
  if (cells[index] !== "" || !gameActive) return;

  cells[index] = "X";
  createBoard();
  checkWinner();

  if (mode === "ai" && gameActive) {
    setTimeout(aiMove, 400);
  }
}

function aiMove() {
  let move;

  if (level === "easy") {
    move = randomMove();
  } else if (level === "medium") {
    move = Math.random() < 0.5 ? bestMove() : randomMove();
  } else {
    move = bestMove();
  }

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

  return wins.some(([a,b,c]) =>
    cells[a] === player && cells[b] === player && cells[c] === player
  );
}

function checkWinner() {
  if (checkWin("X")) {
    statusText.innerText = "You Win 🎉";
    gameActive = false;
    return;
  }

  if (checkWin("O")) {
    statusText.innerText = "Computer Wins 🤖";
    gameActive = false;
    return;
  }

  if (!cells.includes("")) {
    statusText.innerText = "Draw!";
    gameActive = false;
  }
}

function resetGame() {
  cells = ["", "", "", "", "", "", "", "", ""];
  gameActive = true;
  statusText.innerText = "Your Turn";
  createBoard();
}

createBoard();
