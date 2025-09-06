const express = require('express');
const router = express.Router();
const {Game}= require('./classes.js');
const games = {};
gameCleanup(); // Start the game cleanup process
function gameCleanup() { //deltes games that have ended every 60 seconds
    for (const gameId in games) {
        if (games[gameId].gameCondition === 'ended') {
            delete games[gameId];
            console.log(`Cleaned up game with ID: ${gameId}`);
        }
    setTimeout(gameCleanup, 60000); // Run every 60 seconds    
}
}

router.get('/game-class', (req, res) => {
    const gameClassString = Game.toString();
    res.type('application/javascript'); // Set the content type to JavaScript
    res.send(`export default ${gameClassString}`); // Send the class definition as a string
})

router.post('/create-game', (req, res) => {
    const { gameId, player1Name, player2Name, currentPlayer,gameState, gameCondition } = req.body;
    const newGame = new Game(gameId, player1Name, player2Name, currentPlayer,gameState, gameCondition);
    games[gameId] = newGame;
    res.json({ message: 'Game created successfully', game: newGame });
})

router.post('/update-game', (req,res) => {
    console.log(req.body);
    const {gameId, player1Name, player2Name, currentPlayer,gameState, gameCondition} = req.body;
    if (!gameId || !games[gameId]) {
        return res.status(404).json({ error: 'Game not found' });
    }
    const game = games[gameId];
    game.currentPlayer = currentPlayer;
    game.gameState = gameState;
    game.gameCondition = gameCondition;
    game.checkWin(); // Check for a win condition
    game.checkDraw(); // Check for a draw condition
    res.json({ message: 'Game updated successfully'});
})

router.post('/join-game', (req, res) => { 
    // route for joining a game
    // allows joining if game exists and only has one player
    const { gameId, player2Name } = req.body;
    if (!gameId || !games[gameId]) {
        return res.status(404).json({ error: 'Game not found' });
    }
    const game = games[gameId];
    if (game.player2Name) {
        return res.status(400).json({ error: 'Game already has two players' });
    }
    game.gameCondition = 'playing'; 
    game.player2Name = player2Name;
    games[gameId] = game; //update the game in the games object
    res.json({ game });
})

router.post('/reset-game', (req, res) => {
    // resets the game to initial state
    // keeps player names and gameId the same
    const { gameId } = req.body; 
    if (!gameId || !games[gameId]) {   
        return res.status(404).json({ error: 'Game not found' });
    }
    const game = games[gameId];
    game.resetGame();
    res.json({ message: 'Game reset successfully', game });

})

router.post('/delete-game', (req, res) => {
    const { gameId } = req.body;
    if (!gameId || !games[gameId]) {
        return res.status(404).json({ error: 'Game not found' });
    }
    games[gameId].gameCondition = 'ended'; //mark the game as ended
    res.json({ message: 'Game deleted successfully' });
});

router.post('/game-state' , (req, res) => {
    // returns the game state for a given gameId
    const {gameId} = req.body;
    if (!gameId || !games[gameId]) {
        return res.status(404).json({ error: 'Game not found' });
    }
    const game = games[gameId];
    res.json({game});
})

module.exports = router;

// This code defines an Express router for handling game-related routes.