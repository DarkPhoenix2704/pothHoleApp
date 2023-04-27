import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFunctions } from "firebase/functions";
import { getStorage } from "firebase/storage";
import React, { createContext, useContext } from "react";

const FirebaseContext = createContext<any>({});

const firebaseConfig = {
  apiKey: "AIzaSyBcjufCmed3FVh4c5qbxjTa90Dt2SvF6NI",
  authDomain: "pothole-pinger.firebaseapp.com",
  databaseURL: "https://pothole-pinger-default-rtdb.firebaseio.com",
  projectId: "pothole-pinger",
  storageBucket: "pothole-pinger.appspot.com",
  messagingSenderId: "887317162810",
  appId: "1:887317162810:web:6e9ef10fdfdb626d7c7e03",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getDatabase(app);
const functions = getFunctions(app);
const storage = getStorage(app);

export const useFirebase = () => useContext(FirebaseContext);
export const FirebaseProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  // eslint-disable-next-line react/jsx-no-constructed-context-values
  <FirebaseContext.Provider value={{ auth, db, functions, storage }}>
    {children}
  </FirebaseContext.Provider>
);
