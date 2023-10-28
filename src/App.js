import React from "react";

import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { useState, useRef } from "react";

const center = { lat: 41.902782, lng: 12.496366 };

function App() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  const [map, setMap] = useState(/** @type google.maps.Map */ (null));
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [stop, setStop] = useState([{ value: "" }]);
  const [stops, setStops] = useState([]);
  const [stopsArray, setStopsArray]=useState([]);
  const stopRef = useRef();
  const originRef = useRef();
  const destinationRef = useRef();
  if (!isLoaded) {
    return <div>ne radi</div>;
  }
  const waypoints = stopsArray.map((stop) => {
    return {
      location: stop,
      stopover: true,
    };
  });
  async function findRoute() {
    if (originRef.current.value === "" || destinationRef.current.value === "") {
      return;
    }
    // eslint-disable-next-line no-undef
    const directionsService = new google.maps.DirectionsService();
    const results = await directionsService.route({
      origin: originRef.current.value,
      destination: destinationRef.current.value,
      waypoints: waypoints,

      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.DRIVING,
    });
    setDirectionsResponse(results);
  }
  const handleAddStop = () => {
    setStops([...stops, ""]);
  };
  function customAutocomplete(input, index) {
    const autocomplete = new window.google.maps.places.Autocomplete(input);
  
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      const updatedArray = [...stopsArray, place.formatted_address];
      console.log(`Selected place for Stop ${index + 1}: ${place.formatted_address}`);
  
      // Update state with the new array containing the selected place
      setStopsArray(updatedArray);
    });
  }
  return (
    <div
      style={{
        position: "relative",
        flexDirection: "column",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          height: "100%",
          width: "100%",
        }}
      >
        <GoogleMap
          center={center}
          zoom={5}
          mapContainerStyle={{ width: "100%", height: "100%" }}
          options={{
            zoomControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
          onLoad={(map) => {
            setMap(map);
          }}
        >
          <Marker position={center} />
          {directionsResponse && ( 
            <DirectionsRenderer directions={directionsResponse} />
          )}
        </GoogleMap>
      </div>
      <div
        style={{
          backgroundColor: "white",
          zIndex: 100,
          position: "relative",
        }}
      >
        <div>
          <div>
            <Autocomplete>
              <input type="text" placeholder="Origin" ref={originRef} />
            </Autocomplete>
          </div>

          <div>
            <Autocomplete>
              <input type="text" placeholder="Destination" ref={destinationRef} />
            </Autocomplete>
          </div>
          <div>
            <button onClick={findRoute}>Find Route</button>
          </div>
          <button onClick={handleAddStop}>Add stop</button>
          {stops.map((stop, index) => (
            <div key={index}>
              <div style={{ flexGrow: 1 }}>
                <input
                  type="text"
                  placeholder={`Stop ${index + 1}`}
                  ref={(input) => customAutocomplete(input, index)}
                />
              </div>
            </div>
          ))}

        </div>
        <div>
          <button onClick={() => { map.panTo(center); map.setZoom(5);}}>Center Back</button>
        </div>
      </div>
    </div>
  );
}

export default App;
