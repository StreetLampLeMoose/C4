const express = require('express');
const app = express();
const cors = require('cors');
exports.app = app;
const port = 3000; 
const path = require('path');
const { Game } = require('./server/classes.js');
const routes = require('./server/routes.js');

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'client')));

console.log('Starting server...');
console.log('Current directory:', __dirname);
console.log('Static directory:', __dirname);

app.get('/', (req, res) => {
  console.log('Received request for /');
  res.sendFile(path.join(__dirname , '/client/view.html'))
});

app.get('/view', (req, res) => {
  console.log('Received request for /view');
  res.sendFile(path.join(__dirname , '/client/view.html'));
  //res.sendFile(path.join(__dirname , '/client/game.js'));
});
 
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

app.use('/', routes);
app.use(routes);

