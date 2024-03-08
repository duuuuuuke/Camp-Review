import { z } from "zod";

export const campgroundSchema = z.object({
    campground: z.object({
        title: z.string().min(1, { message: "Title is required" }),
        price: z
            .number({ invalid_type_error: "Price is required" })
            .gt(0, { message: "Price must be greater than 0" }),
        // image: z.string().min(1, { message: "Image is required" }),
        images: z.array(z.string()).min(1, { message: "Image is required" }),
        location: z.string().min(1, { message: "Location is required" }),
        description: z.string().min(1, { message: "Description is required" })
    })
});

export const userSchema = z
    .object({
        username: z.string().min(1, { message: "Username is required" }),
        email: z.string().email({ message: "Invalid email address" }),
        password: z
            .string()
            .min(8, { message: "Password must be at least 8 characters" }),
        confirmPassword: z.string()
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords must match",
        path: ["confirmPassword"]
    });

export const reviewSchema = z.object({
    review: z.object({
        rating: z.string({ invalid_type_error: "Rating is required" }),
        body: z.string().min(1, { message: "Review is required" })
    })
});
