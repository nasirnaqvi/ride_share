import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Linebar from '../components/Linebar';
import FormatDate from '../utility/FormatDate';

import mapboxgl from 'mapbox-gl';
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css';


export default function Home() {

  //Refs
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const directionsRef = useRef(null);

  //States
  const [friendTrips, setFriendTrips] = useState([]);
  const [publicTrips, setPublicTrips] = useState([]);
  const [tripRequests, setTripRequests] = useState([]);
  const [lng, setLng] = useState(-70.9);
  const [lat, setLat] = useState(38.35);
  const [zoom, setZoom] = useState(9);
  const [tripSelected, setTripSelected] = useState(null);
  const [tripAddOpen, setTripAddOpen] = useState(false);
  const [tripForm, setTripForm] = useState(null);


  // #region Location-Tracking
  // Initialize map when component mounts
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { longitude, latitude } = position.coords;

        // Initialize map if geolocation is provided
        mapInstanceRef.current = new mapboxgl.Map({
          container: mapContainerRef.current,
          style: 'mapbox://styles/mapbox/streets-v12',
          center: [longitude, latitude],
          zoom: zoom
        });
        mapInstanceRef.current.on('move', () => {
          setLng(parseFloat(mapInstanceRef.current.getCenter().lng.toFixed(4)));
          setLat(parseFloat(mapInstanceRef.current.getCenter().lat.toFixed(4)));
          setZoom(parseFloat(mapInstanceRef.current.getZoom().toFixed(2)));
        });

        mapInstanceRef.current.addControl(new mapboxgl.NavigationControl());

        mapInstanceRef.current.addControl(new mapboxgl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true
          },
          trackUserLocation: true
        }));

        directionsRef.current = new MapboxDirections({
          accessToken: mapboxgl.accessToken,
          profile: 'mapbox/driving',
          controls: {
            instructions: false,
            profileSwitcher: false
          }
        });

        mapInstanceRef.current.addControl(directionsRef.current, 'top-left');

        setLng(longitude);
        setLat(latitude);
      },
      (error) => console.log(error));
    } else {
      // Fallback in case geolocation is not supported
      mapInstanceRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [lng, lat],
        zoom: zoom
      });
      mapInstanceRef.current.on('move', () => {
        setLng(parseFloat(mapInstanceRef.current.getCenter().lng.toFixed(4)));
        setLat(parseFloat(mapInstanceRef.current.getCenter().lat.toFixed(4)));
        setZoom(parseFloat(mapInstanceRef.current.getZoom().toFixed(2)));
      });

      mapInstanceRef.current.addControl(new mapboxgl.NavigationControl());

      mapInstanceRef.current.addControl(new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true
      }));

      directionsRef.current = new MapboxDirections({
        accessToken: mapboxgl.accessToken,
        profile: 'mapbox/driving',
        controls: {
          instructions: false,
          profileSwitcher: false
        }
      });

      mapInstanceRef.current.addControl(directionsRef.current, 'top-left');
    }
  }, []);
  // #endregion

  // #region getting trips
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
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/trip/getPublicTrips`, {withCredentials: true})
      .then(response => {
        const public_trips = response.data;
        setPublicTrips(public_trips);
      })
      .catch(error => {
        console.log(error)
      })
  }, []);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/trip/getTripRequests`, {withCredentials: true})
      .then(response => {
        const trip_requests = response.data;
        setTripRequests(trip_requests);
      })
      .catch(error => {
        console.log(error)
      })
  }, []);
  // #endregion

  // #region handleTripClick

  const handleTripClick = (trip) => {
    if (tripSelected === trip) {
      setTripSelected(null);
      directionsRef.current.removeRoutes();
      directionsRef.current.container.children[0].children[0].children[0].children[0].children[1].children[0].children[1].value = '';
      directionsRef.current.container.children[0].children[0].children[0].children[2].children[1].children[0].children[1].value = '';
    }
    else {
      setTripSelected(trip);
      directionsRef.current.setOrigin(trip.original_location);
      directionsRef.current.setDestination(trip.destination_location);
    }
  }

  const handleTripJoin = (e, trip) => {
    e.stopPropagation();

    axios.post(`${import.meta.env.VITE_BACKEND_URL}/trip/requestTrip`, {trip_id: trip.trip_id}, {withCredentials: true})
      .then(response => {
        setTripRequests([...tripRequests, {trip_id: trip.trip_id, request_status: 'pending'}]);
      })
      .catch(error => {
        console.log(error);
      });
  }

  const handleTripAddClick = () => {
    const origin = directionsRef.current.container.children[0].children[0].children[0].children[0].children[1].children[0].children[1].value;
    const destination_location = directionsRef.current.container.children[0].children[0].children[0].children[2].children[1].children[0].children[1].value;

    if (origin === '' || destination_location === '') {
      return;
    }

    setTripForm({
      origin: origin,
      destination_location: destination_location,
      leaving_time: new Date().toISOString().slice(0, 16),
      max_passengers: 1,
      trip_type: 'public'
    });
    setTripAddOpen(true);
  }

  const handleCloseFormClick = () => {
    setTripAddOpen(false);
  }

  const handleTripAdd = (e) => {
    e.preventDefault();

    axios.post(`${import.meta.env.VITE_BACKEND_URL}/trip/addTrip`, tripForm, {withCredentials: true})
      .then(response => {
        setTripAddOpen(false);
        setTripForm(null);
      })
      .catch(error => {
        console.log(error);
      });
  }

  const handleTripFormChange = (e) => {
    const { name, value } = e.target;
    setTripForm({ ...tripForm, [name]: value });

  }
  // #endregion

  // #region convert trips to JSX
  const ftList = friendTrips !== null && friendTrips.length > 0 ? (
    friendTrips.map((trip, index) => (
      <div key={index} className="mb-2 sm:mb-3">
        <button
          className="w-full text-left p-2 sm:p-4 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={() => handleTripClick(trip)}
        >
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-1">
              {trip.original_location} <strong>to</strong> {trip.destination_location}
            </h3>
            <p className="text-xs sm:text-sm text-gray-700 mb-1">
              Driver: {trip.first_name} {trip.last_name} • Trips taken: {trip.trips_taken}
            </p>
            <p className="text-xs sm:text-sm text-gray-600 mb-1">
              {FormatDate(trip.leaving_time.toLocaleString())}
            </p>
            <p className="text-xs sm:text-sm text-gray-800">
              <strong>Seats Available:</strong> {trip.max_passengers - trip.current_passengers}
            </p>
          </div>
          {tripSelected === trip && (
            <>
              {tripRequests.some(request => request.trip_id === trip.trip_id && request.request_status === 'pending') && (  
                <a
                  className="mt-2 inline-block px-4 py-2 bg-yellow-500 text-white font-semibold text-sm leading-tight rounded-lg shadow-sm"
                  onClick={(e) => e.stopPropagation()}
                >
                  Pending
                </a>
              )}
              {tripRequests.some(request => request.trip_id === trip.trip_id && request.request_status === 'accepted') && (  
                <a
                  className="mt-2 inline-block px-4 py-2 bg-green-500 text-white font-semibold text-sm leading-tight rounded-lg shadow-sm"
                  onClick={(e) => e.stopPropagation()}
                >
                  Accepted
                </a>
              )}
              {tripRequests.some(request => request.trip_id === trip.trip_id && request.request_status === 'rejected') && (  
                <a
                  className="mt-2 inline-block px-4 py-2 bg-red-500 text-white font-semibold text-sm leading-tight rounded-lg shadow-sm"
                  onClick={(e) => e.stopPropagation()}
                >
                  Rejected
                </a>
              )}
              {!tripRequests.some(request => request.trip_id === trip.trip_id && (request.request_status === 'pending' || request.request_status === 'accepted' || request.request_status === 'rejected')) && (
                <a
                  className="mt-2 inline-block px-4 py-2 bg-blue-500 text-white font-semibold text-sm leading-tight rounded-lg shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  onClick={(e) => handleTripJoin(e, trip)}
                >
                  Join
                </a>
              )}
            </>
          )}
        </button>
      </div>
    ))
  ) : (
    <p className="text-center text-gray-600">No friend trips available.</p>
  );
  
  const ptList = publicTrips !== null && publicTrips.length > 0 ? (
    publicTrips.map((trip, index) => (
      <div key={index} className="mb-2 sm:mb-3">
        <button
          className="w-full text-left p-2 sm:p-4 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={() => handleTripClick(trip)}
        >
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-1">
              {trip.original_location} <strong>to</strong> {trip.destination_location}
            </h3>
            <p className="text-xs sm:text-sm text-gray-700 mb-1">
              Driver: {trip.first_name} {trip.last_name} • Trips taken: {trip.trips_taken}
            </p>
            <p className="text-xs sm:text-sm text-gray-600 mb-1">
              {FormatDate(trip.leaving_time.toLocaleString())}
            </p>
            <p className="text-xs sm:text-sm text-gray-800">
              <strong>Seats Available:</strong> {trip.max_passengers - trip.current_passengers}
            </p>
          </div>
          {tripSelected === trip && (
            <>
              {tripRequests.some(request => request.trip_id === trip.trip_id && request.request_status === 'pending') && (  
                <a
                  className="mt-2 inline-block px-4 py-2 bg-yellow-500 text-white font-semibold text-sm leading-tight rounded-lg shadow-sm"
                  onClick={(e) => e.stopPropagation()}
                >
                  Pending
                </a>
              )}
              {tripRequests.some(request => request.trip_id === trip.trip_id && request.request_status === 'accepted') && (  
                <a
                  className="mt-2 inline-block px-4 py-2 bg-green-500 text-white font-semibold text-sm leading-tight rounded-lg shadow-sm"
                  onClick={(e) => e.stopPropagation()}
                >
                  Accepted
                </a>
              )}
              {tripRequests.some(request => request.trip_id === trip.trip_id && request.request_status === 'rejected') && (  
                <a
                  className="mt-2 inline-block px-4 py-2 bg-red-500 text-white font-semibold text-sm leading-tight rounded-lg shadow-sm"
                  onClick={(e) => e.stopPropagation()}
                >
                  Rejected
                </a>
              )}
              {!tripRequests.some(request => request.trip_id === trip.trip_id && (request.request_status === 'pending' || request.request_status === 'accepted' || request.request_status === 'rejected')) && (
                <a
                  className="mt-2 inline-block px-4 py-2 bg-blue-500 text-white font-semibold text-sm leading-tight rounded-lg shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  onClick={(e) => handleTripJoin(e, trip)}
                >
                  Join
                </a>
              )}
            </>
          )}
        </button>
      </div>
    ))
  ) : (
    <p className="text-center text-gray-600">No public trips available.</p>
  );
  // #endregion

  return (
    <div id="main" className="flex flex-col lg:flex-row overflow-hidden home-sm md:home-md">
      <div id="map-container" className="relative flex-grow overflow-hidden lg:w-3/4 w-full">
        <div id="map" ref={mapContainerRef} className="w-full h-full"></div>
        <button
          className="absolute top-24 left-28 px-4 py-2 bg-blue-500 text-white font-semibold text-sm leading-tight rounded-lg shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          onClick={handleTripAddClick}
        >
          Add Trip
        </button>
      </div>
      <div id="panel" className="bg-white p-4 lg:w-1/4 w-full lg:h-auto h-1/4 overflow-auto">
        <div>
          <Linebar name="Friend Trips" />
          <ul>
            {ftList}
          </ul>
          <Linebar name="Public Trips" />
          <ul>
            {ptList}
          </ul>
        </div>
      </div>
      {tripAddOpen && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
        >
          <div className="relative px-8 py-6 bg-white text-black rounded-lg shadow-md">
            <button
              className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 focus:outline-none text-3xl"
              onClick={handleCloseFormClick}
            >
              &times;
            </button>
            <form onSubmit={(e) => handleTripAdd(e)}>
              <div className="mb-4">
                <label htmlFor="origin" className="block text-sm font-medium text-gray-700">Origin</label>
                <input
                  type="text"
                  name="origin"
                  className="mt-1 px-4 py-2 w-full bg-gray-200 text-gray-500 rounded-lg focus:outline-none cursor-not-allowed"
                  placeholder="Enter origin"
                  value={tripForm.origin}
                  onChange={handleTripFormChange}
                  disabled
                />
              </div>
              <div className="mb-4">
                <label htmlFor="destination" className="block text-sm font-medium text-gray-700">Destination</label>
                <input
                  type="text"
                  name="destination"
                  className="mt-1 px-4 py-2 w-full bg-gray-200 text-gray-500 rounded-lg focus:outline-none cursor-not-allowed"
                  placeholder="Enter destination"
                  value={tripForm.destination_location}
                  onChange={handleTripFormChange}
                  disabled
                />
              </div>
              <div className="mb-4">
                <label htmlFor="leaving_time" className="block text-sm font-medium text-gray-700">Leaving Time</label>
                <input
                  type="datetime-local"
                  name="leaving_time"
                  className="mt-1 px-4 py-2 w-full bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={tripForm.leaving_time}
                  onChange={handleTripFormChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="max_passengers" className="block text-sm font-medium text-gray-700">Max Passengers</label>
                <input
                  type="number"
                  name="max_passengers"
                  className="mt-1 px-4 py-2 w-full bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                  value={tripForm.max_passengers}
                  onChange={handleTripFormChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="trip_type" className="block text-sm font-medium text-gray-700">Trip Type</label>
                <select
                  className="mt-1 px-4 py-2 w-full bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  name="trip_type"
                  value={tripForm.trip_type}
                  onChange={handleTripFormChange}
                  required
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                </select>
              </div>
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white font-semibold text-sm leading-tight rounded-lg shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}