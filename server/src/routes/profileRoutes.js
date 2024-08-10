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

    router.get('/getMyFriends', async (req, res) => {
      const username = req.session.username;
      const query = `SELECT  
                      users.username,
                      users.first_name, 
                      users.last_name, 
                      users.profile_img,
                      users.trips_taken 
                    FROM users 
                    WHERE users.username IN (
                      SELECT user1_id FROM friendships 
                        WHERE user2_id = $1 
                        AND status = 'accepted'
                      UNION
                      SELECT user2_id FROM friendships
                          WHERE user1_id = $1
                          AND status = 'accepted')`;

      const response = await db.query(query, [username]);
      res.status(200).json(response);
    });

    router.get('/getAddFriends', async (req, res) => {
      const username = req.session.username;
      const searchQuery = req.query.searchQuery;
      const query = `SELECT 
                      users.username,
                      users.first_name, 
                      users.last_name, 
                      users.profile_img,
                      users.trips_taken,
                      friendships.status
                    FROM users
                    LEFT JOIN friendships
                      ON (users.username = friendships.user1_id AND friendships.user2_id = $1)
                      OR (users.username = friendships.user2_id AND friendships.user1_id = $1)
                    WHERE users.username != $1
                    AND (friendships.status != 'accepted' OR friendships.status IS NULL)
                      AND (users.first_name ILIKE '%' || $2 || '%' 
                          OR users.last_name ILIKE '%' || $2 || '%')
                    LIMIT 6;`;

      const response = await db.query(query, [username, searchQuery]);
      res.status(200).json(response);
    });

    router.get('/getFriendRequests', async (req, res) => {
      const username = req.session.username;
      const query = `SELECT 
                      users.username,
                      users.first_name, 
                      users.last_name, 
                      users.profile_img,
                      users.trips_taken
                    FROM users
                    WHERE users.username IN (
                      SELECT user1_id FROM friendships 
                        WHERE user2_id = $1 
                        AND status = 'pending')`;

      const response = await db.query(query, [username]);
      res.status(200).json(response);
    });

    router.post('/acceptFriendRequest', async (req, res) => {
      const username = req.session.username;
      const friendUsername = req.body.friendUsername;
      const query = `UPDATE friendships SET status = 'accepted' WHERE user1_id = $1 AND user2_id = $2`;
      await db.none(query, [friendUsername, username]);
      res.status(200).json({ message: "Friend request accepted" });
    });

    router.post('/rejectFriendRequest', async (req, res) => {
      const username = req.session.username;
      const friendUsername = req.body.friendUsername;
      const query = `UPDATE friendships SET status = 'rejected' WHERE user1_id = $1 AND user2_id = $2`;
      await db.none(query, [friendUsername, username]);
      res.status(200).json({ message: "Friend request rejected" });
    });

    router.post('/removeFriend', async (req, res) => {
      const username = req.session.username;
      const friendUsername = req.body.friendUsername;
      const query = `DELETE FROM friendships WHERE (user1_id = $1 AND user2_id = $2) OR (user1_id = $2 AND user2_id = $1)`;
      await db.none(query, [username, friendUsername]);
      res.status(200).json({ message: "Friend removed" });
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

    router.post('/addFriend', async (req, res) => {
      const username = req.session.username;
      const friendUsername = req.body.friendUsername;
      const query = `INSERT INTO friendships (user1_id, user2_id, status) VALUES ($1, $2, 'pending')`;
      await db.none(query, [username, friendUsername]);
      res.status(200).json({ message: "Friend request sent" });
    });

    return router;
}