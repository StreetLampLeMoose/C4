const game = document.getElementById("gameCanvas");
const ctx = game.getContext("2d");

const numberOfColumns = 7;
const numberOfRows = 6;

const cellWidth = game.width / numberOfColumns;
const cellHeight = game.height / numberOfRows;

let isTurn = true; //true for player 1, false for player 2

const holeRadius = cellHeight / 2 - 5;

game.addEventListener("click", (event) => {
  console.log("Clicked");
  const rect = game.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const column = Math.floor(x / cellWidth);
  takeTurn(column);
})

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

let gameState = [   [0, 0, 0, 0, 0, 0], //empty game state sub arrays are columns
                    [0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0]
                  ];

function startGame(){   //starts the game

}

function drawUpdate(gameState){ //draws the game state

}
function takeTurn(column , isTurn){ //takes the turn of the player, takes the column as input
    //checkf if column is full
    //places peice to the lowest available row
    //check for win
    //check for draw
    //pass control back to server for the other player to take their turn
  if(isTurn == true){
      if(gameState[column][0] != 0) {
          console.log("Column is full");
          return;
      }
      for(let i = gameState[column].length; i >= 0 ; i--) {
          if(gameState[column][i] == 0) {
              gameState[column][i] = 1; //1 for player 1
              console.log(gameState);
              break;
          }
      }
  }else{
      console.log("Not your turn");
      return;
  }
}

function checkWin(){ //checks if the player has won
}

function checkDraw(){ //checks if the game is a draw    
}

function resetGame(){ //resets the game
}