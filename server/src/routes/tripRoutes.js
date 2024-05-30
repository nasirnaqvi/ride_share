const express = require('express');
const router = express.Router();



module.exports = function() {
    // router.get('/getTrips', async (req, res) => {
    //     Trip.find({ active: true })
    //         .then(activeTrips => {
    //             console.log('Active trips:', activeTrips);
    //         })
    //         .catch(err => {
    //             console.error('Error fetching active trips:', err);
    //         });


    // });

    // router.post('/createTrip', async (req, res) => {
    //     try {
    //       const trip = new Trip(req.body);
    //       await trip.save();
    //       res.status(201).json(trip);
    //     } catch (error) {
    //       res.status(400).json({ error: error.message });
    //     }
    //   });
      
    //   // End a trip (set active to false)
    //   router.post('/endTrip', async (req, res) => {
    //     try {
    //       const { tripId } = req.body;
    //       const trip = await Trip.findByIdAndUpdate(tripId, { active: false }, { new: true });
    //       if (!trip) {
    //         return res.status(404).json({ error: 'Trip not found' });
    //       }
    //       res.status(200).json(trip);
    //     } catch (error) {
    //       res.status(400).json({ error: error.message });
    //     }
    //   });
      
    //   // Join a trip (add user to otherUsers)
    //   router.post('/joinTrip', async (req, res) => {
    //     try {
    //       const { tripId, userId } = req.body;
    //       const trip = await Trip.findByIdAndUpdate(
    //         tripId,
    //         { $addToSet: { otherUsers: userId } },
    //         { new: true }
    //       );
    //       if (!trip) {
    //         return res.status(404).json({ error: 'Trip not found' });
    //       }
    //       res.status(200).json(trip);
    //     } catch (error) {
    //       res.status(400).json({ error: error.message });
    //     }
    //   });
      
    //   // Leave a trip (remove user from otherUsers)
    //   router.post('/leaveTrip', async (req, res) => {
    //     try {
    //       const { tripId, userId } = req.body;
    //       const trip = await Trip.findByIdAndUpdate(
    //         tripId,
    //         { $pull: { otherUsers: userId } },
    //         { new: true }
    //       );
    //       if (!trip) {
    //         return res.status(404).json({ error: 'Trip not found' });
    //       }
    //       res.status(200).json(trip);
    //     } catch (error) {
    //       res.status(400).json({ error: error.message });
    //     }
    //   });
      
    //   // Get trip details by ID
    //   router.get('/getTrip', async (req, res) => {
    //     try {
    //       const { tripId } = req.query;
    //       const trip = await Trip.findById(tripId).populate('driverID otherUsers');
    //       if (!trip) {
    //         return res.status(404).json({ error: 'Trip not found' });
    //       }
    //       res.status(200).json(trip);
    //     } catch (error) {
    //       res.status(400).json({ error: error.message });
    //     }
    //   });
      
    //   // Get users of a trip
    //   router.get('/getTripUsers', async (req, res) => {
    //     try {
    //       const { tripId } = req.query;
    //       const trip = await Trip.findById(tripId).populate('otherUsers');
    //       if (!trip) {
    //         return res.status(404).json({ error: 'Trip not found' });
    //       }
    //       res.status(200).json(trip.otherUsers);
    //     } catch (error) {
    //       res.status(400).json({ error: error.message });
    //     }
    //   });

    return router;
}