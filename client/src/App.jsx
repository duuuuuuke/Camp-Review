import "./App.scss";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Layout from "./layout/Layout";
import Campgrounds from "./pages/campgrounds/Campgrounds";
import NewCampground from "./pages/campgrounds/NewCampground";
import ShowCampground from "./pages/campgrounds/ShowCampground";
import EditCampground from "./pages/campgrounds/EditCampground";
import Register from "./pages/users/Register";
import Login from "./pages/users/Login";
import ErrorPage from "./pages/Error";

import { loader as campgroundsLoader } from "./pages/campgrounds/Campgrounds";
import { loader as showCampgroundLoader } from "./pages/campgrounds/ShowCampground";
import { loader as loginLoader } from "./pages/users/Login";
import { loader as registerLoader } from "./pages/users/Register";
import { loader as newCampgroundLoader } from "./pages/campgrounds/NewCampground";
import { loader as editCampgroundLoader } from "./pages/campgrounds/EditCampground";
import Home from "./pages/Home";

const router = createBrowserRouter([
    { path: "/", element: <Home /> },
    {
        element: <Layout />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: "/campgrounds",
                element: <Campgrounds />,
                loader: campgroundsLoader
            },
            {
                path: "/campgrounds/new",
                element: <NewCampground />,
                loader: newCampgroundLoader
            },
            {
                path: "/campgrounds/:id",
                element: <ShowCampground />,
                loader: showCampgroundLoader
            },
            {
                path: "/campgrounds/:id/edit",
                element: <EditCampground />,
                loader: editCampgroundLoader
            },
            {
                path: "/register",
                element: <Register />,
                loader: registerLoader
            },
            { path: "/login", element: <Login />, loader: loginLoader }
        ]
    }
]);

const App = () => {
    return <RouterProvider router={router} />;
};

export default App;
