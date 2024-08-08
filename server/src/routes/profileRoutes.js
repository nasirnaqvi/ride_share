const express = require('express');
const router = express.Router();
const db = require('../controllers/postgresDB.js');
const bcrypt = require('bcrypt');


module.exports = function () {
    router.get('/getInfo', async (req, res) => {
        try {
          const usernameQuery = `SELECT * FROM users WHERE users.username = $1`;
          const data = await db.one(usernameQuery, [req.session.username]);
          const response = {
            username: data.username,
            email: data.email,
            first_name: data.first_name,
            last_name: data.last_name,
            profile_img: data.profile_img,
            trips_taken: data.trips_taken,
            password: "",
          };
          res.status(200).json(response);
        }
        catch (err) {
          console.error(err);
          res.status(500).json({ message: "An error occurred fetching user data" });
        }
      });

      router.get('/limitedInfo', async (req, res) => {
        try {
          const profileQuery = `SELECT username, first_name, last_name, profile_img, trips_taken FROM users WHERE users.username = $1`;
          const data = await db.one(profileQuery, [req.session.username]);
          const response = {
            username: data.username,
            first_name: data.first_name,
            last_name: data.last_name,
            profile_img: data.profile_img,
            trips_taken: data.trips_taken,
          };
          res.status(200).json(response);
        }
        catch (err) {
          console.error(err);
          res.status(500).json({ message: "An error occurred fetching user data" });
        }
      });

      router.post('/updateInfo', async (req, res) => {
        try {
          const { username, email, profile_img, first_name, last_name, password } = req.body;
          
          if (password === "") {
            const updateQuery = `UPDATE users SET username = $1, email = $2, first_name = $3, last_name = $4, profile_img = $5 WHERE username = $6`;
            await db.none(updateQuery, [username, email, first_name, last_name, profile_img, req.session.username]);
            req.session.username = username;
            res.status(200).json({ message: "Profile updated successfully" });
          }
          else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const updateQuery = `UPDATE users SET username = $1, email = $2, first_name = $3, last_name = $4, password = $5, profile_img = $6 WHERE username = $7`;
            await db.none(updateQuery, [username, email, first_name, last_name, hashedPassword, profile_img, req.session.username]);
            req.session.username = username;
            res.status(200).json({ message: "Profile updated successfully" });
          }
        }
        catch (err) {
          console.error(err);
          res.status(500).json({ message: "An error occurred updating user data" });
        }
      });

    return router;
}