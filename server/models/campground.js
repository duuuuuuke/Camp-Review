const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Review = require("./review");

const opts = { toJSON: { virtuals: true } };

const CampgroundSchema = new Schema(
    {
        title: String,
        images: [String],
        geometry: {
            type: {
                type: String,
                enum: ["Point"],
                required: true
            },
            coordinates: {
                type: [Number],
                required: true
            }
        },
        price: Number,
        description: String,
        location: String,
        author: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        reviews: [
            {
                type: Schema.Types.ObjectId,
                ref: "Review"
            }
        ]
    },
    opts
);

CampgroundSchema.virtual("properties.popUp").get(function () {
    return JSON.stringify({ title: this.title, id: this._id });
});

CampgroundSchema.post("findOneAndDelete", async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        });
    }
});

module.exports = mongoose.model("Campground", CampgroundSchema);
