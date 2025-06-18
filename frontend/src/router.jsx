// src/router.jsx
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  redirect
} from "react-router-dom";
import { lazy, Suspense } from "react";
import App from "./App";
import Layout from "./Layout";
const Dashboard = lazy(() => import("./components/Dashboard/Dashboard"))
const SearchPage = lazy(() => import("./components/SearchPage"))
const ErrorPage = lazy(() => import("./ErrorPage"))
const Hb = lazy(() => import("./Hb"))
const ReadBlog = lazy(() => import("./components/ReadBlog"))
const NewBlog = lazy(() => import("./components/NewBlog"))
const LoginForm = lazy(() => import("./components/Users/Login"))
const SignupForm = lazy(() => import("./components/Users/SignUp"))
import Loader from "./components/Loader";
const API = import.meta.env.VITE_API_BASE_URL;


// 👇 Logs out user by calling backend and redirecting to homepage
const logoutLoader = async () => {
  const token = localStorage.getItem("token");

  try {
    await fetch(`${API}/logout`, {
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

  const res = await fetch(`${API}/verify/uuid/${params.uuid}`, {
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
        element={<Suspense fallback={<Loader />}><Dashboard />
        </Suspense>}
        loader={validateUUID}
        errorElement={<ErrorPage />}
      />

      <Route path="search" element={<Suspense fallback={<Loader />}><SearchPage />
        </Suspense>} />
      <Route path="read/:pid" element={<Suspense fallback={<Loader />}><ReadBlog />
        </Suspense>} />
      <Route path="new/:username/:uuid" element={<Suspense fallback={<Loader />}><NewBlog />
        </Suspense>} />
      <Route path="login" element={<Suspense fallback={<Loader />}><LoginForm />
        </Suspense>} />
      <Route path="signup" element={<Suspense fallback={<Loader />}><SignupForm />
        </Suspense>} />
      <Route path="logout" loader={logoutLoader} />
      <Route path="404" element={<ErrorPage />} />
      <Route path="thebigboss" element={<Suspense fallback={<Loader />}><Hb />
        </Suspense>} />
    </Route>
  )
);

export default router;
