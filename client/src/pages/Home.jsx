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
  const [lng, setLng] = useState(-70.9);
  const [lat, setLat] = useState(38.35);
  const [zoom, setZoom] = useState(9);


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
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/trip/getTrips`, {withCredentials: true})
      .then(response => {
        const { friend_trips, public_trips } = response.data;
        setFriendTrips(friend_trips);
        setPublicTrips(public_trips);
      })
      .catch(error => {
        console.log(error)
      })
  }, []);
  // #endregion

  // #region handleTripClick
  const handleTripClick = (trip) => () => {
    console.log(trip);
    directionsRef.current.setOrigin([-104.74598,40.10182]);
    directionsRef.current.setDestination([-105.03299,40.02510]);
  }
  // #endregion


  // #region convert trips to JSX
  const ftList = friendTrips !== null && friendTrips.length > 0 ? (
    friendTrips.map((trip, index) => (
      <button
        key={index}
        className="w-full text-left p-2 sm:p-4 bg-white border border-gray-300 mb-2 sm:mb-3 rounded-lg shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        onClick={handleTripClick(trip)}
      >
        <div>
          <h3 className="text-base sm:text-lg font-semibold mb-1">{trip.original_location} <strong>to</strong> {trip.destination}</h3>
          <p className="text-xs sm:text-sm text-gray-700 mb-1">Driver: {trip.driver.first_name} {trip.driver.last_name} • Trips taken: {trip.driver.trips_taken}</p>
          <p className="text-xs sm:text-sm text-gray-600 mb-1">{FormatDate(trip.leaving_time.toLocaleString())}</p>
          <p className="text-xs sm:text-sm text-gray-800"><strong>Seats Available:</strong> {trip.seats_available}</p>
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
        onClick={handleTripClick(trip)}
      >
        <h3 className="text-base sm:text-lg font-semibold mb-1">{trip.original_location} <strong>to</strong> {trip.destination}</h3>
        <p className="text-xs sm:text-sm text-gray-700 mb-1">Driver: {trip.driver.first_name} • Trips taken: {trip.driver.trips_taken}</p>
        <p className="text-xs sm:text-sm text-gray-600 mb-1">{FormatDate(trip.leaving_time.toLocaleString())}</p>
        <p className="text-xs sm:text-sm text-gray-800"><strong>Seats Available:</strong> {trip.seats_available}</p>
      </button>
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