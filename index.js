const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json()); // Add this line to parse JSON bodies

const port = 5173;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get('/api/items', (req, res) => {
  res.send('List of items');
});

app.post('/api/items', (req, res) => {
  const newItem = req.body; // Data sent in the request body.
  res.send(`Item added: ${newItem.name}`);
});

app.put('/api/items/:id', (req, res) => {
  const itemId = req.params.id; // Access URL parameter.
  res.send(`Item with ID ${itemId} updated`);
});

app.delete('/api/items/:id', (req, res) => {
  const itemId = req.params.id;
  res.send(`Item with ID ${itemId} deleted`);
});