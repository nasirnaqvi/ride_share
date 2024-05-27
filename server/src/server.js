//Normal imports
const express = require('express');
const mongoose = require('mongoose');
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');  
const http = require('http');
const session = require('express-session'); 
const crypto = require('crypto');

//Importing models
const UserSchema = require('./models/user.model.js');

//Importing routes
const authRoutes = require('./routes/authRoutes.js');

//Importing init_data
const init_data = require('./init_data.js');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('website'));
app.use(
  session({
    secret: crypto.randomBytes(32).toString('hex'),
    saveUninitialized: false,
    resave: false,
  })
);

//#region Environment Variables
const MONGO_HOST=process.env.MONGO_HOST;
const MONGO_PORT=process.env.MONGO_PORT;
const MONGO_COLLECTION=process.env.MONGO_COLLECTION;

const MONGO_USERNAME=process.env.MONGO_INITDB_ROOT_USERNAME;
const MONGO_PASSWORD=process.env.MONGO_INITDB_ROOT_PASSWORD;
const MONGO_INTIDB_DATABASE=process.env.MONGO_INTIDB_DATABASE;

const SERVER_HOST=process.env.SERVER_HOST;
const SERVER_PORT = process.env.SERVER_PORT; 
//#endregion

const MONGO_URI = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}`;
// const URI = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/`;
// const MONGO_URI = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@localhost:${MONGO_PORT}/`;

console.log(MONGO_URI);
const client = new MongoClient(MONGO_URI);
const db = client.db(MONGO_INTIDB_DATABASE);
const collection = db.collection(MONGO_COLLECTION);

//#region Mongo Client
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000 // Timeout after 5s instead of 30s
})
.then(() => {
  console.log('Connected to MongoDB');

  // Middleware
  app.use(express.static('website'));
  app.use(express.json());
  
  //#region Routes
  app.use('/auth', authRoutes(mongoose, UserSchema));
  //#endregion

  // Start the server
  app.listen(SERVER_PORT, () => {
    console.log(`Server is running on port ${SERVER_PORT}`);
  });

})
.catch(err => {
  console.error('Failed to connect to MongoDB:', err);
});
//#endregion
