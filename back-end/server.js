const express = require('express');
const cors = require('cors');             // ← add this
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');   // ← add this

// Routes
const googleAuthRoute = require('./src/api/auth/google/google_auth');
const authRoute = require('./src/api/auth/auth');   
const universitiesRoute = require('./src/api/universities/universities');
const degreeProgramsRoute = require('./src/api/degreePrograms/degreePrograms');
const emailRouter = require("./src/api/email_sender/email_router");
const usersRouter = require('./src/api/users/users');
const fileRoutes = require("./src/api/file_storage/file_storage");
const MinioStorage = require("./src/service/minIO_Storage/minIO_Storage");


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
app.use('/api/universities', universitiesRoute);
app.use('/api/degree-programs', degreeProgramsRoute);
app.use("/api/email", emailRouter);
app.use('/api/users', usersRouter);
app.use("/api/files", fileRoutes);


// Initialize MinIO and start server
async function startServer() {
  try {
    // Ensure MinIO bucket exists
    const storage = new MinioStorage();
    await storage.ensureBucket();
    console.log("MinIO storage ready");

    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
}

startServer();