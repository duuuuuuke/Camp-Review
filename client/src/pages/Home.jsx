import "./Home.scss";

import { Link } from "react-router-dom";

import { motion } from "framer-motion";

const Home = () => {
    return (
        <motion.div
            className="app__home-container"
            initial={{ translateY: "-100%" }}
            animate={{ translateY: 0 }}
            exit={{ translateY: "-100%" }}
            transition={{ duration: 0.65, ease: "easeOut" }}>
            <div className="app__home-content">
                <nav className="app__navbar-logo">
                    <span>Camp</span>Review
                </nav>
                <div className="app__home-bottom">
                    <div className="app__home-text">
                        <h3>CampReview</h3>
                        <p>
                            Review campgrounds. Explore and discover your
                            favorite campgrounds. Happy camping!
                        </p>
                    </div>
                    <Link to="/campgrounds">START</Link>
                </div>
            </div>
        </motion.div>
    );
};

export default Home;
