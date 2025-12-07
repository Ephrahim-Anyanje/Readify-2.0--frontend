import "./styles/global.css";
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

app.add_middleware(
  CORSMiddleware,
  (allow_origins = ["*"]),
  (allow_credentials = True),
  (allow_methods = ["*"]),
  (allow_headers = ["*"])
);

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
