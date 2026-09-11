const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const guestRoutes = require('./routes/guests');
const findSeatRoutes = require('./routes/findSeat');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Middleware - allow Vercel or any origin
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '50mb' }));

// In-memory gallery storage
let galleryImages = [];

app.get('/api/gallery', (req, res) => {
  res.json(galleryImages);
});

app.post('/api/gallery', (req, res) => {
  const newImage = { id: Date.now().toString(), url: req.body.url };
  galleryImages.push(newImage);
  res.status(201).json(newImage);
});

app.delete('/api/gallery/:id', (req, res) => {
  galleryImages = galleryImages.filter(img => img.id !== req.params.id);
  res.json({ success: true });
});
// Root & Health check
app.get('/', (req, res) => {
  res.json({ status: "healthy", message: "Wedding Platform API is running on Render!" });
});

app.get('/api/test', (req, res) => {
  res.json({ status: "success", message: "Connected to API server successfully!" });
});

// API Routes
app.use('/api/guests', guestRoutes);
app.use('/api/find-seat', findSeatRoutes);

// MongoDB connection
// Bypassed for In-Memory array Mock
console.log(" Using Local In-Memory Mock Database successfully!");

app.listen(PORT, () => {
  console.log(` Server is listening on port ${PORT}`);
});
