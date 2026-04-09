const board = document.getElementById("board");
const statusText = document.getElementById("status");

let currentPlayer = "X";
let cells = ["", "", "", "", "", "", "", "", ""];
let gameActive = true;

function createBoard() {
  board.innerHTML = "";
  cells.forEach((cell, index) => {
    const div = document.createElement("div");
    div.classList.add("cell");
    div.addEventListener("click", () => handleClick(index));
    div.textContent = cell;
    board.appendChild(div);
  });
}

function handleClick(index) {
  if (cells[index] !== "" || !gameActive) return;

  cells[index] = currentPlayer;
  checkWinner();
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  statusText.textContent = "Turn: " + currentPlayer;

  createBoard();
}

function checkWinner() {
  const wins = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  for (let combo of wins) {
    const [a,b,c] = combo;
    if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
      statusText.textContent = cells[a] + " Wins!";
      gameActive = false;
      return;
    }
  }

  if (!cells.includes("")) {
    statusText.textContent = "Draw!";
    gameActive = false;
  }
}

function resetGame() {
  cells = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "X";
  gameActive = true;
  statusText.textContent = "Your Turn (X)";
  createBoard();
}

createBoard();
