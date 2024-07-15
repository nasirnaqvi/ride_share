import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Linebar from '../components/Linebar';

import mapboxgl from 'mapbox-gl';
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css';


export default function Home() {

  //Refs
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  //States
  const [friendTrips, setFriendTrips] = useState([]);
  const [publicTrips, setPublicTrips] = useState([]);
  const [lng, setLng] = useState(-70.9);
  const [lat, setLat] = useState(38.35);
  const [zoom, setZoom] = useState(9);
  const [searchInput, setSearchInput] = useState('');


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

        mapInstanceRef.current.addControl(new MapboxDirections({
          accessToken: mapboxgl.accessToken,
          profile: 'mapbox/driving',
          controls: {
            instructions: false,
            profileSwitcher: false
          }
        }), 'top-left');

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

      mapInstanceRef.current.addControl(new MapboxDirections({
        accessToken: mapboxgl.accessToken,
        profile: 'mapbox/driving',
        controls: {
          instructions: false,
          profileSwitcher: false
        }
      }), 'top-left');
    }
  }, []);
  // #endregion

  // #region dates
  const formatDate = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const month = date.toLocaleString('default', { month: 'long' });
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const amOrPm = hours >= 12 ? 'pm' : 'am';
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;

    return `${month} ${day}${getOrdinal(day)} • ${formattedHours}:${formattedMinutes} ${amOrPm}`;
  };

  const getOrdinal = (day) => {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1: return "st";
      case 2: return "nd";
      case 3: return "rd";
      default: return "th";
    }
  }

  // #endregion


  // Fetch trips data from backend when page loads
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


  // #region convert trips to JSX
  const ftList = friendTrips !== null && friendTrips.length > 0 ? (
    friendTrips.map((trip, index) => (
      <button
        key={index}
        className="w-full text-left p-2 sm:p-4 bg-white border border-gray-300 mb-2 sm:mb-3 rounded-lg shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        onClick={() => console.log('Trip clicked', trip)}
      >
        <div>
          <h3 className="text-base sm:text-lg font-semibold mb-1">{trip.original_location} <strong>to</strong> {trip.destination}</h3>
          <p className="text-xs sm:text-sm text-gray-700 mb-1">Driver: {trip.driver.first_name} {trip.driver.last_name} • Trips taken: {trip.driver.trips_taken}</p>
          <p className="text-xs sm:text-sm text-gray-600 mb-1">{formatDate(trip.leaving_time.toLocaleString())}</p>
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
        onClick={() => console.log('Trip clicked', trip)}
      >
        <h3 className="text-base sm:text-lg font-semibold mb-1">{trip.original_location} <strong>to</strong> {trip.destination}</h3>
        <p className="text-xs sm:text-sm text-gray-700 mb-1">Driver: {trip.driver.first_name} • Trips taken: {trip.driver.trips_taken}</p>
        <p className="text-xs sm:text-sm text-gray-600 mb-1">{formatDate(trip.leaving_time.toLocaleString())}</p>
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