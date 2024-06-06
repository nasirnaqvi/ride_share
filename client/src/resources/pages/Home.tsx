import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Linebar from '../components/Linebar';

import mapboxgl from 'mapbox-gl';
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

interface Driver {
  first_name: string;
  last_name: string;
  trips_taken: string;
  profile_img: any;
}

interface Trip {
  trip_id: number;
  destination: string;
  original_location: string;
  active: boolean;
  payment_req: boolean;
  leaving_time: Date;
  seats_available: number;
  status: 'accepted' | 'pending' | 'declined' | null;
  driver: Driver; // Nested "driver" interface
}

export default function Home() {

  //Refs
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null);

  //States
  const [friendTrips, setFriendTrips] = useState<Trip[]>([]);
  const [publicTrips, setPublicTrips] = useState<Trip[]>([]);
  const [lng, setLng] = useState(-70.9);
  const [lat, setLat] = useState(38.35);
  const [zoom, setZoom] = useState(9);
  const [searchInput, setSearchInput] = useState('');


  // #region Location-Tracking
  // Initialize map when component mounts
  // useEffect(() => {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition((position) => {
  //       const { longitude, latitude } = position.coords;

  //       // Initialize map if geolocation is provided
  //       mapInstanceRef.current = new mapboxgl.Map({
  //         container: mapContainerRef.current!,
  //         style: 'mapbox://styles/mapbox/streets-v12',
  //         center: [longitude, latitude],
  //         zoom: zoom
  //       });
  //       mapInstanceRef.current!.on('move', () => {
  //         setLng(parseFloat(mapInstanceRef.current!.getCenter().lng.toFixed(4)));
  //         setLat(parseFloat(mapInstanceRef.current!.getCenter().lat.toFixed(4)));
  //         setZoom(parseFloat(mapInstanceRef.current!.getZoom().toFixed(2)));
  //       });

  //       setLng(longitude);
  //       setLat(latitude);
  //     },
  //     (error) => console.log(error));
  //   } else {
  //     // Fallback in case geolocation is not supported
  //     mapInstanceRef.current = new mapboxgl.Map({
  //       container: mapContainerRef.current!,
  //       style: 'mapbox://styles/mapbox/streets-v12',
  //       center: [lng, lat],
  //       zoom: zoom
  //     });
  //     mapInstanceRef.current!.on('move', () => {
  //       setLng(parseFloat(mapInstanceRef.current!.getCenter().lng.toFixed(4)));
  //       setLat(parseFloat(mapInstanceRef.current!.getCenter().lat.toFixed(4)));
  //       setZoom(parseFloat(mapInstanceRef.current!.getZoom().toFixed(2)));
  //     });
  //   }
  // }, []);
  // #endregion


  // #region dates
  const formatDate = (dateTimeString: string) => {
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

  const getOrdinal = (day: number) => {
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
        className="w-full text-left px-1 bg-white border border-gray-300 mb-2 rounded-lg relative hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        onClick={() => console.log('Trip clicked', trip)}
      >
        <div>
          <h3 className="relative text-m font-semibold py-1">{trip.original_location} <strong>to</strong> {trip.destination}</h3>
          <p>Driver: {trip.driver.first_name} {trip.driver.last_name} • Trips taken: {trip.driver.trips_taken}</p>
          <p>{formatDate(trip.leaving_time.toLocaleString())}</p>
          <p><strong>Seats Available:</strong> {trip.seats_available}</p>
        </div>
      </button>
    ))
  ) : (
    <p className="text-center">No friend trips available.</p>
  );

  const ptList = publicTrips !== null && publicTrips.length > 0 ? (
    publicTrips.map((trip, index) => (
      <button
        key={index}
        className="w-full text-left px-1 bg-white border border-gray-300 mb-2 rounded-lg relative hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        onClick={() => console.log('Trip clicked', trip)}
      >
        <h3 className="relative text-m font-semibold py-1">{trip.original_location} <strong>to</strong> {trip.destination}</h3>
        <p>Driver: {trip.driver.first_name} • Trips taken: {trip.driver.trips_taken}</p>
        <p>{formatDate(trip.leaving_time.toLocaleString())}</p>
        <p><strong>Seats Available:</strong> {trip.seats_available}</p>
      </button>
    ))
  ) : (
    <p className="text-center">No public trips available.</p>
  );

  // #endregion


  // #region handle search functions
  function handleSearchChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSearchInput(event.target.value);

    if (friendTrips) {
      setFriendTrips(friendTrips.filter(trip => trip.destination.toLowerCase().includes(event.target.value.toLowerCase())));
    }
    if (publicTrips) {
      setPublicTrips(publicTrips.filter(trip => trip.destination.toLowerCase().includes(event.target.value.toLowerCase())));
    }
  }

  function handleSearch() {
    console.log('Search input:', searchInput);
  }

  // #endregion


  return (
    <div id="main" className="flex flex-col md:flex-row overflow-hidden home-height">
      <div id="map-container" className="relative flex-grow overflow-hidden md:w-3/4 w-full">
        <div id="search-bar" className="rounded-full absolute p-1 sm:p-4 md:p-6 bg-clear z-10 left-1/2 transform -translate-x-1/2 w-5/6 flex items-center">
          <input
            id="search-input"
            type="text"
            placeholder="Where is your next adventure?"
            className="font-serif flex-grow border border-white-300 rounded-l-full py-2 sm:py-3 md:py-4 px-2 sm:px-4 md:px-5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl"
            value={searchInput}
            onChange={handleSearchChange}
          />
          <button
            id="search-button"
            onClick={handleSearch}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 sm:py-3 md:py-4 px-2 sm:px-4 md:px-5 rounded-r-full text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-serif"
          >
            Search
          </button>
        </div>
        {/* <div id="map" ref={mapContainerRef} className="w-full h-full"></div> */}
      </div>
      <div id="panel" className="bg-white-200 p-4 md:w-1/4 w-full md:h-auto h-1/4 overflow-auto">
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