import Navbar from "../components/Navbar";

import "./Error.scss";

import { useRouteError } from "react-router-dom";

const ErrorPage = () => {
    const error = useRouteError();

    return (
        <>
            <Navbar />
            <h2 className="app__error-title">{error.message}</h2>
            <p className="app__error-text">
                {error.status} - {error.statusText}
            </p>
        </>
    );
};

export default ErrorPage;
