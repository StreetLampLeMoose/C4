const express = require('express');
const app = express();
const cors = require('cors');
exports.app = app;
const port = 3000; 

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

