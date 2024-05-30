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
//#endregion 

//Importing routes
// const authRoutes = require('./routes/authRoutes.js');
// const tripRoutes = require('./routes/tripRoutes.js');
// const db = require('./controllers/db.js');


const app = express();
const server = http.createServer(app);
const io = socketIO(server);


const SERVER_HOST = process.env.SERVER_HOST;
const SERVER_PORT = process.env.SERVER_PORT;

// app.use(cors());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'website')));

// app.use(express.static('website'));
// app.use(express.json());

//#region Routes


// app.use(
//   session({
//     secret: crypto.randomBytes(32).toString('hex'),
//     saveUninitialized: false,
//     resave: false,
//   })
// );

// app.use('/auth', authRoutes);
// app.use('/trip', tripRoutes);

// //#region Middleware for Authentication
// const authenticateToken = (req, res, next) => {
//   const token = req.cookies.token;
//   if (!token) return res.sendStatus(403);

//   jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//     if (err) return res.sendStatus(403);
//     req.user = user;
//     next();
//   });
// };



server.listen(SERVER_PORT, () => {
  console.log(`Server is running on port ${SERVER_PORT}`);
});
