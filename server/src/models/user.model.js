// user.model.js
const mongoose = require('mongoose');

// Define the user schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    firstName: String,
    lastName: String,
    createdAt: { type: Date, default: Date.now }
});

// Create a model based on the schema
const User = mongoose.model('User', userSchema);

// Export the User model
module.exports = User;
