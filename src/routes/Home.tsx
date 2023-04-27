import { ref, push, set, query, get, onValue } from "firebase/database";
import React, { useEffect } from "react";
import { useFirebase } from "../context/firebase";
import { Link, useNavigate } from "react-router-dom";
import { User, signOut } from "firebase/auth";

export const Home = () => {
  const { db, auth } = useFirebase();
  const navigate = useNavigate();
  const [locations, setLocations] = React.useState<Array<{
    id: string;
    latitude: number;
    longitude: number;
  }> | null>(null);

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

  useEffect(() => {
    auth.onAuthStateChanged((user: User) => {
      if (!user) {
        navigate("/login");
      }
    });
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
        <Link
          to="/addpothhole"
          className="text-gray-500 ml-2 p-2 cursor-pointer"
        >
          Add PothHole
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
          <h1 className="text-2xl font-bold">Poth Hole Locations</h1>
          <div className="mt-4">
            {locations &&
              locations.map((location, index) => {
                return (
                  <div
                    key={index}
                    className="flex justify-between items-center"
                  >
                    <div className="flex items-center">
                      <div className="bg-red-400 w-4 h-4 rounded-full mr-2"></div>
                      <div className="text-gray-500 w-full flex-grow">
                        {location.latitude}, {location.longitude}
                      </div>
                      <button
                        className="text-gray-500 ml-2 p-2 cursor-pointer"
                        onClick={() => {
                          const locationRef = ref(
                            db,
                            `locations/${location.id}`
                          );
                          set(locationRef, null);
                          setLocations((prev) => {
                            if (prev) {
                              return prev.filter(
                                (item) => item.id !== location.id
                              );
                            }
                            return prev;
                          });
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </>
  );
};
