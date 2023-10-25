import React from "react";

import { useJsApiLoader, GoogleMap, Marker } from "@react-google-maps/api";
import { useState } from "react";

const center = { lat: 41.8818, lng: -87.623 };

function App() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  const [map, setMap] = useState(/** @type google.maps.Map */ (null));

  /** @type React.MutableRefObject<HTMLInputElement> */
  if (!isLoaded) {
    return <div>ne radi</div>;
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
          zoom={15}
          mapContainerStyle={{ width: "100%", height: "100%" }}
          options={{
            zoomControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
          onLoad={(map) => setMap(map)}
        >
          <Marker position={center} />
        </GoogleMap>
      </div>
    </div>
  );
}

export default App;
