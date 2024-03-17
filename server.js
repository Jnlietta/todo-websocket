const express = require('express');

const app = express();

app.use((req, res) => {
    const failure = { message: 'Not found...' };
  
    res.status(404).json(failure);
  });
  
const server = app.listen(8000, () => {
    console.log('Server is running on port: 8000');
  });