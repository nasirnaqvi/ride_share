const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const User = require('./models/user.model.js'); // Import the user schema


const app = express();
const port = 8080;

const cors = require('cors');
app.use(cors());

const mongoUri = process.env.MONGO_URI;

mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

app.use(express.json());


// Demo
app.get('/users', async (req, res) => {
  try {
      const users = await User.find(); 
      res.json(users);
  } catch (err) {
      console.error('Error fetching users:', err);
      res.status(500).json({ error: 'Internal server error' });
  }
});


app.get("/api", (req, res) => {
  res.json({ users: ["User 1", "User 2", "User 3"] });
});

app.listen(port, () => {
  console.log("Server is running on port " + port);
});