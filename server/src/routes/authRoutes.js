const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const axios  = require('axios');
// const passport = require('passport');

const db = require('./../controllers/db.js');

axios.default.withCredentials = true;


/* Status codes
Logins:
- 200: OK
- 400: Bad Request
- 401: Unauthorized
- 500: Internal Server Error

Registrations:
- 201: Created
- 400: Bad Request
- 409: Conflict
- 500: Internal Server Error

Logout:
- 200: OK
- 500: Internal Server Error


Pathing:
Registration code 201 => Login page showSignUpPanel = false
Else Registration codes => Login page showSignUpPanel = true

Login code 200 => home page
Else Login codes => Login page showSignUpPanel = false, message = "User does not exist" or "Invalid password" or "bad request"
*/

const jwtSecret = crypto.randomBytes(32).toString('hex');

module.exports = function (sessionSecret) {

  // router.get('/auth/google', passport.authenticate('google', { scope: ['profile','email'] }))


  // router.get('google/callback', 
  //   passport.authenticate('google', 
  //   { failureRedirect: '/login' }),
  //   (req, res) => {
  //     res.redirect('/log');
  //   });

  // Login post call
  router.post("/login", async (req, res) => {
    console.log(req.body);
    try {
      const usernameQuery = `SELECT * FROM users WHERE users.username = $1`;
      const data = await db.one(usernameQuery, [req.body.username]);
      const password = data.password;
      const match = await bcrypt.compare(req.body.password, password);
  
      if (match) {
        // Authentication successful
        const tokenPayload = {
          username: req.body.username,
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          keepSignedIn: req.body.keepSignedIn,
        };
        if (req.body.keepSignedIn) {
          const token = jwt.sign(tokenPayload, sessionSecret, { expiresIn: '1h' }); 
          res.cookie('authtoken', token, { httpOnly: true, maxAge: 3600000 }); // Set maxAge in milliseconds
        } else {
          // If keepSignedIn is not checked, clear any existing token
          res.clearCookie('authtoken');
        }
        
        // Set session data
        req.session.username = req.body.username;
        console.log("Session username is ", req.session.username);
        
        return res.status(200).json({ message: "Login successful" });
      } else {
        // Authentication failed
        return res.status(401).json({ showSignUpPanel: false, message: "Invalid password" });
      }
    } catch (err) {
      console.error(err);
      return res.status(500).json({ showSignUpPanel: false, message: "An error occurred during login" });
    }
  });
  

  // Register post call
  router.post("/register", async (req, res) => {
    const { username, password, email, firstName, lastName } = req.body;
    console.log("Registration attempted for user: " + username + " with email: " + email + " and name: " + firstName + " " + lastName + " at " + new Date().toLocaleString());
    
    if (!username || !password || !email || !firstName || !lastName) {
      return res.status(400).json({ message: "All fields are required" });
    }
  
    try {
      // Check if user already exists
      const existingUserQuery = 'SELECT * FROM users WHERE username = $1';
      const existingUserResult = await db.query(existingUserQuery, [username]);
      console.log("ITEM IS ", existingUserResult);
      if (existingUserResult.length > 0) {
        return res.status(409).json({ message: "User already exists" });
      }
  
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Insert new user into the database
      const insertUserQuery = `
        INSERT INTO users (username, password, email, first_name, last_name, created_at, trips_taken)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `;
      const values = [username, hashedPassword, email, firstName, lastName, new Date(), 0];
      await db.query(insertUserQuery, values);
  
      console.log("Registration successful");
      res.status(201).json({ showSignUpPanel: false, message: "Registration successful" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ showSignUpPanel: true, message: "Registration failed" });
    }
  });


  // Keep-signed-in check
  router.get('/keep-signed-in', (req, res) => {
    const token = req.cookies.authtoken;

    if (!token) {
      return res.json({ keepSignedIn: false });
    }

    try {
      const decoded = jwt.verify(token, jwtSecret);
      res.json({ keepSignedIn: decoded.keepSignedIn });
    } catch (error) {
      res.json({ keepSignedIn: false });
    }
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
      res.status(401).json({ showSignUpPanel: false, message: "Invalid token" });
    }
  };

  // Apply authentication middleware to specific routes
  router.use(authenticate);

  // Logout get call
  router.get("/logout", (req, res) => {
    try {
      res.clearCookie('authtoken');
      req.session.destroy();
      res.status(200).json({ showSignUpPanel: false });
    }
    catch {
      res.status(500).json({ showSignUpPanel: false });
    }
  });

  return router;
}