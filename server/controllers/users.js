const User = require("../models/user");

const passport = require("passport");
const jwt = require("jsonwebtoken");

module.exports.register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username, email });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            const token = jwt.sign(
                { userId: user._id },
                process.env.JWT_SECRET,
                { expiresIn: "1d" }
            );
            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                expires: new Date(Date.now() + 1000 * 60 * 60 * 24)
            });
            res.json({
                success: true,
                message: "Successfully registered",
                userId: user._id
            });
        });
    } catch (e) {
        return next(e);
    }
};

module.exports.login = (req, res) => {
    if (!req.body.username) {
        res.json({ success: false, message: "Username is required" });
    } else if (!req.body.password) {
        res.json({ success: false, message: "Password is required" });
    } else {
        passport.authenticate("local", (err, user, info) => {
            if (err) {
                res.json({ success: false, message: err });
            } else {
                if (!user) {
                    res.json({
                        success: false,
                        message: "Username or password is incorrect"
                    });
                } else {
                    req.login(user, (err) => {
                        if (err) {
                            res.json({ success: false, message: err });
                        }
                        const token = jwt.sign(
                            { userId: user._id },
                            process.env.JWT_SECRET,
                            { expiresIn: "1d" }
                        );
                        res.cookie("token", token, {
                            httpOnly: true,
                            secure: process.env.NODE_ENV === "production",
                            sameSite: "strict",
                            expires: new Date(Date.now() + 1000 * 60 * 60 * 24)
                        });
                        res.json({
                            success: true,
                            message: "Successfully logged in",
                            userId: user._id
                        });
                    });
                }
            }
        })(req, res);
    }
};

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.cookie("token", "", { httpOnly: true, expires: new Date(0) });
        res.json({ success: true, message: "Successfully logged out" });
    });
};
