import React from "react";
import "./App.css";
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { useState, useRef } from "react";
import Swal from "sweetalert2";
import "font-awesome/css/font-awesome.min.css";

const center = { lat: 41.902782, lng: 12.496366 };

function App() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyByg4Jv9h-kuoqeRaI-Lzb5WKEVj-8FbdE",
    libraries: ["places"],
  });

  const [isDivVisible, setDivVisible] = useState(true);
  const [map, setMap] = useState(/** @type google.maps.Map */ (null));
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [stop, setStop] = useState([{ value: "" }]);
  const [stops, setStops] = useState([]);
  const [stopsArray, setStopsArray] = useState([]);
  const [buttonIcon, setButtonIcon] = useState("fa-times");
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
  console.log(stopsArray);
  console.log(stops);
  async function findRoute() {
    try {
      if (
        originRef.current.value === "" ||
        destinationRef.current.value === ""
      ) {
        Swal.fire({
          title: "Error!",
          text: "Origin and Destination fields cannot be empty",
          icon: "error",
          confirmButtonText: "Ok",
        });
        return;
      }
      if (stopsArray.length < stops.length) {
        Swal.fire({
          title: "Error!",
          text: "You must enter a valid location",
          icon: "error",
          confirmButtonText: "Ok",
        });
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
      console.log(results);
    } catch (error) {
      Swal.fire({
        title: "Couldnt geocode!",
        text: "Please enter a valid location",
        icon: "error",
        confirmButtonText: "Ok",
      });
    }
  }

  const handleAddStop = () => {
    setStops([...stops, ""]);
  };
  const toggleDivVisibility = () => {
    setDivVisible(!isDivVisible);
    setStops([]);
    setStopsArray([]);
    setButtonIcon(isDivVisible ? "fa-bars" : "fa-times");
  };
  function customAutocomplete(input, index) {
    const autocomplete = new window.google.maps.places.Autocomplete(input);

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      const updatedArray = [...stopsArray, place.formatted_address];
      console.log(
        `Selected place for Stop ${index + 1}: ${place.formatted_address}`
      );

      // Update state with the new array containing the selected place
      setStopsArray(updatedArray);
    });
  }
  function clearRoute() {
    setDirectionsResponse(null);
    originRef.current.value = "";
    destinationRef.current.value = "";
    setStops([]);
    setStopsArray([]);
  }

  return (
    <div
      style={{
        position: "relative",
        height: "100vh",
        width: "100vw",
        paddingTop: "2rem",
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
      <div>
        <button
          style={{ zIndex: 100, position: "relative" }}
          className="custom-hide-button"
          onClick={toggleDivVisibility}
        >
          <i className={`fa ${buttonIcon}`}></i>
        </button>

        <div className={`responsive-div ${isDivVisible ? "show" : ""}`}>
          <div></div>
          <div>
            <Autocomplete>
              <input
                className="p-1 w-100 border rounded-md"
                type="text"
                placeholder="Origin"
                ref={originRef}
              />
            </Autocomplete>
          </div>

          <div>
            <Autocomplete>
              <input
                className="p-1 w-100 border rounded-md mt-4"
                type="text"
                placeholder="Destination"
                ref={destinationRef}
              />
            </Autocomplete>
          </div>

          {stops.map((stop, index) => (
            <div key={index}>
              <div style={{ flexGrow: 1 }}>
                <input
                  className="p-1 w-100 border rounded-md mt-4"
                  type="text"
                  placeholder={`Stop ${index + 1}`}
                  ref={(input) => customAutocomplete(input, index)}
                />
              </div>
            </div>
          ))}
          <div>
            <button
              className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-1 px-2 w-100 rounded mt-2"
              onClick={handleAddStop}
            >
              Add stop
            </button>
          </div>
          <div>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-2 w-100 rounded mt-2"
              onClick={findRoute}
            >
              Find Route
            </button>
          </div>

          <div class="flex justify-between mt-20">
            <div>
              <button
                class="px-4 py-2 bg-gray-500 hover:bg-gray-600  text-white font-semibold rounded"
                onClick={clearRoute}
              >
                Clear Route
              </button>
            </div>
            <div>
              <button
                class="px-4 py-2 bg-gray-500 hover:bg-gray-600  text-white font-semibold rounded"
                onClick={() => {
                  map.panTo(center);
                  map.setZoom(5);
                }}
              >
                Center Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
