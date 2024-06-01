import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import Map, {GeolocateControl} from 'react-map-gl';
// import 'mapbox-gl/dist/mapbox-gl.css';

export default function Home() {
  const search = () => {
    // Your search logic here
  };

  const [friendTrips, setFriendTrips] = useState([]);
  const [publicTrips, setPublicTrips] = useState([]);


  const [location, setLocation] = useState<[number, number]>([37.8, -122.4]); // [latitude, longitude]
  //Runs everytime page is rendered
  useEffect(() => {
    const successCallback = (position: GeolocationPosition) => {
      const { latitude,longitude} = position.coords;
      setLocation([latitude,longitude ]);
      console.log("location is ", position.coords);
    };
  
    const errorCallback = (error:GeolocationPositionError) => {
      console.error('Error getting geolocation:', error);
    };
    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };
    navigator.geolocation.getCurrentPosition(successCallback, errorCallback, options);
  
    return () => {
      // Cleanup function if needed
    };
  }, []);

  const fetchData = async () => {
    try {
      console.log("attempting to fetch data");
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/trip/getTrips`);
      const { accepted, others } = response.data;
      setFriendTrips(accepted);
      setPublicTrips(others);
      console.log("response is ", response.data);
      console.log("accepted is ", accepted);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };


    //Run on every render, the dependency array with state means that the code will run everytime this component mounts as well as when these state variables change and the value will be captured by the
    useEffect
    useEffect(() => {
      fetchData();
    }, []);

  console.log("being called again");
  return (
<div id="main" className="flex overflow-hidden" style={{ width: '100%', height: '100vh' }}>
      <div id="map-container" className="relative flex-grow" style={{ width: '75%' }}>
        <div id="search-bar" className="rounded-full absolute p-6 bg-clear z-10 left-1/2 transform -translate-x-1/2 w-5/6 flex items-center">
          <input id="search-input" type="text" placeholder="Where is your next adventure?" className="font-serif flex-grow border border-white-300 rounded-l-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <button id="search-button" onClick={search} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-r-full">Search</button>
        </div>

        {/* <div id="map" className="w-full h-full">
          <Map
            mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
            initialViewState={{
              latitude: location[0],
              longitude: location[1],
              zoom: 8
            }}
            mapStyle="mapbox://styles/mapbox/satellite-streets-v12"
            style={{ width: '100%', height: '100%' }}
          >
            <GeolocateControl
              positionOptions={{ enableHighAccuracy: true }}
              trackUserLocation={false}
              showUserLocation={true}
            />
          </Map>
        </div> */}
      </div>
      <div id="panel" className="bg-white-200 p-4 w-1/4 overflow-auto">
        <div id="inset-panel" className="p-4 bg-gray-200 h-full overflow-auto">
          <ul>
          { friendTrips != undefined ? (
          friendTrips.map((trip, index) => (
            <div 
              key={index} 
              id="tripMembers" 
              className="p-2 bg-white border border-grey-300 mb-2"
            >
              <h3>{trip.destination}</h3>
              {/* <p>{trip.description}</p>
              <p><strong>Driver:</strong> {trip.driver_name}</p>
              <p><strong>Date:</strong> {trip.date}</p> */}
            </div>
          ))
        ) : (
          <p>No friend trips available.</p>
        )}
          </ul>
          {/* <ul>
            {publicTrips.map((item) => (
              <div id="tripMembers"></div>
            ))}
          </ul> */}
        </div>

    </div>
</div>
  );
}
