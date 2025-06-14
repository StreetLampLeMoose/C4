const express = require('express');
const router = express.Router();
const {Game}= require('./classes.js');
const games = {};
router.get('/game-state', (req, res) => {
    res.json(gameState);
})

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
    const game = new Game(gameId, player1Name, player2Name, currentPlayer, gameState, gameCondition);
    games[gameId] = game; // Update the game in the games object
    res.json({ message: 'Game updated successfully'});
})

router.post('/join-game', (req, res) => {
    const { gameId, player2Name } = req.body;
    if (!gameId || !games[gameId]) {
        return res.status(404).json({ error: 'Game not found' });
    }
    const game = games[gameId];
    if (game.player2Name) {
        return res.status(400).json({ error: 'Game already has two players' });
    }
    game.player2Name = player2Name; // Reset current player to player1
    res.json({ game });
})

router.post('/game-state' , (req, res) => {
    const {gameId} = req.body//route for sending game state
    if (!gameId || !games[gameId]) {
        return res.status(404).json({ error: 'Game not found' });
    }
    const game = games[gameId];
    res.json({game});
})

module.exports = router;

// This code defines an Express router for handling game-related routes.