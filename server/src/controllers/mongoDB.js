const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');
const initialData = require('./../config/init_data/mongo_init_data.js');
const express = require('express');

const app = express();

//#region MongoDB
const MONGO_HOST = process.env.MONGO_HOST;
const MONGO_PORT = process.env.MONGO_PORT;
const MONGO_COLLECTION = process.env.MONGO_COLLECTION;

const MONGO_USERNAME = process.env.MONGO_INITDB_ROOT_USERNAME;
const MONGO_PASSWORD = process.env.MONGO_INITDB_ROOT_PASSWORD;
const MONGO_DATABASE = process.env.MONGO_INITDB_DATABASE;

const MONGO_URI = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DATABASE}?authSource=admin`;
//#endregion

console.log(MONGO_URI);

//#region Mongo Client
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000 // Timeout after 5s instead of 30s
})
.then(async () => {
  console.log('Connected to MongoDB');
  const mongoDB = mongoose.connection.db;

  try {
    // Check if the 'chats' collection is empty
    const chatCount = await mongoDB.collection('chats').countDocuments();
    if (chatCount === 0) {
      // Insert initial data into the 'chats' collection
      await mongoDB.collection('chats').insertMany(initialData.demoChats);
      console.log('Inserted initial chat data successfully');
    } else {
      console.log('The "chats" collection is not empty');
    }

    // Check if the 'userchats' collection is empty
    const userChatCount = await mongoDB.collection('userchats').countDocuments();
    if (userChatCount === 0) {
      // Insert initial data into the 'userchats' collection
      await mongoDB.collection('userchats').insertMany(initialData.demoUserChats);
      console.log('Inserted initial user chat data successfully');
    } else {
      console.log('The "userchats" collection is not empty');
    }
  } catch (error) {
    console.error('Error inserting initial data:', error);
  }
})
.catch(err => {
  console.error('Failed to connect to MongoDB:', err);
});
//#end
