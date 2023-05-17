import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login } from "./routes/Login";
import { Home } from "./routes/Home";
import { PotHoleMap } from "./routes/PotHoleMap";
import { AddPotHole } from "./routes/AddPotHole";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/potholemap" element={<PotHoleMap />} />
        <Route path="/addpothole" element={<AddPotHole />} />
      </Routes>
    </BrowserRouter>
  );
};
export default App;
