const Campground = require("../models/campground");
const ExpressError = require("../utils/ExpressError");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geoCoder = mbxGeocoding({ accessToken: mapBoxToken });

module.exports.index = async (req, res, next) => {
    const campgrounds = await Campground.find({});
    res.json(campgrounds);
};

module.exports.renderNewForm = (req, res) => {
    res.json("new campground form");
};

module.exports.createCampground = async (req, res, next) => {
    const geoData = await geoCoder
        .forwardGeocode({
            query: req.body.campground.location,
            limit: 1
        })
        .send();
    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.body.features[0].geometry;
    campground.author = req.user._id;
    await campground.save();
    res.json(campground);
};

module.exports.showCampground = async (req, res, next) => {
    const campground = await Campground.findById(req.params.id)
        .populate("author")
        .populate({ path: "reviews", populate: { path: "author" } });
    if (!campground) {
        return next(new ExpressError("Campground not found", 400));
    }
    res.json(campground);
};

module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {
        ...req.body.campground
    });
    res.json({ id });
};

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    res.json({ success: true, message: "Successfully deleted", campground });
};
