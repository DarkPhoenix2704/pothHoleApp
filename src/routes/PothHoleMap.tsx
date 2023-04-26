import React, { useEffect } from "react";
import { useFirebase } from "../context/firebase";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { ref, get, query } from "firebase/database";
import { LoadScript, GoogleMap, Marker } from "@react-google-maps/api";

export const PothHoleMap = () => {
  const { auth, db } = useFirebase();
  const navigate = useNavigate();
  const [locations, setLocations] = React.useState<Array<{
    id: string;
    latitude: number;
    longitude: number;
  }> | null>(null);

  const containerStyle = {
    width: "800px",
    height: "600px",
  };

  const center = {
    lat: -3.745,
    lng: -38.523,
  };
  useEffect(() => {
    (async () => {
      const locationRef = ref(db, "locations");
      const locationsSnapShot = await get(query(locationRef));
      const data: Array<{
        id: string;
        latitude: number;
        longitude: number;
      }> = [];
      Object.entries(locationsSnapShot.val()).forEach((val: any) => {
        const id = val[0];
        data.push({
          id: id,
          latitude: val[1].latitude,
          longitude: val[1].longitude,
        });
      });

      setLocations(
        data as {
          id: string;
          latitude: number;
          longitude: number;
        }[]
      );
    })();
  }, []);

  return (
    <>
      <div className="flex flex-row gap-8">
        <Link to="/" className="text-gray-500 ml-2 p-2 cursor-pointer">
          Home
        </Link>
        <Link
          to="/pothholemap"
          className="text-gray-500 ml-2 p-2 cursor-pointer"
        >
          Poth Hole Map
        </Link>
        <div
          onClick={() => {
            signOut(auth);
            navigate("/login");
          }}
          className="text-gray-500 ml-2 p-2 cursor-pointer"
        >
          Logout
        </div>
      </div>
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <div className="bg-white w-1/2 p-4 rounded-lg">
          <h1 className="text-2xl font-bold">Poth Hole Map</h1>
          <LoadScript googleMapsApiKey="AIzaSyDZNQ4fIy6JJWDjC8D47kA6B428usEAuMg">
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={center}
              zoom={1}
            >
              {locations?.map((location) => (
                <Marker
                  key={location.id}
                  position={{ lat: location.latitude, lng: location.longitude }}
                />
              ))}
              <></>
            </GoogleMap>
          </LoadScript>
        </div>
      </div>
    </>
  );
};
