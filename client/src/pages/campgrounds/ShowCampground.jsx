import { Link, useLoaderData, useParams, useNavigate } from "react-router-dom";

import { useState } from "react";

import { FaStar } from "react-icons/fa";

import "./ShowCampground.scss";

import { useSelector } from "react-redux";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { reviewSchema } from "../../validationSchemas.js";

import { deleteImage } from "../../utils/deleteImage.js";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, A11y, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/a11y";
import "swiper/css/pagination";
import "swiper/css/autoplay";

import Map, { Marker, NavigationControl } from "react-map-gl";

export const loader = async ({ params }) => {
    const res = await fetch(`/api/campgrounds/${params.id}`);
    if (!res.ok) {
        throw {
            message: "Campground not found",
            status: res.status,
            statusText: res.statusText
        };
    } else {
        const data = await res.json();
        return data;
    }
};

const ShowCampground = () => {
    const campground = useLoaderData();
    const params = useParams();
    const navigate = useNavigate();
    const userInfo = useSelector((state) => state.auth.userInfo);

    const [deleteErr, setDeleteErr] = useState(null);
    const [reviewDeleteErr, setReviewDeleteErr] = useState(null);
    const [rating, setRating] = useState(null);
    const [hoverRating, setHoverRating] = useState(null);
    const [reviews, setReviews] = useState(
        campground.reviews.length > 0 ? campground.reviews : []
    );

    const handleDelete = async () => {
        const res = await fetch(`/api/campgrounds/${params.id}`, {
            method: "DELETE"
        });
        if (!res.ok) {
            const err = await res.json();
            setDeleteErr(err.message);
        } else {
            setDeleteErr(null);
            const resData = await res.json();
            if (resData.success) {
                resData.campground.images.forEach((imageUrl) => {
                    deleteImage(imageUrl);
                });
            }
            return navigate(`/campgrounds`);
        }
    };

    const handleReviewDelete = async (id) => {
        const res = await fetch(`/api/campgrounds/${params.id}/reviews/${id}`, {
            method: "DELETE"
        });
        if (!res.ok) {
            const err = await res.json();
            setReviewDeleteErr(err.message);
        } else {
            setReviewDeleteErr(null);
            setReviews((prevReviews) =>
                prevReviews.filter((review) => review._id !== id)
            );
        }
    };

    const {
        reset,
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError
    } = useForm({
        resolver: zodResolver(reviewSchema)
    });

    const onSubmit = async (data) => {
        data.review.rating = +data.review.rating;
        const res = await fetch(`/api/campgrounds/${params.id}/reviews`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        if (!res.ok) {
            setError("root.serverError", {
                type: res.status,
                message: res.statusText
            });
        } else {
            const resData = await res.json();
            if (resData.success) {
                let author = {
                    username: userInfo.username,
                    _id: resData.review.author
                };
                let newReview = {
                    ...resData.review,
                    author
                };
                setReviews((prevReviews) => [...prevReviews, newReview]);
            }
        }
        reset();
    };

    const displayReviews = [...reviews].reverse();
    return (
        <section className="app__camp-container">
            <div className="app__camp-detail">
                <Swiper
                    modules={[Navigation, A11y, Pagination, Autoplay]}
                    navigation
                    a11y
                    pagination={{ clickable: true }}
                    autoplay
                    className="app__camp-image-container">
                    {campground.images.map((image, i) => (
                        <SwiperSlide key={i} className="app__camp-image">
                            <img src={image} alt={campground.title} />
                        </SwiperSlide>
                    ))}
                </Swiper>
                <h3 className="app__camp-title">{campground.title}</h3>
                <div className="app__camp-price">
                    <span>${campground.price}</span>/night
                </div>
                <p className="app__camp-description">
                    {campground.description}
                </p>
                <div className="app__camp-location">
                    Location: {campground.location}
                </div>
                <div className="app__camp-author">
                    Submitted by {campground.author.username}
                </div>
                {deleteErr && <p className="errorText">{deleteErr}</p>}
                {userInfo && userInfo.userId === campground.author._id && (
                    <div className="app__camp-edit">
                        <Link to="./edit">Edit</Link>
                        <button onClick={handleDelete}>Delete</button>
                    </div>
                )}
                <div className="app__map-container">
                    <Map
                        mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
                        initialViewState={{
                            longitude: campground.geometry.coordinates[0],
                            latitude: campground.geometry.coordinates[1],
                            zoom: 8
                        }}
                        mapStyle="mapbox://styles/mapbox/streets-v11">
                        <Marker
                            longitude={campground.geometry.coordinates[0]}
                            latitude={campground.geometry.coordinates[1]}
                            anchor="bottom"></Marker>
                        <NavigationControl />
                    </Map>
                </div>
                {userInfo && (
                    <>
                        <div className="app__camp-review">Leave a review</div>
                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="app__camp-reviewform">
                            {errors.root?.serverError && (
                                <p className="errorText">
                                    {errors.root.serverError.type} -{" "}
                                    {errors.root.serverError.message}
                                </p>
                            )}
                            <div className="app__camp-reviewinput">
                                {[...Array(5)].map((star, i) => {
                                    return (
                                        <label
                                            htmlFor={`rating-${i + 1}`}
                                            key={i}>
                                            <input
                                                type="radio"
                                                value={i + 1}
                                                {...register("review[rating]")}
                                                id={`rating-${i + 1}`}
                                                onClick={() => setRating(i + 1)}
                                            />
                                            <FaStar
                                                className="star"
                                                size={30}
                                                color={
                                                    i + 1 <=
                                                    (hoverRating || rating)
                                                        ? "#ffc107"
                                                        : "#45567d"
                                                }
                                                onMouseEnter={() =>
                                                    setHoverRating(i + 1)
                                                }
                                                onMouseLeave={() =>
                                                    setHoverRating(null)
                                                }
                                            />
                                        </label>
                                    );
                                })}
                                {errors.review?.rating && (
                                    <p className="errorText">
                                        {errors.review.rating.message}
                                    </p>
                                )}
                            </div>
                            <div className="app__camp-reviewinput">
                                <textarea
                                    {...register("review[body]")}
                                    rows={3}
                                    id="body"></textarea>
                                {errors.review?.body && (
                                    <p className="errorText">
                                        {errors.review.body.message}
                                    </p>
                                )}
                            </div>
                            <button disabled={isSubmitting} type="submit">
                                {isSubmitting ? "Submitting..." : "Submit"}
                            </button>
                        </form>
                    </>
                )}
                <div className="app__reviews-container">
                    {reviewDeleteErr && (
                        <p className="errorText">{reviewDeleteErr}</p>
                    )}

                    {reviews.length > 0 ? (
                        displayReviews.map((review) => {
                            return (
                                <div
                                    className="app__camp-reviews"
                                    key={review._id}>
                                    <h5>{review.author.username}</h5>
                                    {[...Array(5)].map((star, i) => (
                                        <FaStar
                                            key={i}
                                            color={
                                                i + 1 <= review.rating
                                                    ? "#ffc107"
                                                    : "#45567d"
                                            }
                                        />
                                    ))}
                                    <p>{review.body}</p>
                                    {userInfo &&
                                        userInfo.userId ===
                                            review.author._id && (
                                            <button
                                                onClick={() =>
                                                    handleReviewDelete(
                                                        review._id
                                                    )
                                                }>
                                                Delete
                                            </button>
                                        )}
                                </div>
                            );
                        })
                    ) : (
                        <p className="app__noReviewText">No reviews yet</p>
                    )}
                </div>
            </div>
        </section>
    );
};

export default ShowCampground;
