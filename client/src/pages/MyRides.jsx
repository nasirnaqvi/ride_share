import { useState, useEffect } from 'react';
import axios from 'axios';
import FormatDate from '../utility/FormatDate';

export default function MyRides() {

	const [friendTrips, setFriendTrips] = useState([]);
	const [publicTrips, setPublicTrips] = useState([]);

	useEffect(() => {
		axios.get(`${import.meta.env.VITE_BACKEND_URL}/trip/getFriendTrips`, {withCredentials: true})
		  .then(response => {
			const friend_trips = response.data;
			setFriendTrips(friend_trips);
		  })
		  .catch(error => {
			console.log(error)
		  })
	  }, []);
	
	  useEffect(() => {
		axios.get(`${import.meta.env.VITE_BACKEND_URL}/trip/getPublicTrips`)
		  .then(response => {
			const public_trips = response.data;
			setPublicTrips(public_trips);
		  })
		  .catch(error => {
			console.log(error)
		  })
	  }, []);

	const ftList = friendTrips !== null && friendTrips.length > 0 ? (
		friendTrips.map((trip, index) => (
			<button
				key={index}
				className="w-full text-left p-2 sm:p-4 bg-white border border-gray-300 mb-2 sm:mb-3 rounded-lg shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
				onClick={() => console.log('Trip clicked', trip)}
			>
				<div>
					<h3 className="text-base sm:text-lg md:text-xl font-semibold mb-1">{trip.original_location} <strong>to</strong> {trip.destination}</h3>
					<p className="text-xs sm:text-sm md:text-base text-gray-700 mb-1">Driver: {trip.first_name} {trip.last_name} • Trips taken: {trip.trips_taken}</p>
					<p className="text-xs sm:text-sm md:text-base text-gray-600 mb-1">{FormatDate(trip.leaving_time.toLocaleString())}</p>
					<p className="text-xs sm:text-sm md:text-base text-gray-800"><strong>Seats Available:</strong> {trip.max_passengers - trip.current_passengers}</p>
				</div>
			</button>
		))
	) : (
		<p className="text-center text-gray-600">No friend trips available.</p>
	);
	
	const ptList = publicTrips !== null && publicTrips.length > 0 ? (
		publicTrips.map((trip, index) => (
			<button
				key={index}
				className="w-full text-left p-2 sm:p-4 bg-white border border-gray-300 mb-2 sm:mb-3 rounded-lg shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
				onClick={() => console.log('Trip clicked', trip)}
			>
				<h3 className="text-base sm:text-lg md:text-xl font-semibold mb-1">{trip.original_location} <strong>to</strong> {trip.destination}</h3>
				<p className="text-xs sm:text-sm md:text-base text-gray-700 mb-1">Driver: {trip.first_name} {trip.last_name} • Trips taken: {trip.trips_taken}</p>
				<p className="text-xs sm:text-sm md:text-base text-gray-600 mb-1">{FormatDate(trip.leaving_time.toLocaleString())}</p>
				<p className="text-xs sm:text-sm md:text-base text-gray-800"><strong>Seats Available:</strong> {trip.max_passengers - trip.current_passengers}</p>
			</button>
		))
	) : (
		<p className="text-center text-gray-600">No public trips available.</p>
	);
	
	return (
		<div className="p-4 sm:p-6 md:p-8 font-sans font-medium">
			<h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3">My Rides</h1>
			<hr />
	
			<div className="md:flex md:space-x-4">
				<div className="md:w-1/2">
					<h2 className="text-xl md:text-2xl mt-3 mb-1">Pending Trips:</h2>
					<div className="max-h-54 md:max-h-96 overflow-auto scrollbar p-2 sm:p-4">
						{ptList}
					</div>
				</div>
	
				<div className="md:w-1/2">
					<h2 className="text-xl md:text-2xl mt-3 mb-1">Completed Trips:</h2>
					<div className="max-h-54 md:max-h-96 overflow-auto scrollbar p-2 sm:p-4">
						{ftList}
					</div>
				</div>
			</div>
		</div>
	);
}