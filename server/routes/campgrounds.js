const express = require("express");
const router = express.Router();

const catchAsync = require("../utils/catchAsync");

const Campground = require("../models/campground");

const campgrounds = require("../controllers/campgrounds");

// middleware
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");

router
    .route("/")
    .get(catchAsync(campgrounds.index))
    .post(
        isLoggedIn,
        validateCampground,
        catchAsync(campgrounds.createCampground)
    );

router
    .route("/:id")
    .get(catchAsync(campgrounds.showCampground))
    .put(
        isLoggedIn,
        isAuthor,
        validateCampground,
        catchAsync(campgrounds.updateCampground)
    )
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

module.exports = router;
