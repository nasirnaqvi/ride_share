const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const bcrypt = require('bcrypt');
const crypto = require('crypto');

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

module.exports = function(client, User) {
  // Login post call
  router.post("/login", async (req, res) => {
    try {
      const user = await User.findOne({ username: req.body.username });
      if (!user) {
        return res.status(401).json({ showSignUpPanel: false, message: "User does not exist" });
      }
  
      const match = await bcrypt.compare(req.body.password, user.password);
      if (match) {
        const tokenPayload = {
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          keepSignedIn: req.body.keepSignedIn,
        };
  
        const token = jwt.sign(tokenPayload, jwtSecret, { expiresIn: '1h' });
        res.cookie('authtoken', token, { httpOnly: true });

        req.session.keepSignedIn = req.body.keepSignedIn;
        console.log("Login successful");
        return res.status(200).json({ message: "Login successful" });
      } else {
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
  
    if (!username || !password || !email || !firstName || !lastName) {
      return res.status(400).json({ message: "All fields are required" });
    }
  
    try {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(409).json({ message: "User already exists" });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        username,
        password: hashedPassword,
        email,
        firstName,
        lastName,
        createdAt: new Date(),
        tripsTaken: 0
      });
  
      await newUser.save();
      console.log("Registration successful for user: " + username + " with email: " + email + " and name: " + firstName + " " + lastName + " at " + new Date().toLocaleString());
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