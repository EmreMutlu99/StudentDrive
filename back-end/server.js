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

// ✅ trust first proxy (needed if running behind nginx/traefik, etc.)
app.set('trust proxy', 1);

// CORS first
const allowedOrigins = ['http://localhost:4200','http://localhost:8080'];
const corsOptions = {
  origin(origin, cb) {
    if (!origin) return cb(null, true);
    return allowedOrigins.includes(origin) ? cb(null, true) : cb(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
};
app.use(cors(corsOptions));

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
