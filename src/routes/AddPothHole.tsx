import { LoadScript, GoogleMap, Marker } from "@react-google-maps/api";
import { signOut } from "firebase/auth";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFirebase } from "../context/firebase";
import { ref, push, set } from "firebase/database";
import { uploadBytesResumable, getDownloadURL } from "firebase/storage";

export const AddPothHole = () => {
  const { auth, db, storage } = useFirebase();
  const navigate = useNavigate();
  const [latitude, setLatitude] = React.useState<number | null>(null);
  const [longitude, setLongitude] = React.useState<number | null>(null);
  const [file, setFile] = React.useState<File | null>(null);
  const [isSuccess, setIsSuccess] = React.useState<boolean>(false);
  const [percent, setPercent] = React.useState(0);

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

  function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    setFile(event.target.files![0]);
  }

  /*  const handleUpload = () => {
    if (!file) {
      alert("Please select a file");
      return;
    }
    const storageRef = ref(storage, `/files/${file.name}`); // progress can be paused and resumed. It also exposes progress updates. // Receives the storage reference and the file to upload.
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const percent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        ); // update progress
        setPercent(percent);
      },
      (err) => console.log(err),
      () => {
        // download url
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          console.log(url);
        });
      }
    );
  }; */

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
            <div className="flex mb-2 items-center justify-center w-full">
              <label
                htmlFor="dropzone-file"
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-white-100"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                    aria-hidden="true"
                    className="w-10 h-10 mb-3 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    ></path>
                  </svg>
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    SVG, PNG, JPG or GIF (MAX. 800x400px)
                  </p>
                </div>
                <input
                  id="dropzone-file"
                  type="file"
                  className="hidden"
                  /*                   onChange={handleFile}
                   */
                />
              </label>
            </div>
            <p>{percent} "% done"</p>
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
