import { ref, set, query, get } from "firebase/database";
import { getDownloadURL, ref as stref } from "firebase/storage";
import React, { useEffect } from "react";
import { useFirebase } from "../context/firebase";
import { Link, useNavigate } from "react-router-dom";
import { User, signOut } from "firebase/auth";

export const Home = () => {
  const { db, auth, storage } = useFirebase();
  const navigate = useNavigate();
  const [locations, setLocations] = React.useState<Array<{
    id: string;
    latitude: number;
    longitude: number;
    url: string;
  }> | null>(null);

  useEffect(() => {
    (async () => {
      const locationRef = ref(db, "locations");
      const locationsSnapShot = await get(query(locationRef));
      const data: Array<{
        id: string;
        latitude: number;
        url: string;
        longitude: number;
      }> = [];

      Object.entries(locationsSnapShot.val()).map((val: any) => {
        const id = val[0];
        data.push({
          id: id,
          latitude: val[1].latitude,
          longitude: val[1].longitude,
          url: val[1].url,
        });
      });

      setLocations(data);
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
          to="/potholemap"
          className="text-gray-500 ml-2 p-2 cursor-pointer"
        >
          Pothole Map
        </Link>
        <Link
          to="/addpothole"
          className="text-gray-500 ml-2 p-2 cursor-pointer"
        >
          Add PotHole
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
        <div className="bg-white  w-3/4 p-4 rounded-lg">
          <table className="table-auto w-full">
            <thead>
              <tr>
                <td colSpan={5} className="text-center font-bold px-4 py-2">
                  Pothole Locations
                </td>
              </tr>
              <tr>
                <th className="px-4 py-2">SI/No</th>
                <th className="px-4 py-2">Latitude</th>
                <th className="px-4 py-2">Longitude</th>
                <th className="px-4 py-2">Image</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {locations &&
                locations.map((location, key) => {
                  return (
                    <tr key={location?.id}>
                      <td className="border px-4 py-2">{key + 1}</td>
                      <td className="border px-4 py-2">{location?.latitude}</td>
                      <td className="border px-4 py-2">
                        {location?.longitude}
                      </td>
                      <td className="border px-4 py-2">
                        <a href={location.url} target="_blank">
                          <img
                            src={location.url}
                            alt="pothole"
                            className="w-20 h-20 hover:scale-150 transition-transform object-cover"
                          />
                        </a>
                      </td>
                      <td className="border text-center px-4 py-2">
                        <button
                          className="text-white rounded-md ml-2 p-2 bg-red-400 cursor-pointer"
                          onClick={() => {
                            const locationRef = ref(
                              db,
                              `locations/${location?.id}`
                            );
                            set(locationRef, null);
                            setLocations((prev) => {
                              if (prev) {
                                return prev.filter(
                                  (item) => item?.id !== location?.id
                                );
                              }
                              return prev;
                            });
                          }}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};
