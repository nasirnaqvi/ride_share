import { useState, useEffect } from 'react';
import axios from 'axios';
import FormatDate, {formatDateTimeLocal} from '../utility/FormatDate';

export default function MyRides(props) {

	const [rideRequests, setRideRequests] = useState([]);
	const [pendingTrips, setPendingTrips] = useState([]);
	const [completedTrips, setCompletedTrips] = useState([]);
	const [acceptedOrRejected, setAcceptedOrRejected] = useState(false);
	const [tripViewOpen, setTripViewOpen] = useState(false);
	const [tripDetails, setTripDetails] = useState({});
	const [tripDeleted, setTripDeleted] = useState(false);

	useEffect(() => {
		axios.get(`${import.meta.env.VITE_BACKEND_URL}/trip/getRideRequests`, {withCredentials: true})
		  .then(response => {
			setRideRequests(response.data);
		  })
		  .catch(error => {
			console.log(error)
		  })
	  }, [acceptedOrRejected]);

	useEffect(() => {
		axios.get(`${import.meta.env.VITE_BACKEND_URL}/trip/getPendingTrips`, {withCredentials: true})
		  .then(response => {
			setPendingTrips(response.data);
		  })
		  .catch(error => {
			console.log(error)
		  })
	  }, [tripDeleted]);
	
	useEffect(() => {
		axios.get(`${import.meta.env.VITE_BACKEND_URL}/trip/getCompletedTrips`, {withCredentials: true})
		  .then(response => {
			setCompletedTrips(response.data);
		  })
		  .catch(error => {
			console.log(error)
		  })
	}, [tripDeleted]);

	const handleRequestAccept = (request) => {
		axios.post(`${import.meta.env.VITE_BACKEND_URL}/trip/acceptRequest`, {trip_id: request.trip_id, requester_id: request.requester_id})
		  .then(response => {
			setAcceptedOrRejected(prevAcceptedOrRejected => !prevAcceptedOrRejected)
			props.acceptRide()
		  })
		  .catch(error => {
			console.log(error)
		  })
	};

	const handleRequestReject = (request) => {
		axios.post(`${import.meta.env.VITE_BACKEND_URL}/trip/rejectRequest`, {trip_id: request.trip_id, requester_id: request.requester_id})
		  .then(response => {
			setAcceptedOrRejected(prevAcceptedOrRejected => !prevAcceptedOrRejected);
		  })
		  .catch(error => {
			console.log(error)
		  })
	};

	const viewTripDetails = (trip) => {
		setTripViewOpen(true);
		setTripDetails(trip);
	};

	const handleBackgroundClick = () => {
		setTripViewOpen(false);
		setTripDetails({});
	};

	const handleDeleteTrip = (trip) => {
		axios.post(`${import.meta.env.VITE_BACKEND_URL}/trip/deleteTrip`, {trip_id: trip.trip_id})
		  .then(response => {
			setTripViewOpen(false);
			setTripDetails({});
			setTripDeleted(prevTripDeleted => !prevTripDeleted);
		  })
		  .catch(error => {
			console.log(error)
		  })
	};

	const rrList = rideRequests !== null && rideRequests.length > 0 ? (
		<div className="flex flex-row space-x-4">
		  {rideRequests.map((request, index) => (
			<div
			  key={index}
			  className="flex-shrink-0 w-64 bg-white border border-gray-300 rounded-lg shadow-sm p-4 h-full flex flex-col justify-between"
			>
			  <div className="flex items-center mb-2">
				<img
				  src={request.profile_img ? request.profile_img : "/images/default_profile_pic.jpg"}
				  alt={`${request.first_name} ${request.last_name}`}
				  className="w-10 h-10 rounded-full mr-2"
				/>
				<div className="flex-1 min-w-0">
				  <h3 className="text-sm font-semibold truncate">{request.first_name} {request.last_name}</h3>
				  <p className="text-xs text-gray-600 truncate">{request.original_location} <strong>to</strong> {request.destination}</p>
				</div>
			  </div>
			  <p className="text-xs text-gray-700 mb-1">Trips taken: {request.trips_taken}</p>
			  <p className="text-xs text-gray-600 mb-1">{FormatDate(request.leaving_time.toLocaleString())}</p>
			  <p className="text-xs text-gray-800 mb-2"><strong>Seats Available:</strong> {request.max_passengers - request.current_passengers}</p>
			  <div className="flex justify-center space-x-1">
				<button
				  className="px-2 py-1 bg-green-500 text-white text-xs rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
				  onClick={() => handleRequestAccept(request)}
				>
				  Accept
				</button>
				<button
				  className="px-2 py-1 bg-red-500 text-white text-xs rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
				  onClick={() => handleRequestReject(request)}
				>
				  Reject
				</button>
			  </div>
			</div>
		  ))}
		</div>
	  ) : (
		<p className="text-center text-gray-600">No ride requests available.</p>
	  );
	  
	  const ptList = pendingTrips !== null && pendingTrips.length > 0 ? (
		pendingTrips.map((trip, index) => (
		  <div
			key={index}
			className="w-full xl:w-1/2 p-2"
		  >
			<div className="bg-white border border-gray-300 rounded-lg shadow-sm p-4 h-full flex flex-col justify-between">
			  <div className="flex-1 min-w-0 mb-2">
				<h3 className="text-sm font-semibold truncate">{trip.original_location} <strong>to</strong> {trip.destination}</h3>
				<p className="text-xs text-gray-600 truncate">Driver: {trip.first_name} {trip.last_name} • Trips taken: {trip.trips_taken}</p>
			  </div>
			  <p className="text-xs text-gray-700 mb-1">{FormatDate(trip.leaving_time.toLocaleString())}</p>
			  <p className="text-xs text-gray-800 mb-2"><strong>Seats Available:</strong> {trip.max_passengers - trip.current_passengers}</p>
			  <button
				className="px-2 py-1 mx-auto bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
				onClick={() => viewTripDetails(trip)}
			  >
				View Details
			  </button>
			</div>
		  </div>
		))
	  ) : (
		<p className="text-center text-gray-600">No friend trips available.</p>
	  );
	  
	  const ctList = completedTrips !== null && completedTrips.length > 0 ? (
		completedTrips.map((trip, index) => (
		  <div
			key={index}
			className="w-full xl:w-1/2 p-2"
		  >
			<div className="bg-white border border-gray-300 rounded-lg shadow-sm p-4 h-full flex flex-col justify-between">
			  <div className="flex-1 min-w-0 mb-2">
				<h3 className="text-sm font-semibold truncate">{trip.original_location} <strong>to</strong> {trip.destination}</h3>
				<p className="text-xs text-gray-600 truncate">Driver: {trip.first_name} {trip.last_name} • Trips taken: {trip.trips_taken}</p>
			  </div>
			  <p className="text-xs text-gray-700 mb-1">{FormatDate(trip.leaving_time.toLocaleString())}</p>
			  <p className="text-xs text-gray-800 mb-2"><strong>Seats Available:</strong> {trip.max_passengers - trip.current_passengers}</p>
			  <button
				className="px-2 py-1 mx-auto bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
				onClick={() => viewTripDetails(trip)}
			  >
				View Details
			  </button>
			</div>
		  </div>
		))
	  ) : (
		<p className="text-center text-gray-600">No public trips available.</p>
	  );
	
	return (
		<div className="p-4 sm:p-6 md:p-8 font-sans font-medium">
			<h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3">My Rides</h1>
			<hr />

			<div>
				<h2 className="text-xl md:text-2xl mt-3 mb-1">Ride Requests:</h2>
				<div className="flex flex-row max-h-54 md:max-h-96 overflow-x-auto scrollbar p-2 sm:p-4 space-x-2">
					{rrList}
				</div>
			</div>

			<div className="md:flex md:space-x-4">
				<div className="md:w-1/2">
					<h2 className="text-xl md:text-2xl mt-3 mb-1">Pending Trips:</h2>
					<div className="xl:flex xl:flex-wrap max-h-54 md:max-h-96 overflow-auto scrollbar p-2 sm:p-4">
						{ptList}
					</div>
				</div>
	
				<div className="md:w-1/2">
					<h2 className="text-xl md:text-2xl mt-3 mb-1">Completed Trips:</h2>
					<div className="xl:flex xl:flex-wrap max-h-54 md:max-h-96 overflow-auto scrollbar p-2 sm:p-4">
						{ctList}
					</div>
				</div>
			</div>

			{tripViewOpen && (
				<div
					className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
					onClick={handleBackgroundClick}
				>
					<div
						className="px-8 py-6 bg-white text-black rounded-lg shadow-md"
						onClick={(e) => e.stopPropagation()}
					>
						<div className="mb-4">
							<label className="block text-sm font-medium text-gray-700">Origin</label>
							<input
								type="text"
								className="mt-1 px-4 py-2 w-full bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
								value={tripDetails.original_location}
								disabled
							/>
						</div>
						<div className="mb-4">
							<label className="block text-sm font-medium text-gray-700">Destination</label>
							<input
								type="text"
								className="mt-1 px-4 py-2 w-full bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
								value={tripDetails.destination}
								disabled
							/>
						</div>
						<div className="mb-4">
							<label className="block text-sm font-medium text-gray-700">Leaving Time</label>
							<input
								type="datetime-local"
								className="mt-1 px-4 py-2 w-full bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
								value={formatDateTimeLocal(tripDetails.leaving_time)}
								disabled
							/>
						</div>
						<div className="mb-4">
							<label className="block text-sm font-medium text-gray-700">Max Passengers</label>
							<input
								type="number"
								className="mt-1 px-4 py-2 w-full bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
								value={tripDetails.max_passengers}
								disabled
							/>
						</div>
						<div className="mb-4">
							<label className="block text-sm font-medium text-gray-700">Trip Type</label>
							<select
								className="mt-1 px-4 py-2 w-full bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
								value={tripDetails.trip_type}
								disabled
							>
							<option value="public">Public</option>
							<option value="private">Private</option>
							</select>
						</div>
						<div className="flex justify-center">
							<button
								className="px-4 py-2 bg-red-500 text-white font-semibold text-sm leading-tight rounded-lg shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
								onClick={() => handleDeleteTrip(tripDetails)}
							>
								Delete Trip
							</button>
						</div>
					</div>
				</div>
				)}
		</div>
	);
}