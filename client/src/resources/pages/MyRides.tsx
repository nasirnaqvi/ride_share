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
    <div className="p-4 font-sans font-medium">
      <h1 className="text-2xl font-bold mb-1">My Rides</h1>
      <hr />

      <h2 className="text-xl mt-3 mb-1">Pending Trips:</h2>
      <div className="max-h-52 overflow-auto scrollbar">
        <button
          className="w-full text-left px-1 bg-white border border-gray-300 mb-2 rounded-lg relative hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <h3 className="relative text-m font-semibold py-1">Boulder <strong>to</strong> Denver</h3>
          <p>Driver: Jeremy • Trips taken: 2</p>
          <p>Date</p>
          <p><strong>Seats Available:</strong> 2</p>
        </button>
        <button
          className="w-full text-left px-1 bg-white border border-gray-300 mb-2 rounded-lg relative hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <h3 className="relative text-m font-semibold py-1">Boulder <strong>to</strong> Denver</h3>
          <p>Driver: Jeremy • Trips taken: 2</p>
          <p>Date</p>
          <p><strong>Seats Available:</strong> 2</p>
        </button>
        <button
          className="w-full text-left px-1 bg-white border border-gray-300 mb-2 rounded-lg relative hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <h3 className="relative text-m font-semibold py-1">Boulder <strong>to</strong> Denver</h3>
          <p>Driver: Jeremy • Trips taken: 2</p>
          <p>Date</p>
          <p><strong>Seats Available:</strong> 2</p>
        </button>
      </div>

      <h2 className="text-xl mt-3 mb-1">Completed Trips:</h2>
      <div className="max-h-52 overflow-auto scrollbar">
        <button
          className="w-full text-left px-1 bg-white border border-gray-300 mb-2 rounded-lg relative hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <h3 className="relative text-m font-semibold py-1">Boulder <strong>to</strong> Denver</h3>
          <p>Driver: Jeremy • Trips taken: 2</p>
          <p>Date</p>
          <p><strong>Seats Available:</strong> 2</p>
        </button>
        <button
          className="w-full text-left px-1 bg-white border border-gray-300 mb-2 rounded-lg relative hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <h3 className="relative text-m font-semibold py-1">Boulder <strong>to</strong> Denver</h3>
          <p>Driver: Jeremy • Trips taken: 2</p>
          <p>Date</p>
          <p><strong>Seats Available:</strong> 2</p>
        </button>
      </div>
    </div>
  )
}