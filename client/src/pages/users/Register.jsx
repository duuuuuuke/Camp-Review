import "./Register.scss";

import { useNavigate, redirect } from "react-router-dom";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSchema } from "../../validationSchemas.js";

import { useDispatch } from "react-redux";
import { authActions } from "../../slices/authSlice";
import store from "../../store.js";

export const loader = () => {
    const userInfo = store.getState().auth.userInfo;
    if (userInfo) return redirect("/campgrounds", { replace: true });
    return null;
};

const Register = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError
    } = useForm({
        resolver: zodResolver(userSchema)
    });

    const onSubmit = async (data) => {
        const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        const resData = await res.json();
        if (resData.success === false) {
            setError("root.serverError", {
                message: resData.message
            });
        } else {
            dispatch(
                authActions.setCredentials({
                    username: data.username,
                    userId: resData.userId
                })
            );
            return navigate("/campgrounds", { replace: true });
        }
        // reset();
    };
    return (
        <div className="app__register-container">
            <div className="app__register-img">
                <img
                    src="https://images.unsplash.com/photo-1571863533956-01c88e79957e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1267&q=80"
                    alt="image"
                />
            </div>
            <div className="app__register-formContainer">
                <div className="app__register-form">
                    <h3>Register</h3>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        {errors.root?.serverError && (
                            <p className="errorText">
                                {errors.root.serverError.message}
                            </p>
                        )}
                        <div className="app__register-input">
                            <label htmlFor="username">Username</label>
                            <input
                                {...register("username")}
                                type="text"
                                id="username"
                                autoComplete="on"
                            />
                            {errors.username && (
                                <p className="errorText">
                                    {errors.username.message}
                                </p>
                            )}
                        </div>
                        <div className="app__register-input">
                            <label htmlFor="email">Email</label>
                            <input
                                {...register("email")}
                                id="email"
                                autoComplete="on"
                            />
                            {errors.email && (
                                <p className="errorText">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>
                        <div className="app__register-input">
                            <label htmlFor="password">Password</label>
                            <input
                                {...register("password")}
                                type="password"
                                id="password"
                            />
                            {errors.password && (
                                <p className="errorText">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>
                        <div className="app__register-input">
                            <label htmlFor="confirmPassword">
                                Confirm Password
                            </label>
                            <input
                                {...register("confirmPassword")}
                                type="password"
                                id="confirmPassword"
                            />
                            {errors.confirmPassword && (
                                <p className="errorText">
                                    {errors.confirmPassword.message}
                                </p>
                            )}
                        </div>

                        <button
                            className="app__register-btn"
                            type="submit"
                            disabled={isSubmitting}>
                            {isSubmitting ? "Registering..." : "Register"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
