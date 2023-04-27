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
        <table className="bg-white w-5/6 p-4 rounded-lg">
          <tr>
            <th colSpan={4} className="px-4 py-2">
              Poth Hole Locations
            </th>
          </tr>
          <tr>
            <th className="px-2 py-2">SI NO</th>
            <th className="px-2 py-2">Latitude</th>
            <th className="px-2 py-2">Logitude</th>
            <th className="px-2 py-2">Action</th>
          </tr>
          {locations &&
            locations.map((location, index) => {
              return (
                <tr key={index}>
                  <td className="px-2 py-2">
                    <div className="bg-red-400 w-4 h-4 rounded-full mr-2"></div>
                  </td>
                  <td className="px-2 py-2">
                    <div className="text-gray-500 w-full flex-grow">
                      {location.latitude}
                    </div>
                  </td>
                  <td className="px-2 py-2">
                    <div className="text-gray-500 w-full flex-grow">
                      {location.longitude}
                    </div>
                  </td>
                  <td className="px-2 py-2 ">
                    <button
                      className="text-white rounded-md bg-red-500 p-2 cursor-pointer"
                      onClick={() => {
                        const locationRef = ref(db, `locations/${location.id}`);
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
                  </td>
                </tr>
              );
            })}
        </table>
      </div>
    </>
  );
};
