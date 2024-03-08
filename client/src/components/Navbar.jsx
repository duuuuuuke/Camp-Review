import { useState } from "react";

import { NavLink, Link, useNavigate } from "react-router-dom";

import { HiMenuAlt4, HiX } from "react-icons/hi";

import { motion } from "framer-motion";

import { useSelector, useDispatch } from "react-redux";

import { authActions } from "../slices/authSlice";

import "./Navbar.scss";

const Navbar = () => {
    const { userInfo } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const [showMenu, setShowMenu] = useState(false);

    const navigate = useNavigate();
    const logoutHandler = async () => {
        const res = await fetch("/api/auth/logout");
        if (!res.ok) {
            const err = await res.json();
            throw {
                message: err.message,
                status: res.status,
                statusText: res.statusText
            };
        }
        const resData = await res.json();
        if (resData.success === true) {
            dispatch(authActions.logout());
            return navigate("/campgrounds", { replace: true });
        }
    };
    return (
        <nav className="app__navbar">
            <a href="#" className="app__navbar-logo">
                <span>Camp</span>Review
            </a>
            <ul className="app__navbar-links">
                <li>
                    <NavLink to="/">Home</NavLink>
                </li>
                <li>
                    <NavLink to="/campgrounds" end>
                        Campgrounds
                    </NavLink>
                </li>
                {userInfo && (
                    <li>
                        <NavLink to="/campgrounds/new">New Campground</NavLink>
                    </li>
                )}
                {userInfo ? (
                    <>
                        <li>
                            <Link onClick={logoutHandler}>Logout</Link>
                        </li>
                        <li>
                            <p>Hi,{userInfo.username}</p>
                        </li>
                    </>
                ) : (
                    <li>
                        <NavLink to="/login">Login</NavLink>
                        <span>|</span>
                        <NavLink to="/register">Register</NavLink>
                    </li>
                )}
            </ul>
            <div className="app__navbar-menu">
                <HiMenuAlt4
                    onClick={() => {
                        setShowMenu(true);
                    }}
                />
                {showMenu && (
                    <motion.div
                        whileInView={{ x: [300, 0] }}
                        transition={{ duration: 0.65, ease: "easeOut" }}>
                        <HiX
                            onClick={() => {
                                setShowMenu(false);
                            }}
                        />
                        <ul>
                            {userInfo && (
                                <li>
                                    <p>Hi,{userInfo.username}</p>
                                </li>
                            )}
                            <li>
                                <Link
                                    to="/"
                                    onClick={() => {
                                        setShowMenu(false);
                                    }}>
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/campgrounds"
                                    onClick={() => {
                                        setShowMenu(false);
                                    }}>
                                    Campgrounds
                                </Link>
                            </li>
                            {userInfo && (
                                <li>
                                    <Link
                                        to="/campgrounds/new"
                                        onClick={() => {
                                            setShowMenu(false);
                                        }}>
                                        New Campground
                                    </Link>
                                </li>
                            )}

                            {userInfo ? (
                                <li>
                                    <Link onClick={logoutHandler}>Logout</Link>
                                </li>
                            ) : (
                                <li>
                                    <Link
                                        to="/login"
                                        onClick={() => {
                                            setShowMenu(false);
                                        }}>
                                        Login
                                    </Link>
                                    <span>|</span>
                                    <Link
                                        to="/register"
                                        onClick={() => {
                                            setShowMenu(false);
                                        }}>
                                        Register
                                    </Link>
                                </li>
                            )}
                        </ul>
                    </motion.div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
