import Game from '/game-class';

const game = document.getElementById("gameCanvas");
const errorMessage = document.getElementById("errorMessage");
const createGameButton = document.getElementById("createGame");
const joinGameButton = document.getElementById("joinGame");
const ctx = game.getContext("2d");

const numberOfColumns = 7;
const numberOfRows = 6;

const cellWidth = game.width / numberOfColumns;
const cellHeight = game.height / numberOfRows;

let isTurn = true; //true for player 1, false for player 2

const holeRadius = cellHeight / 2 - 5;
//will have to change this so the player can choose the color of their peice and the opponent gets the other color
let playerColor = "#FF0000"; //red
let opponentColor = "#FFFF00"; //yellow
//  //playing, win, draw
//will have to change this so one player is player 1 and the other is player 2
//this will come from a route served by the server

function gameEventListener(gameObj){
  game.addEventListener("click", (event) => {
    console.log("Clicked");
    const rect = game.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const column = Math.floor(x / cellWidth);
    takeTurn(column, isTurn, gameObj);
  })
}

createGameButton.addEventListener("click", createGame);
joinGameButton.addEventListener("click", joinGame);


drawBoard();
function drawBoard() { //draws an empty game board
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

function createGame(){   //creates a new game
  //creates a new game object with player 1 name from input fields
  //sends the game object to the server
  const player1Name = document.getElementById("playerName").value;
  if (!player1Name) {
    console.log("Please enter a player name");
    errorMessage.textContent = "Please enter a player name.";
    return;
  }
  const gameId = Math.floor(Math.random() * 10000); //generate a random game id
  let  gameState =           [  [0, 0, 0, 0, 0, 0], //empty game state sub arrays are columns
                                [0, 0, 0, 0, 0, 0],
                                [0, 0, 0, 0, 0, 0],
                                [0, 0, 0, 0, 0, 0],
                                [0, 0, 0, 0, 0, 0],
                                [0, 0, 0, 0, 0, 0],
                                [0, 0, 0, 0, 0, 0]
                          ];
  const gameCondition = 'playing'; // 'playing', 'win', or 'draw'
  const currentPlayer = 1; // 1 for player1, 2 for player2
  const player2Name = ''; //player 2 name will be set when the second player joins
  const gameObj = new Game(gameId, player1Name, player2Name, currentPlayer, gameState, gameCondition);
  drawUpdate(gameObj.gameState)
  gameEventListener(gameObj);
}

function joinGame(){ //joins an existing game
  //reads the game id from input fields
  //send that number to server to join existing game
  //if the game exists, it will return the game object  
  //if not return an error message
  console.log("Joining game...");
  return; //this is a placeholder, will implement later
} 
function drawUpdate(gameState){ //draws the game state
    for(let i = 0; i< gameState.length; i++){
        for(let j = 0; j< gameState[i].length; j++){
            ctx.beginPath();
            ctx.arc(
                i * cellWidth + cellWidth / 2,
                j * cellHeight + cellHeight / 2,
                holeRadius,
                0,
                Math.PI * 2
            );
            if(gameState[i][j] == 1){
                ctx.fillStyle = playerColor;
            }else if(gameState[i][j] == 2){
                ctx.fillStyle = opponentColor;
            }else{
                ctx.fillStyle = "#fff";
            }
            ctx.fill();
            ctx.closePath();
        }
    }
  drawUpdate(gameState);  
}
function takeTurn(column , isTurn, gameObj){ //takes the turn of the player, takes the column as input
    //check if column is full
    //places peice to the lowest available row
    //check for win
    //check for draw
    //pass control back to server for the other player to take their turn
  if(isTurn){
      if(gameObj.gameState[column][0] != 0) {
          errorMessage.textContent = "Column is full, please choose another column.";
          return;
      }
      for(let i = gameState[column].length; i >= 0 ; i--) {
          if(gameObj.gameState[column][i] == 0) {
              gameObj.gameState[column][i] = 1; //1 for player 1
              console.log(gameObj.gameState);
              drawUpdate(gameObj.gameState);
              //isTurn = false;
              if (gameObj.checkWin()) {
                  console.log("current player wins");
                  return;
              }
              if (gameObj.checkDraw()) {
                  console.log("Game is a draw");
                  return;
              } 
              //send gameState to server, or win/draw message
              break;
          }
      }
      
  }else{
      console.log("Not your turn");
      return;
  }
}