// back-end/server.js
const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

// Load env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// ✅ Import Google auth route
const googleAuthRoute = require('./src/api/auth/google/google_auth');
app.use('/api/auth/google', googleAuthRoute);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
