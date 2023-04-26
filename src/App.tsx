import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useFirebase } from "./context/firebase";
import { Login } from "./routes/Login";
import { Home } from "./routes/Home";
import { PothHoleMap } from "./routes/PothHoleMap";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/pothholemap" element={<PothHoleMap />} />
      </Routes>
    </BrowserRouter>
  );
};
export default App;
