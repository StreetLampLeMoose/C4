
import Game from '/game-class';

const game = document.getElementById("gameCanvas");
const errorMessage = document.getElementById("errorMessage");
const createGameButton = document.getElementById("createGame");
const joinGameButton = document.getElementById("joinGame");
const ctx = game.getContext("2d");
const statusMessage = document.getElementById("status");
const numberOfColumns = 7;
const numberOfRows = 6;
const cellWidth = game.width / numberOfColumns;
const cellHeight = game.height / numberOfRows;
let clientPlayer = null;
let clientGameId = null; //will be set when the game is created or joined
const holeRadius = cellHeight / 2 - 5;
//will have to change this so the player can choose the color of their peice and the opponent gets the other color
let playerColor = "#FF0000"; //red
let opponentColor = "#FFFF00"; //yellow

//will have to change this so one player is player 1 and the other is player 2
//this will come from a route served by the server

function gameEventListener(gameObj){
   function clickHandler(event){ //handles the click event on the game canvas
    console.log("Clicked");
    const rect = game.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const column = Math.floor(x / cellWidth);
    takeTurn(column, gameObj);
    game.removeEventListener("click", clickHandler); //remove the event listener after the first click
  }
  game.addEventListener("click", clickHandler); //add event listener to the game canvas
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

async function createGame(){   //creates a new game
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
  const gameCondition = 'waiting'; // 'playing', 'win', or 'draw'
  const currentPlayer = 1; // 1 for player1, 2 for player2
  const player2Name = ''; //player 2 name will be set when the second player joins
  const gameObj = new Game(gameId, player1Name, player2Name, currentPlayer, gameState, gameCondition);
  drawUpdate(gameObj); //draw the initial game state
  try {const res = await fetch('/create-game', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        gameId: gameObj.gameId,
        player1Name: gameObj.player1Name,
        player2Name: gameObj.player2Name,
        currentPlayer: gameObj.currentPlayer,
        gameState: gameObj.gameState,
        gameCondition: gameObj.gameCondition
    })
  });
  if(res.ok) {
    console.log("Game created successfully");
    statusMessage.textContent = `Game created with ID: ${gameObj.gameId}. Waiting for player 2 to join...`;
  }
  } catch(error) {
    console.error("Error creating game:", error);
    errorMessage.textContent = "Error creating game. Please try again.";
    return;
  }
  clientPlayer = 1;
  clientGameId = gameObj.gameId; //set the client game id
  createGameButton.disabled = true; //disable the create game button
  joinGameButton.disabled = true; //disable the join game button
  gameEventListener(gameObj);
  pollGameState(gameObj.gameId); // Start polling for game state updates
}

async function joinGame(){ //joins an existing game
  //reads the game id from input fields
  //send that number to server to join existing game
  //if the game exists, it will return the game object  
  //if not return an error message
  clientPlayer = 2;
  const gameId = document.getElementById("gameId").value;
  if (!gameId) {
    console.log("Please enter a game ID");
    errorMessage.textContent = "Please enter a game ID.";
    return;
  }
  const player2Name = document.getElementById("playerName").value;
  try {
    const res = await fetch('/join-game', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          gameId: gameId,
          player2Name: player2Name
      })
    });
    const gameData = await res.json();
    if (res.ok) {
      console.log("Game joined successfully", gameData);
      const gameObj = new Game(
        gameData.game.gameId,
        gameData.game.player1Name,
        gameData.game.player2Name,
        gameData.game.currentPlayer,
        gameData.game.gameState,
        gameData.game.gameCondition
      );
      clientGameId = gameObj.gameId; //set the client game id
      drawUpdate(gameObj); //draw the initial game state
      statusMessage.textContent = `Joined game ${gameId} as ${player2Name}`;
      gameEventListener(gameObj);
      
    }
    if (!res.ok) {
        errorMessage.textContent = gameData.error ;
        throw new Error(gameData.error);
      }
  }catch(error) {
    console.error("Error joining game:", error);
    return;
  }
  createGameButton.disabled = true; //disable the create game button
  joinGameButton.disabled = true; //disable the join game button
   pollGameState(gameId); // Start polling for game state updates
} 

function drawUpdate(gameObj){ //draws the game state
    for(let i = 0; i< gameObj.gameState.length; i++){
        for(let j = 0; j< gameObj.gameState[i].length; j++){
            ctx.beginPath();
            ctx.arc(
                i * cellWidth + cellWidth / 2,
                j * cellHeight + cellHeight / 2,
                holeRadius,
                0,
                Math.PI * 2
            );
            if(gameObj.gameState[i][j] == 1){
                ctx.fillStyle = playerColor;
            }else if(gameObj.gameState[i][j] == 2){
                ctx.fillStyle = opponentColor;
            }else{
                ctx.fillStyle = "#fff";
            }
            ctx.fill();
            ctx.closePath();
        }
    }
}

async function takeTurn(column ,  gameObj){ //takes the turn of the player, takes the column as input
      for(let i = gameObj.gameState[column].length; i >= 0 ; i--) {
          if(gameObj.gameState[column][i] == 0) {
              gameObj.gameState[column][i] = clientPlayer; 
              gameObj.changePlayer(); 
              console.log(gameObj.gameState);
              drawUpdate(gameObj);
              if (gameObj.checkWin()) {
                  console.log("current player wins");
                  return;
              }
              if (gameObj.checkDraw()) {
                  console.log("Game is a draw");
                  return;
              } 
              try{
                const res = await fetch('/update-game', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                      gameId: gameObj.gameId,
                      gameState: gameObj.gameState,
                      currentPlayer: gameObj.currentPlayer,
                      player1Name: gameObj.player1Name,
                      player2Name: gameObj.player2Name,
                      gameCondition: gameObj.gameCondition
                  })
                });
                if (res.ok) {
                  console.log("Game updated successfully");
                }           
              }catch(error) {
                  console.error("Error updating game:", error);
                  errorMessage.textContent = "Error updating game. Please try again.";
              }
              pollGameState(clientGameId); // Start polling for game state updates
              break;
          }
      }  
}

async function pollGameState(gameId) {
  // Polls the server for the game state every 2 seconds
  try {
    const res = await fetch('/game-state', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body : JSON.stringify({ gameId: gameId })
    });
    if (res.ok) {
      const gameData = await res.json();
      const gameObj = new Game(
        gameData.game.gameId,
        gameData.game.player1Name,
        gameData.game.player2Name,
        gameData.game.currentPlayer,
        gameData.game.gameState,
        gameData.game.gameCondition
      );
      drawUpdate(gameObj);
      if (gameObj.currentPlayer == clientPlayer && gameObj.gameCondition == 'playing') {
        statusMessage.textContent = `It's your turn`;
        gameEventListener(gameObj);
        return;
      } else if(gameObj.currentPlayer !== clientPlayer && gameObj.gameCondition == 'playing') {
        statusMessage.textContent = `It's not your turn`;
      } else if (gameObj.gameCondition == 'waiting' && gameObj.clientPlayer == currentPlayer) {
        statusMessage.textContent = "Take your turn and wait for another player to join...";
        gameEventListener(gameObj);
        return;
      }else if (gameObj.gameCondition !== 'waiting' && gameObj.clientPlayer !== currentPlayer) {
        statusMessage.textContent = `Waiting for other player to join...`;
      }else if (gameObj.gameCondition == 'win') {
        statusMessage.textContent = `Player ${gameObj.winner} wins!`;
        game.removeEventListener("click", clickHandler); //remove the event listener after the game is over
      }
    } 
  } catch (error) {
    console.error("Error polling game state:", error);
  }
  setTimeout(() => pollGameState(gameId), 2000); // Poll every 2 seconds
} //polls the game state from the server
