require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");

const ExpressError = require("./utils/ExpressError");

const campgroundRoutes = require("./routes/campgrounds");
const reviewRoutes = require("./routes/reviews");
const userRoutes = require("./routes/users");

const passport = require("passport");
const LocalStrategy = require("passport-local");

const User = require("./models/user");

const mongoSanitize = require("express-mongo-sanitize");
const path = require("path");

// connect to MongoDB
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB is connected");
    })
    .catch((err) => {
        console.log(err);
    });
mongoose.connection.on("error", (err) => {
    console.log(`DB connection error: ${err.message}`);
});

// express
const app = express();
app.use(express.json()); // allow json as input(req.body)

// session
const sessionConfig = {
    secret: "secret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24,
        maxAge: 1000 * 60 * 60 * 24
    }
};
app.use(session(sessionConfig));

// passport(auth)
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser()); // store user in session
passport.deserializeUser(User.deserializeUser()); // unstore user in session

// routes
app.use("/api/auth", userRoutes);
app.use("/api/campgrounds", campgroundRoutes);
app.use("/api/campgrounds/:id/reviews", reviewRoutes);

app.use(express.static(path.join(__dirname, "/client/dist")));

// mongo sanitize
app.use(mongoSanitize());

// error handling
app.get("*", (req, res, next) => {
    res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});
app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).json({ success: false, statusCode, message });
});

// listen on port 3000
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
