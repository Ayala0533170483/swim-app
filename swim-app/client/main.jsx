import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./components/App.jsx";

console.log("main.jsx loaded");
createRoot(document.getElementById("root")).render(
    <StrictMode>
        <Router>
            <App />
        </Router >
    </StrictMode>
);
