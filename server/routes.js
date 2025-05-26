const express = require('express');
const router = express.Router();
const {Game}= require('./classes.js');

router.get('/game-state', (req, res) => {
    res.json(gameState);
})

router.get('/game-class', (req, res) => {
    const gameClassString = Game.toString();
    res.type('application/javascript'); // Set the content type to JavaScript
    res.send(`export default ${gameClassString}`); // Send the class definition as a string
})

module.exports = router;

// This code defines an Express router for handling game-related routes.