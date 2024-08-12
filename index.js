const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const rateLimit = require('express-rate-limit');

const Vehicle = require('./models/Vehicle');
const Organization = require('./models/Organization');

const app = express();
app.use(bodyParser.json());

const port = 5173;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// In-memory cache
const cache = {};

// Rate limiter middleware
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many requests, please try again later.'
});

app.use('/vehicles/decode/:vin', limiter);

app.get('/vehicles/decode/:vin', async (req, res) => {
  const vin = req.params.vin;
  const modelYear = req.query.modelyear || ''; // Optional model year from query parameters

  // Check cache first
  if (cache[vin]) {
    return res.json(cache[vin]);
  }

  try {
    const response = await axios.get(`https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/${vin}?format=json&modelyear=${modelYear}`);
    const results = response.data.Results;

    // Extract required details
    const vehicleDetails = {
      manufacturer: results.find(item => item.Variable === 'Manufacturer Name')?.Value,
      model: results.find(item => item.Variable === 'Model')?.Value,
      year: results.find(item => item.Variable === 'Model Year')?.Value
    };

    // Cache the response
    cache[vin] = vehicleDetails;

    res.json(vehicleDetails);
  } catch (error) {
    res.status(500).json({ error: 'Failed to decode VIN' });
  }
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