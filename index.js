const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const rateLimit = require('express-rate-limit');
const OrganizationManager = require('./models/Organization');
const Vehicle = require('./models/Vehicle'); // Import Vehicle class

const app = express();
app.use(bodyParser.json());

const port = 5173;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Initialize the OrganizationManager
const organizationManager = new OrganizationManager();

// In-memory storage for vehicles
const vehicles = [];

// Rate limiter middleware
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many requests, please try again later.'
});

app.use('/vehicles/decode/:vin', limiter);

// app.get('/vehicles/decode/:vin', async (req, res) => {
//   const vin = req.params.vin;
//   const modelYear = req.query.modelyear || ''; // Optional model year from query parameters

//   try {
//     const response = await axios.get(`https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/${vin}?format=json&modelyear=${modelYear}`);
//     const results = response.data.Results;

//     // Extract required details
//     const vehicleDetails = {
//       manufacturer: results.find(item => item.Variable === 'Manufacturer Name')?.Value,
//       model: results.find(item => item.Variable === 'Model')?.Value,
//       year: results.find(item => item.Variable === 'Model Year')?.Value
//     };

//     res.json(vehicleDetails);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to decode VIN' });
//   }
// });

app.post('/vehicles', async (req, res) => {
  const { vin, org } = req.body;

  // Validate VIN
  const vinRegex = /^[A-HJ-NPR-Z0-9]{17}$/;
  if (!vinRegex.test(vin)) {
    return res.status(400).json({ error: 'Invalid VIN' });
  }

  // Validate organization ID
  const organization = organizationManager.findOrganizationById(org);
  if (!organization) {
    return res.status(400).json({ error: 'Invalid organization ID' });
  }

  // Decode VIN
  try {
    const response = await axios.get(`https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/${vin}?format=json`);
    const results = response.data.Results;

    // Extract required details
    const manufacturer = results.find(item => item.Variable === 'Manufacturer Name')?.Value;
    const model = results.find(item => item.Variable === 'Model')?.Value;
    const year = results.find(item => item.Variable === 'Model Year')?.Value;

    // Create a new Vehicle instance
    const newVehicle = new Vehicle(vin, manufacturer, model, year, org);

    // Save vehicle to the in-memory storage
    vehicles.push(newVehicle);

    res.status(201).json(newVehicle);
  } catch (error) {
    res.status(500).json({ error: 'Failed to decode VIN' });
  }
});

// CRUD operations for organizations
app.post('/organizations', (req, res) => {
  const newOrganization = organizationManager.createOrganization(req.body);
  res.status(201).json(newOrganization);
});

app.get('/organizations', (req, res) => {
  res.json(organizationManager.getAllOrganizations());
});

app.get('/organizations/:id', (req, res) => {
  const organization = organizationManager.findOrganizationById(parseInt(req.params.id, 10));
  if (!organization) {
    return res.status(404).json({ error: 'Organization not found' });
  }
  res.json(organization);
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