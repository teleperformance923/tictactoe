// Gameboard Module
const Gameboard = (function () {
    let board = ["", "", "", "", "", "", "", "", ""];
  
    const getBoard = () => board;
  
    const setCell = (index, marker) => {
      if (board[index] === "") {
        board[index] = marker;
        return true;
      }
      return false;
    };
  
    const resetBoard = () => {
      board = ["", "", "", "", "", "", "", "", ""];
    };
  
    return { getBoard, setCell, resetBoard };
  })();
  
  // Player Factory
  function Player(name, marker) {
    return { name, marker };
  }
  
  // GameController Module
  const GameController = (function () {
    let player1;
    let player2;
    let currentPlayer;
    let isGameOver = false;
  
    const startGame = (name1, name2) => {
      player1 = Player(name1, "X");
      player2 = Player(name2, "O");
      currentPlayer = player1;
      isGameOver = false;
      Gameboard.resetBoard();
      DisplayController.render();
      DisplayController.setMessage(`${currentPlayer.name}'s Turn`);
    };
  
    const playRound = (index) => {
      if (isGameOver) return;
  
      if (Gameboard.setCell(index, currentPlayer.marker)) {
        if (checkWin()) {
          DisplayController.setMessage(`${currentPlayer.name} Wins! 🎉`);
          isGameOver = true;
        } else if (checkTie()) {
          DisplayController.setMessage("It's a Tie! 🤝");
          isGameOver = true;
        } else {
          switchPlayer();
          DisplayController.setMessage(`${currentPlayer.name}'s Turn`);
        }
      }
    };
  
    const switchPlayer = () => {
      currentPlayer = currentPlayer === player1 ? player2 : player1;
    };
  
    const checkWin = () => {
      const b = Gameboard.getBoard();
      const winningCombos = [
        [0,1,2], [3,4,5], [6,7,8], 
        [0,3,6], [1,4,7], [2,5,8], 
        [0,4,8], [2,4,6]
      ];
      return winningCombos.some(combo => 
        combo.every(index => b[index] === currentPlayer.marker)
      );
    };
  
    const checkTie = () => {
      return Gameboard.getBoard().every(cell => cell !== "");
    };
  
    return { playRound, startGame };
  })();
  
  // DisplayController Module
  const DisplayController = (function () {
    const boardDiv = document.getElementById('board');
    const messageDiv = document.getElementById('game-message');
    const startButton = document.getElementById('start-btn');
  
    startButton.addEventListener('click', () => {
      const player1Name = document.getElementById('player1-name').value || "Player 1";
      const player2Name = document.getElementById('player2-name').value || "Player 2";
      GameController.startGame(player1Name, player2Name);
    });
  
    const render = () => {
      boardDiv.innerHTML = "";
      Gameboard.getBoard().forEach((cell, index) => {
        const cellDiv = document.createElement('div');
        cellDiv.classList.add('cell');
        if (cell !== "") {
          cellDiv.classList.add('taken');
        }
        cellDiv.textContent = cell;
        cellDiv.addEventListener('click', () => handleClick(index));
        boardDiv.appendChild(cellDiv);
      });
    };
  
    const handleClick = (index) => {
      GameController.playRound(index);
      render();
    };
  
    const setMessage = (message) => {
      messageDiv.textContent = message;
    };
  
    return { render, setMessage };
  })();
  