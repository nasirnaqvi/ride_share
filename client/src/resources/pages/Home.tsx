import React, { useState, useEffect } from 'react';
// import Map, {GeolocateControl} from 'react-map-gl';
// import 'mapbox-gl/dist/mapbox-gl.css';

export default function Home() {
  const search = () => {
    // Your search logic here
  };

  const [trips, setTrips] = useState([]);

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

  //Run on every render, the dependency array with state means that the code will run everytime this component mounts as well as when these state variables change and the value will be captured by the
  useEffect
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    // try {
    //   const response = await axios.get('/api/endpoint'); // Replace '/api/endpoint' with your actual backend endpoint
    //   setTrips(response.data);
    // } catch (error) {
    //   console.error('Error fetching data:', error);
    // }
  };
  console.log("being called again");
  return (
<div id="main" className="flex overflow-hidden" style={{ width: '100%', height: '100vh' }}>
      <div id="map-container" className="relative flex-grow" style={{ width: '75%' }}>
        <div id="search-bar" className="rounded-full absolute p-6 bg-clear z-10 left-1/2 transform -translate-x-1/2 w-5/6 flex items-center">
          <input id="search-input" type="text" placeholder="Where is your next adventure?" className="font-serif flex-grow border border-white-300 rounded-l-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <button id="search-button" onClick={search} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-r-full">Search</button>
        </div>

        <div id="map" className="w-full h-full">
          {/* <Map
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
          </Map> */}
        </div>
      </div>
      <div id="panel" className="bg-gray-200 p-4 w-1/4 overflow-auto">
      <ul>
        {trips.map((item) => (
          <li key={item.id} className="mb-2">
            <div className="bg-white rounded-lg p-2">
              {item.description}
            </div>
          </li>
        ))}
      </ul>
    </div>
</div>
  );
}
