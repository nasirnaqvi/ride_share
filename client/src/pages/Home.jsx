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
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/trip/getPublicTrips`)
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
    }
    else {
      setTripSelected(trip);
      directionsRef.current.setOrigin(trip.original_location);
      directionsRef.current.setDestination(trip.destination);
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
              {trip.original_location} <strong>to</strong> {trip.destination}
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
              {trip.original_location} <strong>to</strong> {trip.destination}
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
    </div>
  );
}