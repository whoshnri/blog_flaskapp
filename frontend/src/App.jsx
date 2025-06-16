// src/App.jsx
import { Outlet } from "react-router-dom";
import "./index.css"

export default function App() {
  return (
    <div>
      <Outlet />
    </div>
  );
}
