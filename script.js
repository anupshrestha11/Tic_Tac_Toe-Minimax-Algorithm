let BOARD = ["", "", "", "", "", "", "", "", ""];

const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const classes = ["x", "o"];

const player = ["human", "bot"];

let humanTurn = true;
let currentPlayer;
let currentClass;
let result;

const boardElement = document.getElementById("board");

const displayTurn = document.getElementById("displayTurn");

const cellElements = document.querySelectorAll(".cell");

const messageElement = document.getElementById("message");

const messageTextElement = document.getElementById("messageText");

const btnRestart = document.getElementById("btnRestart");

const humanScore = document.getElementById("humanScore");
const botScore = document.getElementById("botScore");
const drawScore = document.getElementById("drawScore");

humanScore.textContent = 0;
botScore.textContent = 0;
drawScore.textContent = 0;

document.onload = startGame();

function startGame() {
  result = "";
  currentPlayer = "";
  currentClass = classes[0];
  boardElement.classList.add(currentClass);
  runGame();
}

btnRestart.addEventListener("click", restart);

function restart() {
  messageElement.classList.remove("show");
  cellElements.forEach((cell) => {
    cell.classList.remove("x");
    cell.classList.remove("o");
  });
  boardElement.classList.remove("x");
  boardElement.classList.remove("o");
  result = "";
  BOARD = ["", "", "", "", "", "", "", "", ""];
  startGame();
}

function runGame() {
  if (gameResult()) {
    messageElement.classList.add("show");
    if (result === "Tie") {
      drawScore.textContent++;
      messageTextElement.innerText = `${result}`;
    } else {
      if (result.localeCompare("Bot") === 0) {
        botScore.textContent++;
      } else {
        humanScore.textContent++;
      }

      messageTextElement.innerText = `${result} Wins`;
    }
  } else {
    if (humanTurn) {
      displayTurn.innerText = "Human Turn";
      currentPlayer = player[0];
      humanPlay();
    } else {
      displayTurn.innerText = "Bot Turn";
      currentPlayer = player[1];
      setTimeout(botPlay, 100);
      // botPlay();
    }
  }
}

function swapTurn() {
  humanTurn = !humanTurn;
  if (currentClass === classes[0]) {
    boardElement.classList.remove(classes[0]);
    boardElement.classList.add(classes[1]);
    currentClass = classes[1];
  } else {
    boardElement.classList.remove(classes[1]);
    boardElement.classList.add(classes[0]);
    currentClass = classes[0];
  }
  if (currentPlayer === "human") {
    currentPlayer = "bot";
  } else {
    currentPlayer = "human";
  }
}

function gameResult() {
  result = checkWinner();
  if (result === "") {
    return false;
  } else {
    return true;
  }
}
function checkWinner() {
  let winner = "";
  // ? check game result and return result
  WINNING_COMBINATIONS.forEach((combination) => {
    if (
      BOARD[combination[0]] === "human" &&
      BOARD[combination[1]] === "human" &&
      BOARD[combination[2]] === "human"
    ) {
      winner = "Player";
    } else if (
      BOARD[combination[0]] === "bot" &&
      BOARD[combination[1]] === "bot" &&
      BOARD[combination[2]] === "bot"
    ) {
      winner = "Bot";
    }
  });
  if (winner === "") {
    let value = 0;
    BOARD.forEach((item) => {
      if (!(item === "")) {
        value += 1;
      }
    });
    if (value === 9) {
      winner = "Tie";
    } else {
      winner = "";
    }
  }
  return winner;
}
function humanPlay() {
  // ? gameplay of human
  cellElements.forEach((cell) => {
    cell.addEventListener("click", handleClick, false);
  });
}

function handleClick(e) {
  console.log(BOARD[e.target.id - 1].localeCompare("bot"));
  if (
    BOARD[e.target.id - 1].localeCompare("bot") === 0 ||
    BOARD[e.target.id - 1].localeCompare("human") === 0
  ) {
    humanPlay();
  } else {
    if (currentPlayer === "human") {
      e.target.classList.add(currentClass);
      let id = e.target.id;
      BOARD[id - 1] = "human";
      swapTurn();
      runGame();
    }
  }
}

function botPlay() {
  // ? gameplay of bot
  let move = botMove();
  cellElements[move].classList.add(currentClass);
  BOARD[move] = "bot";
  swapTurn();
  runGame();
}

function botMove() {
  let move = 0;

  move = bestMove();
  return move;
}

function bestMove() {
  let bestScore = -99999999;
  let move;

  let score;
  for (let i = 0; i < BOARD.length; i++) {
    if (BOARD[i] === "") {
      BOARD[i] = "bot";
      score = minimax(BOARD, false);
      BOARD[i] = "";
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  return move;
}

let scores = {
  Player: -1,
  Bot: 1,
  Tie: 0,
};

function minimax(newBoard, isMaximizing) {
  let scores = {
    Player: -10,
    Bot: 10,
    Tie: 0,
  };
  let newResult = checkWinner();
  if (newResult !== "") {
    return scores[newResult];
  } else {
    if (isMaximizing) {
      let bestScore = -9999999;
      let score;
      for (let i = 0; i < newBoard.length; i++) {
        if (newBoard[i] === "") {
          newBoard[i] = "bot";
          score = minimax(newBoard, false);

          newBoard[i] = "";
          if (score > bestScore) {
            bestScore = score;
          }
        }
      }
      return bestScore;
    } else {
      let bestScore = 9999999;
      let score;
      for (let i = 0; i < newBoard.length; i++) {
        if (newBoard[i] === "") {
          newBoard[i] = "human";
          score = minimax(newBoard, true);

          newBoard[i] = "";
          if (score < bestScore) {
            bestScore = score;
          }
        }
      }
      return bestScore;
    }
  }
}
