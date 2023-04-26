import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { FirebaseProvider } from "./context/firebase";
import "./index.css";

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
  <StrictMode>
    <FirebaseProvider>
      <App />
    </FirebaseProvider>
  </StrictMode>
);
