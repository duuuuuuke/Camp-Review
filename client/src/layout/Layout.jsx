import { Outlet, ScrollRestoration } from "react-router-dom";

import Navbar from "../components/Navbar";

const Layout = () => {
    return (
        <>
            <Navbar />
            <Outlet />
            <ScrollRestoration
                getKey={(location) => {
                    return location.pathname;
                }}
            />
        </>
    );
};

export default Layout;
