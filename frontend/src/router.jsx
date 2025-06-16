// src/router.jsx
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  redirect
} from "react-router-dom";
import App from "./App";
import Layout from "./Layout";
import Dashboard from "./components/Dashboard/Dashboard";
import { SearchPage } from "./components/SearchPage";
import ErrorPage from "./ErrorPage";
import Hb from "./Hb";
import ReadBlog from "./components/ReadBlog";
import NewBlog from "./components/NewBlog";
import LoginForm from "./components/Users/Login";
import SignupForm from "./components/Users/SignUp";

// 👇 Logs out user by calling backend and redirecting to homepage
const logoutLoader = async () => {
  const token = localStorage.getItem("token");

  try {
    await fetch("http://localhost:5000/logout", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error("Logout failed:", error);
  }

  localStorage.removeItem("token"); // clear client-side token
  return redirect("/");
};

const validateUUID = async ({ params }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    console.warn("No token found");
    throw redirect("/login");
  }

  const res = await fetch(`http://localhost:5000/verify/uuid/${params.uuid}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    console.warn("Token invalid or UUID check failed");
    throw redirect("/login");
  }

  return res.json(); // Passes data to useLoaderData()
};


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />} errorElement={<ErrorPage />}>
      <Route index element={<Layout />} />
      <Route
        path="dashboard/:userName/:uuid"
        element={<Dashboard />}
        loader={validateUUID}
        errorElement={<ErrorPage />}
      />
      <Route path="search" element={<SearchPage />} />
      <Route path="read/:pid" element={<ReadBlog />} />
      <Route path="new/:username/:uuid" element={<NewBlog />} />
      <Route path="login" element={<LoginForm />} />
      <Route path="signup" element={<SignupForm />} />
      <Route path="logout" loader={logoutLoader} />
      <Route path="404" element={<ErrorPage />} />
      <Route path="thebigboss" element={<Hb />} />
    </Route>
  )
);

export default router;
