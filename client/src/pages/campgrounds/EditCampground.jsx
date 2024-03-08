import "./NewCampground.scss";

import {
    Link,
    redirect,
    useLoaderData,
    useNavigate,
    useParams
} from "react-router-dom";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { campgroundSchema } from "../../validationSchemas.js";

import store from "../../store.js";

import { useState, useEffect } from "react";

import { storeImage } from "../../utils/storeImage.js";
import { deleteImage } from "../../utils/deleteImage.js";

export const loader = async ({ params }) => {
    const userInfo = store.getState().auth.userInfo;
    if (!userInfo) return redirect("/login", { replace: true });
    const res = await fetch(`/api/campgrounds/${params.id}`);
    if (!res.ok) {
        throw {
            message: "Campground not found",
            status: res.status,
            statusText: res.statusText
        };
    } else {
        const data = await res.json();
        if (data.author._id !== userInfo.userId) {
            return redirect(`/campgrounds/${params.id}`, { replace: true });
        }
        return data;
    }
};

const EditCampground = () => {
    const campground = useLoaderData();
    const navigate = useNavigate();
    const params = useParams();
    const [files, setFiles] = useState([]);
    const [imageUrls, setImageUrls] = useState([]);
    const [uploading, setUploading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError,
        setValue
    } = useForm({
        resolver: zodResolver(campgroundSchema),
        defaultValues: {
            "campground[title]": campground.title,
            "campground[location]": campground.location,
            "campground[price]": campground.price,
            "campground[description]": campground.description,
            "campground[images]": [...campground.images]
        }
    });

    useEffect(() => {
        setImageUrls([...campground.images]);
    }, []);

    const handleImageUpload = () => {
        if (files.length > 0 && files.length + imageUrls.length <= 5) {
            setUploading(true);
            setError("campground[images]", {
                type: "serverError",
                message: ""
            });
            const promises = [];
            for (let i = 0; i < files.length; i++) {
                promises.push(storeImage(files[i]));
            }
            Promise.all(promises)
                .then((urls) => {
                    setImageUrls((prevState) => [...prevState, ...urls]);
                    setValue("campground[images]", [...imageUrls, ...urls]);
                    setUploading(false);
                })
                .catch((err) => {
                    setError("campground[images]", {
                        type: "serverError",
                        message:
                            "Image upload failed (max 5, 2mb each)" +
                            err.message
                    });
                    setUploading(false);
                });
        } else {
            setError("campground[images]", {
                type: "serverError",
                message: "Image upload failed (max 5, 2mb each)"
            });
            setUploading(false);
        }
    };

    const handleRemoveImage = async (url, index) => {
        await deleteImage(url);
        setImageUrls((prevState) => prevState.filter((_, i) => i !== index));
        setValue(
            "campground[images]",
            imageUrls.filter((_, i) => i !== index)
        );
    };

    const onSubmit = async (data) => {
        const res = await fetch(`/api/campgrounds/${params.id}`, {
            method: "PUT",
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
            return navigate(`/campgrounds/${resData.id}`);
        }
        // reset();
    };
    return (
        <div className="app__newCamp">
            <h1>Edit Campground</h1>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="app__newCamp-form">
                {errors.root?.serverError && (
                    <p className="errorText">
                        {errors.root.serverError.type} -{" "}
                        {errors.root.serverError.message}
                    </p>
                )}
                <div className="app__newCamp-input">
                    <label htmlFor="title">Title</label>
                    <input
                        {...register("campground[title]")}
                        id="title"
                        type="text"
                    />
                    {errors.campground?.title && (
                        <p className="errorText">
                            {errors.campground.title.message}
                        </p>
                    )}
                </div>
                <div className="app__newCamp-input">
                    <label htmlFor="location">Location</label>
                    <input
                        {...register("campground[location]")}
                        id="location"
                        type="text"
                    />
                    {errors.campground?.location && (
                        <p className="errorText">
                            {errors.campground.location.message}
                        </p>
                    )}
                </div>
                <div className="app__newCamp-input">
                    <label htmlFor="price">Campground Price</label>
                    <input
                        {...register("campground[price]", {
                            valueAsNumber: true
                        })}
                        id="price"
                        type="number"
                    />
                    {errors.campground?.price && (
                        <p className="errorText">
                            {errors.campground.price.message}
                        </p>
                    )}
                </div>
                <div className="app__newCamp-input">
                    <label htmlFor="description">Description</label>
                    <textarea
                        {...register("campground[description]")}
                        rows="3"
                        id="description"></textarea>
                    {errors.campground?.description && (
                        <p className="errorText">
                            {errors.campground.description.message}
                        </p>
                    )}
                </div>
                <div className="app__newCamp-input">
                    <label htmlFor="images">Upload image (max 5)</label>
                    <div className="app__image-input">
                        <input
                            {...register("campground[images]")}
                            id="images"
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) => setFiles(e.target.files)}
                        />
                        <button type="button" onClick={handleImageUpload}>
                            {uploading ? "Uploading..." : "Upload"}
                        </button>
                    </div>
                    {errors.campground?.images && (
                        <p className="errorText">
                            {errors.campground.images.message}
                        </p>
                    )}
                </div>
                {imageUrls.length > 0 && (
                    <div className="app__newCamp-images">
                        {imageUrls.map((url, index) => (
                            <div className="app__newImage" key={url}>
                                <img src={url} alt="campground image" />
                                <button
                                    type="button"
                                    onClick={() =>
                                        handleRemoveImage(url, index)
                                    }>
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <button
                    disabled={isSubmitting}
                    type="submit"
                    className="app__newCamp-button">
                    {isSubmitting ? "Submitting..." : "Update Campground"}
                </button>
                <Link to="/campgrounds">All Campgrounds</Link>
            </form>
        </div>
    );
};

export default EditCampground;
