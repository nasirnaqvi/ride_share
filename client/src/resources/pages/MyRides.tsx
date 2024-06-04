// import { useState } from 'react';

// interface Trip {
//   trip_id: number,
//   driver_id: string,
//   destination: string,
//   original_location: string,
//   active: boolean,
//   payment_req: boolean,
//   leaving_time: Date,
//   max_passengers: number | null,
//   current_passengers: number,
//   status: 'accepted' | 'pending' | 'declined' | null,
// }

// const [trips, setTrips] = useState<Trip[]>([]);

// const tripCards = trips.map((trip) => {
//   return (
//     <div className="trip-card">
//       <h2>{trip.original_location} TO {trip.destination}</h2>
//       <p>{trip.driver_id}</p>
//       <p>{trip.current_passengers}</p>
//     </div>
//   )
// })

// export default function MyRides() {
//   return (
//     <div className="main-height p-4">
//       <div className="w-5/6 h-5/6 ml-auto mr-auto mt-2 flex flex-col">
//         <h1 className="text-4xl font-bold">My Trips</h1>
//         <div className="flex flex-wrap p-4 mt-4 w-fit space-x-5 bg-gray-300">
//           {tripCards}
//         </div>
//       </div>
//     </div>
//   )
// }

export default function MyRides() {
  return (
    <h1>My Rides</h1>
  )
}