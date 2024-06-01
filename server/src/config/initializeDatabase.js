// const User = require('./../models/user.model.js');
// const Trip = require('./../models/trip.model.js');
// const mongoose = require('mongoose');
// const data = require('./init_data.js');

// const initializeDatabase = async () => {
//     try {
//       await User.deleteMany({});
//       await Trip.deleteMany({});
      
//       const insertedUsers = await User.insertMany(data.userData);
//       console.log('Inserted Users:', insertedUsers);
  
//       const insertedTrips = await Trip.insertMany(data.tripData);
//       console.log('Inserted Trips:', insertedTrips);
  
//       mongoose.connection.close();
//     } catch (err) {
//       console.error("ERROR Initializing Database: ", err);
//     }
//   };
  
//   initializeDatabase();