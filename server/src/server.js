//#region imports
const express = require('express'); 
const pgp = require('pg-promise')(); 
const bodyParser = require('body-parser');
const session = require('express-session'); 
const bcrypt = require('bcrypt');
const path = require('path');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const socketIO = require('socket.io');
const http = require('http');
const cors = require('cors');
const crypto = require('crypto');
const pg = require('pg');
//#endregion 

//Importing routes
const authRoutes = require('./routes/authRoutes.js');
const tripRoutes = require('./routes/tripRoutes.js');
const profileRoutes = require('./routes/profileRoutes.js');
const db = require('./controllers/db.js');


const app = express();
const server = http.createServer(app);
const io = socketIO(server);


const SERVER_HOST = process.env.SERVER_HOST;
const SERVER_PORT = process.env.SERVER_PORT;

app.use(cors({ origin: `http://localhost:${process.env.CLIENT_PORT}`, credentials: true }));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Origin', `http://localhost:${process.env.CLIENT_PORT}`);
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});



app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({limit: '10mb', extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'website')));

app.use(express.static('website'));
app.use(express.json());

const sessionSecret = crypto.randomBytes(32).toString('hex');

app.use(
  session({
    secret: sessionSecret,
    saveUninitialized: false,
    resave: false,
  })
);

app.use((req, res, next) => { //Runs everytime a request occurs
  // Example: Log request method and URL
  console.log("\n-------------------");
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  const authToken = req.cookies.authtoken;
  // if (authToken) {

  // }
  // console.log(authToken);
  // console.log("-------------------\n");
  // Proceed to the next middleware/route handler
  next();
});



app.use('/auth', authRoutes(sessionSecret));
app.use('/trip', tripRoutes());
app.use('/profile', profileRoutes());


app.get('/currSession', (req, res) => {
  res.status(200).json({ username: req.session.username });
});

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
