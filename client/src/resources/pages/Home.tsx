import {useRef, useEffect, useState} from 'react';
import axios from 'axios';

import mapboxgl from 'mapbox-gl';
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN

interface Trip {
  trip_id: number;
  diver_id: string;
  destination: string;
  original_location: string;
  active: boolean;
  payment_req: boolean;
  leaving_time: Date;
  max_passengers: number;
  current_passengers: number;
  friendship_status: string;
  driver_first_name: string;
  driver_last_name: string;
  driver_trips_taken: number;
  driver_profile_img: string;
  seats_available: number;
}

export default function Home() {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [lng, setLng] = useState(-70.9);
  const [lat, setLat] = useState(42.35);
  const [zoom, setZoom] = useState(9);
  const [friendTrips, setFriendTrips] = useState<Trip[]>([]);
  const [publicTrips, setPublicTrips] = useState<Trip[]>([]);
  const [searchInput, setSearchInput] = useState('');

  // Initialize map when component mounts
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { longitude, latitude } = position.coords;

          // Initialize map if geolocation is provided
          map.current = new mapboxgl.Map({
            container: mapContainer.current!,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [longitude, latitude],
            zoom: zoom
          });
          map.current!.on('move', () => {
            setLng(parseFloat(map.current!.getCenter().lng.toFixed(4)));
            setLat(parseFloat(map.current!.getCenter().lat.toFixed(4)));
            setZoom(parseFloat(map.current!.getZoom().toFixed(2)));
          });

          setLng(longitude);
          setLat(latitude);
        },
        (error) => console.log(error)
      );
    } else {
      // Fallback in case geolocation is not supported
      map.current = new mapboxgl.Map({
        container: mapContainer.current!,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [lng, lat],
        zoom: zoom
      });
      map.current!.on('move', () => {
        setLng(parseFloat(map.current!.getCenter().lng.toFixed(4)));
        setLat(parseFloat(map.current!.getCenter().lat.toFixed(4)));
        setZoom(parseFloat(map.current!.getZoom().toFixed(2)));
      });
    }
  }, []);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/trip/getTrips`, {withCredentials: true})
      .then(response => {
        setFriendTrips(response.data.friend_trips);
        setPublicTrips(response.data.public_trips);
        console.log(publicTrips)
      })
      .catch(error => {
        console.log(error)
      })
  }, []);

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

  function handleSearch() {
    console.log('Search input:', searchInput);
  }

  const friendTripsComponents = friendTrips !== undefined && friendTrips.length > 0 ? (
    friendTrips.map((trip, index) => (
      <button
        key={index}
        className="w-full text-left px-1 bg-white border border-gray-300 mb-2 rounded-lg relative hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        onClick={() => console.log('Trip clicked', trip)}
      >
        <div>
          <h3 className="relative text-m font-semibold py-1">{trip.original_location} <strong>to</strong> {trip.destination}</h3>
          <p>Driver: {trip.driver_first_name} {trip.driver_last_name} • Trips taken: {trip.driver_trips_taken}</p>
          <p>{formatDate(trip.leaving_time.toLocaleString())}</p>
          <p><strong>Seats Available:</strong> {trip.seats_available}</p>
        </div>
      </button>
    ))
  ) : (
    <p className="text-center">No friend trips available.</p>
  );

  const publicTripsComponents = publicTrips !== undefined && publicTrips.length > 0 ? (
    publicTrips.map((trip, index) => (
      <button
        key={index}
        className="w-full text-left px-1 bg-white border border-gray-300 mb-2 rounded-lg relative hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        onClick={() => console.log('Trip clicked', trip)}
      >
        <h3 className="relative text-m font-semibold py-1">{trip.original_location} <strong>to</strong> {trip.destination}</h3>
        <p>Driver: {trip.driver_first_name} • Trips taken: {trip.driver_trips_taken}</p>
        <p>{formatDate(trip.leaving_time.toLocaleString())}</p>
        <p><strong>Seats Available:</strong> {trip.seats_available}</p>
      </button>
    ))
  ) : (
    <p className="text-center">No public trips available.</p>
  );

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
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <div> 
          </div>
          <button
            id="search-button"
            onClick={handleSearch}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 sm:py-3 md:py-4 px-2 sm:px-4 md:px-5 rounded-r-full text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-serif"
          >
            Search
          </button>
        </div>
        <div id="map" ref={mapContainer} className="w-full h-full"></div>
      </div>
      <div id="panel" className="bg-white-200 p-4 md:w-1/4 w-full md:h-auto h-1/4 overflow-auto">
        <div>
          <div className="relative">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-black-300"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-4 text-lg font-bold">Friend Trips</span>
            </div>
          </div>
          <ul>
            {friendTripsComponents}
          </ul>
          <div className="relative">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-black-300"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-4 text-lg font-bold">Public Trips</span>
            </div>
          </div>
          <ul>
            {publicTripsComponents}
          </ul>
        </div>
      </div>
    </div>
  );
}

