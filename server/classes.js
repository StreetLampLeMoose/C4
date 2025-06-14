class Game {
    constructor(gameId, player1Name, player2Name, currentPlayer,gameState, gameCondition)  //gameCondition can be playing, win, draw
    {
        this.gameId = gameId;
        this.player1Name = player1Name;
        this.player2Name = player2Name;
        this.gameState = gameState;
        this.currentPlayer = currentPlayer; // 1 for player1, 2 for player2
        this.winner = null; // null if no winner yet
        this.gameCondition = gameCondition // 'waiting' ,'playing', 'win', 'draw'
    }
    resetGame(){
        this.gameState = [  [0, 0, 0, 0, 0, 0], //empty game state sub arrays are columns
                            [0, 0, 0, 0, 0, 0],
                            [0, 0, 0, 0, 0, 0],
                            [0, 0, 0, 0, 0, 0],
                            [0, 0, 0, 0, 0, 0],
                            [0, 0, 0, 0, 0, 0],
                            [0, 0, 0, 0, 0, 0]
                          ];
        this.currentPlayer =1;
        this.winner = null;
    }
    checkWin(){
        console.log("Checking for win condition...");
        return false;
    }
    checkDraw(){
        console.log("Checking for draw condition...");
        // Check if all cells are filled
        return false;
    }
    changePlayer(){
        if(this.currentPlayer == 1){
            this.currentPlayer = 2;
        }else if(this.currentPlayer == 2){
            this.currentPlayer = 1;
        }; // Toggle between player 1 and player 2
    }

}

module.exports = { Game };
// This code defines a Game class for a Connect Four game. 