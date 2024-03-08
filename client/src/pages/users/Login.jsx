import "./Login.scss";

import { useNavigate, redirect } from "react-router-dom";

import { useForm } from "react-hook-form";

import store from "../../store";
import { useDispatch } from "react-redux";
import { authActions } from "../../slices/authSlice";

export const loader = () => {
    const userInfo = store.getState().auth.userInfo;
    if (userInfo) return redirect("/campgrounds", { replace: true });
    return null;
};

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError
    } = useForm();
    const onSubmit = async (data) => {
        const res = await fetch("/api/auth/login", {
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
        <div className="app__login-container">
            <div className="app__login-img">
                <img
                    src="https://images.unsplash.com/photo-1571863533956-01c88e79957e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1267&q=80"
                    alt="image"
                />
            </div>
            <div className="app__login-formContainer">
                <div className="app__login-form">
                    <h3>Login</h3>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        {errors.root?.serverError && (
                            <p className="errorText">
                                {errors.root.serverError.message}
                            </p>
                        )}
                        <div className="app__login-input">
                            <label htmlFor="username">Username</label>
                            <input
                                {...register("username", {
                                    required: "username is required"
                                })}
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
                        <div className="app__login-input">
                            <label htmlFor="password">Password</label>
                            <input
                                {...register("password", {
                                    required: "password is required"
                                })}
                                type="password"
                                id="password"
                            />
                            {errors.password && (
                                <p className="errorText">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>
                        <button
                            className="app__login-btn"
                            type="submit"
                            disabled={isSubmitting}>
                            {isSubmitting ? "Logging in..." : "Login"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
