const express = require('express');
const cors = require('cors');             // ← add this
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');   // ← add this

// Routes
const googleAuthRoute = require('./src/api/auth/google/google_auth');
const authRoute = require('./src/api/auth/auth');   // ✅ make sure this file exists (e.g. back-end/src/routes/auth.js)

// Load env
dotenv.config();

const app = express();

app.use(cors({ origin: 'http://localhost:8080', credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// ✅ Import Google auth route
app.use('/auth/google', googleAuthRoute);
app.use('/api/auth', authRoute);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
