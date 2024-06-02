import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Map, { GeolocateControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import Linebar from '../components/Linebar';


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
  const search = () => {
    // Your search logic here
  };

  const [friendTrips, setFriendTrips] = useState<Trip[]>([]);
  const [publicTrips, setPublicTrips] = useState<Trip[]>([]);
  const [locationChanged, setLocationChanged] = useState<boolean>(false);

  const [location, setLocation] = useState<[number, number]>([37.8, -122.4]); // [latitude, longitude]
  //Runs everytime page is rendered
  useEffect(() => {
    const successCallback = (position: GeolocationPosition) => {
      const { latitude, longitude } = position.coords;
      setLocation([latitude, longitude]);
      console.log("location is ", position.coords);
    };

    const errorCallback = (error: GeolocationPositionError) => {
      console.error('Error getting geolocation:', error);
    };
    const options = {
      enableHighAccuracy: true,
      timeout: 3000,
      maximumAge: 0
    };
    navigator.geolocation.getCurrentPosition(successCallback, errorCallback, options);
    setLocationChanged(true);
  }, []);

  const [mapComponent, setMapComponent] = useState<JSX.Element | null>(null);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    if (locationChanged) {
      timeoutId = setTimeout(() => {
        const newMapComponent = (
          <div>
          </div>

          // <Map
          //   mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
          //   initialViewState={{
          //     latitude: location[0],
          //     longitude: location[1],
          //     zoom: 8
          //   }}
          //   mapStyle="mapbox://styles/mapbox/satellite-streets-v12"
          //   style={{ width: '100%', height: '100%' }}
          // >
          //   <GeolocateControl
          //     positionOptions={{ enableHighAccuracy: true }}
          //     trackUserLocation={false}
          //     showUserLocation={true}
          //   />
          // </Map>

        );
        setMapComponent(newMapComponent);
      }, 3100);
    }

    // Cleanup function to clear the timeout if the location changes again or component unmounts
    return () => clearTimeout(timeoutId);

  }, [locationChanged, location]);
  ;


  //Run on every render, the dependency array with state means that the code will run everytime this component mounts as well as when these state variables change and the value will be captured by the
  useEffect(() => {

    const fetchData = async () => {
      console.log("fetching data");
      try {
        console.log("HERE");
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/trip/getTrips`, { withCredentials: true });
        console.log("HERE1");
        const { friend_trips, public_trips } = response.data;
        console.log("HERE2");
        if (friend_trips?.length) setFriendTrips(friend_trips);
        console.log(public_trips);
        console.log("public trips", public_trips.length);
        if (public_trips?.length) setPublicTrips(public_trips);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
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
  const ftList = friendTrips !== undefined && friendTrips.length > 0 ? (
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




  const ptList = publicTrips !== undefined && publicTrips.length > 0 ? (
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



  console.log("being called again");
  return (
    <div id="main" className="flex flex-col md:flex-row overflow-hidden home-height">
      <div id="map-container" className="relative flex-grow overflow-hidden md:w-3/4 w-full">
        <div id="search-bar" className="rounded-full absolute p-1 sm:p-4 md:p-6 bg-clear z-10 left-1/2 transform -translate-x-1/2 w-5/6 flex items-center">
          <input
            id="search-input"
            type="text"
            placeholder="Where is your next adventure?"
            className="font-serif flex-grow border border-white-300 rounded-l-full py-2 sm:py-3 md:py-4 px-2 sm:px-4 md:px-5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl"
          />
          <button
            id="search-button"
            onClick={search}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 sm:py-3 md:py-4 px-2 sm:px-4 md:px-5 rounded-r-full text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-serif"
          >
            Search
          </button>
        </div>


        <div id="map" className="w-full h-full">
          {mapComponent}
        </div>
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