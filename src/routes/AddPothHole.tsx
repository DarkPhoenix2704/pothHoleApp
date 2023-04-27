import { LoadScript, GoogleMap, Marker } from "@react-google-maps/api";
import { signOut } from "firebase/auth";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFirebase } from "../context/firebase";
import { ref, push, set } from "firebase/database";

export const AddPothHole = () => {
  const { auth, db } = useFirebase();
  const navigate = useNavigate();
  const [latitude, setLatitude] = React.useState<number | null>(null);
  const [longitude, setLongitude] = React.useState<number | null>(null);
  const [isSuccess, setIsSuccess] = React.useState<boolean>(false);

  const addPothHole = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsSuccess(false);
    e.preventDefault();
    const id = Date.now();
    const locationRef = ref(db, `locations/${id}`);
    await set(locationRef, {
      latitude: latitude,
      longitude: longitude,
      id,
    }).then((snapShot) => {
      setIsSuccess(true);
    });
  };

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
          Add Poth Hole
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
          <h1 className="text-2xl font-bold">Add Poth Hole</h1>
          <form className="flex flex-col" onSubmit={addPothHole}>
            <div className="mb-4">
              <label
                htmlFor="number"
                className="block text-gray-700 font-bold mb-2"
              >
                Latitude
              </label>
              <input
                type="text"
                id="Number"
                name="Number"
                onChange={(e) => {
                  setIsSuccess(false);
                  setLatitude(Number(e.target.value));
                }}
                className="border rounded py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="longitude"
                className="block text-gray-700 font-bold mb-2"
              >
                Longitude
              </label>
              <input
                type="text"
                id="longitude"
                name="longitude"
                onChange={(e) => {
                  setIsSuccess(false);
                  setLongitude(Number(e.target.value));
                }}
                className="border rounded py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Add Poth Hole
            </button>
            {isSuccess && (
              <div className="text-green-500">Poth Hole Added Successfully</div>
            )}
          </form>
        </div>
      </div>
    </>
  );
};
