//#region Imports
const express = require('express');
const http = require('http');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const crypto = require('crypto');
const expressSession = require('express-session');
const { Server } = require('socket.io');

// Database and utility imports
const pgp = require('pg-promise')();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pg = require('pg');

// Route imports
const authRoutes = require('./routes/authRoutes.js');
const tripRoutes = require('./routes/tripRoutes.js');
const profileRoutes = require('./routes/profileRoutes.js');
const chatRoutes = require('./routes/chatRoutes.js');
//#endregion

// Initialize Express app and server
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: `http://localhost:${process.env.CLIENT_PORT}`,
    methods: ['GET', 'POST'],
  },
});


// Environment variables
const SERVER_PORT = process.env.SERVER_PORT || 3000;
const sessionSecret = crypto.randomBytes(32).toString('hex');
const jwtSecret = crypto.randomBytes(32).toString('hex');

// Middleware setup
app.use(cors({
  origin: `http://localhost:${process.env.CLIENT_PORT}`,
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'website')));

// Session setup
const session = expressSession({
  secret: sessionSecret,
  resave: true,
  saveUninitialized: true,
});
app.use(session);

// io.engine.use(session);

// Request logging middleware
app.use((req, res, next) => {
  console.log("\n-------------------");
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  if (req.cookies.authtoken) console.log(req.session.username);
  console.log("-------------------\n");
  next();
});

// Route handling
app.use('/auth', authRoutes(jwtSecret));
app.use('/trip', tripRoutes());
app.use('/profile', profileRoutes());
app.use('/chats', chatRoutes(jwtSecret, io));

// Routes for session status
app.get('/isLoggedIn', (req, res) => {
  res.status(200).json({ isLoggedIn: !!req.session.username });
});

app.get('/currSession', (req, res) => {
  res.status(200).json({ username: req.session.username });
});

// Start server
server.listen(SERVER_PORT, () => {
  console.log(`Server is running on port ${SERVER_PORT}`);
});
