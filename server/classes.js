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
        const cols = this.gameState.length;
        const rows = this.gameState[0].length;
        const directions = [
            { x: 1, y: 0 },   // horizontal
            { x: 0, y: 1 },   // vertical
            { x: 1, y: 1 },   // diagonal down-right
            { x: 1, y: -1 }   // diagonal up-right
        ];

        for (let col = 0; col < cols; col++) {
            for (let row = 0; row < rows; row++) {
                const player = this.gameState[col][row];
                if (player === 0) continue;
                for (const dir of directions) {
                    let count = 1;
                    let c = col + dir.x;
                    let r = row + dir.y;
                    while (
                        c >= 0 && c < cols &&
                        r >= 0 && r < rows &&
                        this.gameState[c][r] === player
                    ) {
                        count++;
                        if (count === 4) {
                            this.winner = player;
                            this.gameCondition = 'win';
                            return ;
                        }
                        c += dir.x;
                        r += dir.y;
                    }
                }
            }
        }
        return null;
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