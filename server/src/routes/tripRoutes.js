const express = require('express');
const router = express.Router();

const db = require('./../controllers/postgresDB.js');


module.exports = function () {

    router.get('/getFriendTrips', async (req, res) => {
        const username = req.session.username;

        const query = `SELECT 
                            trips.*,
                            users.first_name,
                            users.last_name,
                            users.trips_taken
                        FROM trips
                        JOIN users ON trips.driver_id = users.username
                            WHERE public = false
                            AND NOT driver_id = $1 
                            AND active = true
                            AND driver_id IN (
                                SELECT user1_id FROM friendships 
                                    WHERE user2_id = $1 
                                    AND status = 'accepted'
                                UNION
                                SELECT user2_id FROM friendships
                                    WHERE user1_id = $1
                                    AND status = 'accepted'
                            )`;
         
        const response = await db.query(query, [username]);
        res.status(200).json(response);
    });

    router.get('/getPublicTrips', async (req, res) => {
        const username = req.session.username;

        const query = `SELECT 
                            trips.*, 
                            users.first_name,
                            users.last_name,
                            users.trips_taken
                        FROM trips
                        JOIN users ON trips.driver_id = users.username
                            WHERE public = true
                            AND NOT driver_id = $1
                            AND active = true`;
        const response = await db.query(query, [username]);
        res.status(200).json(response);
    });

    router.get('/getPendingTrips', async (req, res) => {
        const username = req.session.username;

        const query = `SELECT 
                            trips.*,
                            users.first_name,
                            users.last_name,
                            users.trips_taken
                        FROM trips
                        JOIN users ON trips.driver_id = users.username
                            WHERE active = true
                            AND driver_id = $1`;
         
        const response = await db.query(query, [username]);
        res.status(200).json(response);
    });

    router.get('/getCompletedTrips', async (req, res) => {
        const username = req.session.username;

        const query = `SELECT 
                            trips.*,
                            users.first_name,
                            users.last_name,
                            users.trips_taken
                        FROM trips
                        JOIN users ON trips.driver_id = users.username
                            WHERE active = false
                            AND driver_id = $1`;
         
        const response = await db.query(query, [username]);
        res.status(200).json(response);
    });

    router.get('/getRideRequests', async (req, res) => {
        const username = req.session.username;

        const query = `SELECT 
                            trip_requests.trip_id,
                            trips.destination_location,
                            trips.original_location,
                            trips.leaving_time,
                            trips.max_passengers,
                            trips.current_passengers,
                            trips.public,
                            trip_requests.request_status,
                            trip_requests.requester_id,
                            users.first_name,
                            users.last_name,
                            users.trips_taken,
                            users.profile_img
                        FROM trip_requests
                        JOIN trips ON trip_requests.trip_id = trips.trip_id
                        JOIN users ON trip_requests.requester_id = users.username
                            WHERE trips.driver_id = $1
                            AND trip_requests.request_status = 'pending'`;
         
        const response = await db.query(query, [username]);
        res.status(200).json(response);
    });

    router.get('/getTripRequests', async (req, res) => {
        const username = req.session.username;

        const query = `SELECT trip_id, request_status FROM trip_requests WHERE requester_id = $1`;
         
        const response = await db.query(query, [username]);
        res.status(200).json(response);
    });

    router.post('/acceptRequest', async (req, res) => {
        const { trip_id, requester_id } = req.body;

        const query = `UPDATE trip_requests SET request_status = 'accepted' WHERE requester_id = $1 AND trip_id = $2`;
        const response = await db.query(query, [requester_id, trip_id]);
        res.status(200).json(response);
    });

    router.post('/rejectRequest', async (req, res) => {
        const { trip_id, requester_id } = req.body;

        const query = `UPDATE trip_requests SET request_status = 'rejected' WHERE requester_id = $1 AND trip_id = $2`;
        const response = await db.query(query, [requester_id, trip_id]);
        res.status(200).json(response);
    });

    router.post('/requestTrip', async (req, res) => {
        const { trip_id } = req.body;
        const username = req.session.username;

        const query = `INSERT INTO trip_requests (requester_id, trip_id, request_status) 
                        VALUES ($1, $2, 'pending')`;
        const response = await db.query(query, [username, trip_id]);
        res.status(200).json(response);
    });

    router.post('/addTrip', async (req, res) => {
        const { destination_location, origin, leaving_time, max_passengers, trip_type } = req.body;
        const username = req.session.username;

        let public = true;
        if (trip_type === 'public') {
            public = true;
        }
        else {
            public = false;
        }

        const query = `INSERT INTO trips (driver_id, destination_location, original_location, active, payment_req, leaving_time, max_passengers, public) 
                        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`;

        await db.query(query, [username, destination_location, origin, true, true, leaving_time, max_passengers, public]);
        res.status(200).json("Trip added successfully");
    });

    router.post('/deleteTrip', async (req, res) => {
        const { trip_id } = req.body;

        const query1 = `DELETE FROM trip_requests WHERE trip_id = $1`;
        const query2 = `DELETE FROM trips WHERE trip_id = $1`;

        await db.query(query1, [trip_id]);
        await db.query(query2, [trip_id]);
        res.status(200).json("Trip deleted successfully");
    });    


    //Returns an an array with two items: "friend_trips" and "others"
    // router.get('/getTrips', async (req, res) => {
    //     const response = { friend_trips: null, public_trips: null };
    //     //Need to add distance for trips
    //     try {
    //         if (!req.session.username) {
    //             const temp = req.session.username;
    //             const query2 = `
    //         WITH public_trips AS (
    //             SELECT DISTINCT
    //                 t.*, 
    //                 u.first_name AS driver_first_name,
    //                 u.last_name AS driver_last_name,
    //                 u.trips_taken AS driver_trips_taken,
    //                 u.profile_img AS driver_profile_img,
    //                 t.max_passengers - t.current_passengers AS seats_available
    //             FROM 
    //                 trips t
    //             LEFT JOIN
    //                 users u ON t.driver_id = u.username
    //             WHERE 
    //                 t.active = true 
    //                 AND t.max_passengers - t.current_passengers > 0       
    //         ) 
    //         SELECT 
    //             json_agg(
    //                 json_build_object(
    //                     'trip_id', pt.trip_id,
    //                     'destination_location', pt.destination_location,
    //                     'original_location', pt.original_location,
    //                     'active', pt.active,
    //                     'payment_req', pt.payment_req,
    //                     'leaving_time', pt.leaving_time,
    //                     'seats_available', pt.seats_available,
    //                     'driver', json_build_object(
    //                         'first_name', pt.driver_first_name,
    //                         'last_name', pt.driver_last_name,
    //                         'trips_taken', pt.driver_trips_taken,
    //                         'profile_img', pt.driver_profile_img
    //                     )
    //                 )
    //             ) AS public_trips_result
    //         FROM 
    //             public_trips pt;
    //     `;

    //             const pTrips = await db.query(query2, []);
    //             response.public_trips = pTrips[0].public_trips_result;
    //             res.status(200).json(response);
    //             return;
    //         }



    //         // Query to fetch friend trips along with their associated friendship status
    //         const query1 = `
    //         WITH friend_trips AS (
    //             SELECT 
    //                 t.*, 
    //                 f.status,
    //                 u.first_name AS driver_first_name,
    //                 u.last_name AS driver_last_name,
    //                 u.trips_taken AS driver_trips_taken,
    //                 u.profile_img AS driver_profile_img,
    //                 t.max_passengers - t.current_passengers AS seats_available
    //             FROM 
    //                 trips t
    //             LEFT JOIN 
    //                 friendships f ON t.driver_id = f.user1_id OR t.driver_id = f.user2_id
    //             LEFT JOIN 
    //                 users u ON t.driver_id = u.username
    //             WHERE 
    //                 f.status = 'accepted' 
    //                 AND (f.user1_id = $1 OR f.user2_id = $1) 
    //                 AND t.active = true 
    //                 AND t.driver_id != $1
    //                 AND t.max_passengers - t.current_passengers > 0
    //         )
    //         SELECT 
    //             json_agg(
    //                 json_build_object(
    //                     'trip_id', ft.trip_id,
    //                     'destination_location', ft.destination_location,
    //                     'original_location', ft.original_location,
    //                     'active', ft.active,
    //                     'payment_req', ft.payment_req,
    //                     'leaving_time', ft.leaving_time,
    //                     'seats_available', ft.seats_available,
    //                     'status', ft.status,
    //                     'driver', json_build_object(
    //                         'first_name', ft.driver_first_name,
    //                         'last_name', ft.driver_last_name,
    //                         'trips_taken', ft.driver_trips_taken,
    //                         'profile_img', ft.driver_profile_img
    //                     )
    //                 )
    //             ) AS friend_trips_result
    //         FROM 
    //             friend_trips ft;            
    //         `;

    //         // Query to fetch public trips excluding friend trips
    //         const query2 = `
    //         WITH public_trips AS (
    //             SELECT DISTINCT
    //                 t.*, 
    //                 f.status AS friendship_status,
    //                 u.first_name AS driver_first_name,
    //                 u.last_name AS driver_last_name,
    //                 u.trips_taken AS driver_trips_taken,
    //                 u.profile_img AS driver_profile_img,
    //                 t.max_passengers - t.current_passengers AS seats_available
    //             FROM 
    //                 trips t
    //             INNER JOIN 
    //                 friendships f ON t.driver_id = f.user1_id OR t.driver_id = f.user2_id
    //             LEFT JOIN
    //                 users u ON t.driver_id = u.username
    //             WHERE 
    //                 t.active = true 
    //                 AND t.driver_id != $1
    //                 AND t.max_passengers - t.current_passengers > 0
    //                 AND t.trip_id NOT IN (
    //                     SELECT trip_id 
    //                     FROM trips
    //                     LEFT JOIN friendships ON trips.driver_id = friendships.user1_id OR trips.driver_id = friendships.user2_id
    //                     WHERE friendships.status = 'accepted' 
    //                         AND (friendships.user1_id = $1 OR friendships.user2_id = $1) 
    //                         AND trips.active = true 
    //                         AND trips.driver_id != $1
    //                 )             
    //         ) 
    //         SELECT 
    //             json_agg(
    //                 json_build_object(
    //                     'trip_id', pt.trip_id,
    //                     'destination_location', pt.destination_location,
    //                     'original_location', pt.original_location,
    //                     'active', pt.active,
    //                     'payment_req', pt.payment_req,
    //                     'leaving_time', pt.leaving_time,
    //                     'seats_available', pt.seats_available,
    //                     'status', pt.friendship_status,
    //                     'driver', json_build_object(
    //                         'first_name', pt.driver_first_name,
    //                         'last_name', pt.driver_last_name,
    //                         'trips_taken', pt.driver_trips_taken,
    //                         'profile_img', pt.driver_profile_img
    //                     )
    //                 )
    //             ) AS public_trips_result
    //         FROM 
    //             public_trips pt;
            
    //         `;


    //         // Execute the query to fetch friend trips
    //         const fTrips = await db.query(query1, [req.session.username]);
    //         response.friend_trips = fTrips[0].friend_trips_result;
    //         // Execute the query to fetch public trips
    //         const pTrips = await db.query(query2, [req.session.username]);
    //         response.public_trips = pTrips[0].public_trips_result;

    //         // Send the response
    //         console.log(response);
    //         res.status(200).json(response);
    //         return;
    //     } catch (error) {
    //         console.error('Error fetching trips:', error);
    //         res.status(500).json({ error: 'An error occurred while fetching trips' });
    //     }
    // });

    // router.post('/createTrip', async (req, res) => {
    //     try {
    //         const { driver_id, destination_location, original_location, active, payment_req, leaving_time } = req.body;

    //         const insertQuery = `
    //         INSERT INTO trips (driver_id, destination_location, original_location, active, payment_req, leaving_time)
    //         VALUES ($1, $2, $3, $4, $5)
    //         RETURNING *;
    //       `;

    //         const result = await pool.query(insertQuery, [
    //             driver_id,
    //             destination_location,
    //             original_location,
    //             active,
    //             payment_req,
    //             leaving_time
    //         ]);

    //         res.status(201).json("Successfully created trip");
    //     } catch (error) {
    //         console.error('Error inserting into database', error);
    //         res.status(400).json({ error: error.message });
    //     }
    // });




    // // End a trip (set active to false)
    // router.post('/endTrip', async (req, res) => {
    //     try {
    //         const { tripId } = req.body;
    //         const updateQuery = `
    //         UPDATE trips
    //         SET active = false
    //         WHERE trip_id = $1
    //         RETURNING *;
    //       `;

    //         const result = await db.query(updateQuery, [tripId]);

    //         if (result.length === 0) {
    //             return res.status(404).json({ error: 'Trip not found' });
    //         }

    //         res.status(200).json(result[0]);
    //     } catch (error) {
    //         console.error('Error updating trip status', error);
    //         res.status(400).json({ error: error.message });
    //     }
    // });

    // // Join a trip (add user to otherUsers)
    // router.post('/joinTrip', async (req, res) => {
    //     try {
    //         const { tripId, userId } = req.body;

    //         // First, check if the trip exists
    //         const checkTripQuery = 'SELECT * FROM trips WHERE trip_id = $1';
    //         const tripResult = await db.query(checkTripQuery, [tripId]);

    //         if (tripResult.length === 0) {
    //             return res.status(404).json({ error: 'Trip not found' });
    //         }

    //         // Second, add user to trip_users table
    //         const insertUserQuery = `
    //         INSERT INTO passengers (trip_id, user_id)
    //         VALUES ($1, $2)
    //         ON CONFLICT DO NOTHING;
    //       `;

    //         await db.query(insertUserQuery, [tripId, userId]);

    //         // Fetch the updated trip details
    //         const updatedTripQuery = `
    //         SELECT trips.*, users.*
    //         FROM trips
    //         LEFT JOIN trip_users ON trips.id = trip_users.trip_id
    //         LEFT JOIN users ON trip_users.user_id = users.id
    //         WHERE trips.id = $1;
    //       `;

    //         const updatedTripResult = await db.query(updatedTripQuery, [tripId]);

    //         const trip = {
    //             ...updatedTripResult.rows[0],
    //             otherUsers: updatedTripResult.rows.map(row => ({
    //                 userId: row.user_id,
    //                 userName: row.user_name, // Adjust field names as per your schema
    //             })),
    //         };

    //         res.status(200).json(trip);
    //     } catch (error) {
    //         console.error('Error joining trip', error);
    //         res.status(400).json({ error: error.message });
    //     }
    // });

    // // Leave a trip (remove user from otherUsers)
    // //   router.post('/leaveTrip', async (req, res) => {
    // //     try {
    // //       const { tripId, userId } = req.body;
    // //       const trip = await Trip.findByIdAndUpdate(
    // //         tripId,
    // //         { $pull: { otherUsers: userId } },
    // //         { new: true }
    // //       );
    // //       if (!trip) {
    // //         return res.status(404).json({ error: 'Trip not found' });
    // //       }
    // //       res.status(200).json(trip);
    // //     } catch (error) {
    // //       res.status(400).json({ error: error.message });
    // //     }
    // //   });

    // // Get trip details by ID
    // router.get('/getTripByID', async (req, res) => {
    //     try {
    //         const tripQuery = `
    //         SELECT *
    //         FROM trips
    //         WHERE trips.trip_id = $1;
    //       `;
    //         const result = await db.query(tripQuery, [req.body.tripId]);
    //         console.log(result);

    //         if (result.length === 0) {
    //             return res.status(404).json({ error: 'Trip not found' });
    //         }

    //         res.status(200).json(result);
    //     } catch (error) {
    //         console.error('Error querying database', error);
    //         res.status(500).json({ error: 'Internal server error' });
    //     }
    // });

    // // Get users of a trip
    // //   router.get('/getTripUsers', async (req, res) => {
    // //     try {
    // //       const { tripId } = req.query;
    // //       const trip = await Trip.findById(tripId).populate('otherUsers');
    // //       if (!trip) {
    // //         return res.status(404).json({ error: 'Trip not found' });
    // //       }
    // //       res.status(200).json(trip.otherUsers);
    // //     } catch (error) {
    // //       res.status(400).json({ error: error.message });
    // //     }
    // //   });

    return router;
}