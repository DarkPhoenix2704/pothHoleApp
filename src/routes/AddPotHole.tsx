import { signOut } from "firebase/auth";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFirebase } from "../context/firebase";
import { ref, set } from "firebase/database";
import { getDownloadURL, ref as stref, uploadBytes } from "firebase/storage";

export const AddPotHole = () => {
  const { auth, db, storage } = useFirebase();
  const navigate = useNavigate();
  const [latitude, setLatitude] = React.useState<number | null>(null);
  const [longitude, setLongitude] = React.useState<number | null>(null);
  const [isSuccess, setIsSuccess] = React.useState<boolean>(false);
  const [potHoleDoesNotExist, setPotHoleDoesNotExist] = React.useState<
    boolean | null
  >(null);
  const [image, setImage] = React.useState<File | null>(null);

  const checkIfPotHoleExists = async () => {
    const formData = new FormData();
    formData.append("file", image as File);
    const res = await (
      await fetch("http://localhost:5000", {
        method: "POST",
        body: formData,
      })
    ).json();
    return res.prediction;
  };

  const addPotHole = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsSuccess(false);
    e.preventDefault();
    setPotHoleDoesNotExist(null);
    const data = await checkIfPotHoleExists();
    if (!data) {
      setPotHoleDoesNotExist(true);
      return;
    }
    const id = Date.now();
    const storageRef = await stref(storage, `images/${id}`);
    await uploadBytes(storageRef, image as Blob).then(async (snapShot) => {
      const url = await getDownloadURL(await snapShot.ref);
      const locationRef = ref(db, `locations/${id}`);
      await set(locationRef, {
        latitude: latitude,
        longitude: longitude,
        id,
        url,
      }).then(async (snapShot) => {
        setIsSuccess(true);
      });
    });
  };

  function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    setImage(event.target.files![0]);
  }

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
          Add Pothole
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
          <h1 className="text-2xl font-bold">Add Pothole</h1>
          <form className="flex flex-col" onSubmit={addPotHole}>
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

            <input
              type="file"
              className="mb-2"
              accept="image/*"
              onChange={handleFile}
            />
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Add Pothole
            </button>
            {potHoleDoesNotExist ? (
              <div className="text-white my-2 rounded-sm p-2 bg-red-400">
                Pothole Does Not Exist
              </div>
            ) : null}
            {isSuccess && (
              <div className="text-green-500">Pothole Added Successfully</div>
            )}
          </form>
        </div>
      </div>
    </>
  );
};
