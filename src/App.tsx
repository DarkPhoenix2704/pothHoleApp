import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useFirebase } from "./context/firebase";
import { Login } from "./routes/Login";
import { Home } from "./routes/Home";
import { PothHoleMap } from "./routes/PothHoleMap";
import { AddPothHole } from "./routes/AddPothHole";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/pothholemap" element={<PothHoleMap />} />
        <Route path="/addpothhole" element={<AddPothHole />} />
      </Routes>
    </BrowserRouter>
  );
};
export default App;
