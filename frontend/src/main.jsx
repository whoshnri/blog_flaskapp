import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import { StackProvider, StackTheme } from "@stackframe/react";
import { stackClientApp } from "./stack";
import './index.css';
import {HelmetProvider} from "react-helmet-async"

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HelmetProvider>
        <RouterProvider router={router} />
    </HelmetProvider>
  </React.StrictMode>
);
