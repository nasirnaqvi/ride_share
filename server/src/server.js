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
const db = require('./controllers/postgresDB.js');
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
const SERVER_PORT = process.env.SERVER_PORT;
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

// Request logging middleware
app.use((req, res, next) => {
  console.log("\n-------------------");
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  if (req.cookies.authtoken) console.log(req.session.username);
  console.log("-------------------\n");
  next();
});

// Authentication Middleware
const authenticate = (req, res, next) => {
  const authToken = req.cookies.authtoken;
  if (!authToken) {
    res.status(401).json({ showSignUpPanel: false, message: "Please log in to access this page" });
    return;
  }

  try {
    const decoded = jwt.verify(authToken, jwtSecret);
    req.session.username = decoded.username;
    req.session.firstName = decoded.firstName;
    req.session.lastName = decoded.lastName;
    req.session.email = decoded.email;
    req.session.save();
    next();
  } catch (error) {
    console.log(error)
    res.status(401).json({ showSignUpPanel: false, message: "Invalid token" });
  }
};

// Route handling
app.use('/auth', authRoutes(jwtSecret));
app.use(authenticate);
app.use('/trip', tripRoutes());
app.use('/profile', profileRoutes());
app.use('/chats', chatRoutes(jwtSecret, io));


app.get('/getNumberOfRideRequests', async (req, res) => {
  const username = req.session.username;
  const query = `SELECT COUNT(*) 
                 FROM trip_requests 
                 JOIN trips ON trip_requests.trip_id = trips.trip_id
                 WHERE trips.driver_id = $1 AND trip_requests.request_status = 'pending'`;
  const response = await db.one(query, [username]);
  res.status(200).json(response);
});

app.get('/getNumberOfFriendRequests', async (req, res) => {
  const username = req.session.username;
  const query = `SELECT COUNT(*) FROM friendships WHERE user2_id = $1 AND status = 'pending'`;
  const response = await db.one(query, [username]);
  res.status(200).json(response);
});

server.listen(SERVER_PORT, () => {
  console.log(`Server is running on port ${SERVER_PORT}`);
});
