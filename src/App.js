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
  const originRef = useRef();
  const destinationRef = useRef();
  if (!isLoaded) {
    return <div>ne radi</div>;
  }

  async function findRoute() {
    if (originRef.current.value === "" || destinationRef.current.value === "") {
      return;
    }
    // eslint-disable-next-line no-undef
    const directionsService = new google.maps.DirectionsService();
    const results = await directionsService.route({
      origin: originRef.current.value,
      destination: destinationRef.current.value,

      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.DRIVING,
    });
    setDirectionsResponse(results);
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
        </div>
        <div>
          <button onClick={() => { map.panTo(center); map.setZoom(5);}}>Center Back</button>
        </div>
      </div>
    </div>
  );
}

export default App;
