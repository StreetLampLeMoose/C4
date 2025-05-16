const game = document.getElementById("gameCanvas");
const ctx = game.getContext("2d");


const numberOfColumns = 7;
const numberOfRows = 6;

const cellWidth = game.width / numberOfColumns;
const cellHeight = game.height / numberOfRows;

const holeRadius = cellHeight / 2 - 5;

drawBoard();

function drawBoard() {
  ctx.fillStyle = "#ADD8E6";
  ctx.fillRect(0, 0, game.width, game.height);

  for (let i = 0; i < numberOfColumns; i++) {
    for (let j = 0; j < numberOfRows; j++) {
      ctx.beginPath();
      ctx.arc(
        i * cellWidth + cellWidth / 2,
        j * cellHeight + cellHeight / 2,
        holeRadius,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = "#fff";
      ctx.fill();
      ctx.closePath();
    }
  }
}

let gameState = [   [0, 0, 0, 0, 0, 0, 0], //empty game state
                    [0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0]];

function startGame(){   //starts the game

}


function takeTurn(column){ //takes the turn of the player, takes the column as input
    //checkf if column is full
    //places peice to the lowest available row
    //check for win
    //check for draw
    //pass control back to server for the other player to take their turn
}

function checkWin(){ //checks if the player has won
}

function checkDraw(){ //checks if the game is a draw    
}

function resetGame(){ //resets the game
}