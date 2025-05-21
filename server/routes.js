const express = require('express');
const sendGameState = express.Router();

sendGameState.get('/game-state', (req, res) => {
    res.json(gameState);
})

module.exports = sendGameState;
