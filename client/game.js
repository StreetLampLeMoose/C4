
import Game from '/game-class';
let currentGameObj = null;
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
let clickHandler = null;
//will have to change this so one player is player 1 and the other is player 2
//this will come from a route served by the server

clickHandler = function(event) {
  console.log("Clicked");
  const rect = game.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const column = Math.floor(x / cellWidth);
  takeTurn(column, currentGameObj);
  game.removeEventListener("click", clickHandler);
  //clickHandler = null;
};

function gameEventListener(){
  game.removeEventListener("click", clickHandler)
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
  const currentPlayer = 1;
  clientPlayer = 1; // 1 for player1, 2 for player2
  const player2Name = ''; //player 2 name will be set when the second player joins
  currentGameObj = new Game(gameId, player1Name, player2Name, currentPlayer, gameState, gameCondition);
  drawUpdate(currentGameObj); //draw the initial game state
  try {const res = await fetch('/create-game', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        gameId: currentGameObj.gameId,
        player1Name: currentGameObj.player1Name,
        player2Name: currentGameObj.player2Name,
        currentPlayer: currentGameObj.currentPlayer,
        gameState: currentGameObj.gameState,
        gameCondition: currentGameObj.gameCondition
    })
  });
  if(res.ok) {
    console.log("Game created successfully");
    statusMessage.textContent = `Game created with ID: ${currentGameObj.gameId}. Waiting for player 2 to join...`;
  }
  } catch(error) {
    console.error("Error creating game:", error);
    errorMessage.textContent = "Error creating game. Please try again.";
    return;
  }
  clientPlayer = 1;
  clientGameId = currentGameObj.gameId; //set the client game id
  createGameButton.disabled = true; //disable the create game button
  joinGameButton.disabled = true; //disable the join game button
  gameEventListener();
  pollGameState(); // Start polling for game state updates
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
        currentGameObj = new Game(
        gameData.game.gameId,
        gameData.game.player1Name,
        gameData.game.player2Name,
        gameData.game.currentPlayer,
        gameData.game.gameState,
        gameData.game.gameCondition
      );
      clientGameId = currentGameObj.gameId; //set the client game id
      drawUpdate(currentGameObj); //draw the initial game state
      statusMessage.textContent = `Joined game ${gameId} as ${player2Name}`;
      gameEventListener();
      
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
  pollGameState(); // Start polling for game state updates
} 

function drawUpdate(currentGameObj){ //draws the game state
    for(let i = 0; i< currentGameObj.gameState.length; i++){
        for(let j = 0; j< currentGameObj.gameState[i].length; j++){
            ctx.beginPath();
            ctx.arc(
                i * cellWidth + cellWidth / 2,
                j * cellHeight + cellHeight / 2,
                holeRadius,
                0,
                Math.PI * 2
            );
            if(currentGameObj.gameState[i][j] == 1){
                ctx.fillStyle = playerColor;
            }else if(currentGameObj.gameState[i][j] == 2){
                ctx.fillStyle = opponentColor;
            }else{
                ctx.fillStyle = "#fff";
            }
            ctx.fill();
            ctx.closePath();
        }
    }
}

async function takeTurn(column ,  currentGameObj){ //takes the turn of the player, takes the column as input
      for(let i = currentGameObj.gameState[column].length; i >= 0 ; i--) {
          if(currentGameObj.gameState[column][i] == 0) {
              currentGameObj.gameState[column][i] = clientPlayer; 
              currentGameObj.changePlayer(); 
              console.log(currentGameObj.gameState);
              drawUpdate(currentGameObj);
              try{
                const res = await fetch('/update-game', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                      gameId: currentGameObj.gameId,
                      gameState: currentGameObj.gameState,
                      currentPlayer: currentGameObj.currentPlayer,
                      player1Name: currentGameObj.player1Name,
                      player2Name: currentGameObj.player2Name,
                      gameCondition: currentGameObj.gameCondition
                  })
                });
                if (res.ok) {
                  console.log("Game updated successfully");
                }           
              }catch(error) {
                  console.error("Error updating game:", error);
                  errorMessage.textContent = "Error updating game. Please try again.";
              }
              console.log(currentGameObj);
              pollGameState(); // Start polling for game state updates
              break;
          }
      }  
}

async function pollGameState() {
  // Polls the server for the game state every 2 seconds
  try {
    const res = await fetch('/game-state', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body : JSON.stringify({ gameId: clientGameId })
    });
    if (res.ok) {
      const gameData = await res.json();
      currentGameObj.player1Name = gameData.game.player1Name;
      currentGameObj.player2Name = gameData.game.player2Name;
      currentGameObj.currentPlayer = gameData.game.currentPlayer;
      currentGameObj.gameCondition = gameData.game.gameCondition;
      currentGameObj.gameState = gameData.game.gameState;
      currentGameObj.winner = gameData.game.winner; 
      drawUpdate(currentGameObj);
      if(currentGameObj.gameCondition == 'waiting'){
        statusMessage.textContent = `Game created with ID: ${currentGameObj.gameId}. Waiting for player 2 to join...`;
      }else if(currentGameObj.gameCondition == 'playing'){
        if (currentGameObj.currentPlayer == clientPlayer) {
          statusMessage.textContent = `It's your turn`;
          gameEventListener();
          return;
        } else {
          statusMessage.textContent = `It's not your turn`;
        }
      }else if(currentGameObj.gameCondition == 'win'){
        if(currentGameObj.winner == clientPlayer){
            statusMessage.textContent = `You win!`;
        }
        if (currentGameObj.winner != clientPlayer){
          if(currentGameObj.winner == 1){
            statusMessage.textContent = `You lose! ${currentGameObj.player1Name} wins!`;
        }else if(currentGameObj.winner == 2){
            statusMessage.textContent = `You lose! ${currentGameObj.player2Name} wins!`;
        }
      }
    }
  }
 }catch (error) {
    console.error("Error polling game state:", error);
  }
  console.log("Polling game state...");
  console.log(currentGameObj);
  setTimeout(() => pollGameState(), 2000); // Poll every 2 seconds
} //polls the game state from the server
