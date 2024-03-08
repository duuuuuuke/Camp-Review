const express = require("express");
const router = express.Router();

const users = require("../controllers/users");

const catchAsync = require("../utils/catchAsync");

const { storeReturnTo } = require("../middleware");

router.post("/register", catchAsync(users.register));

router.post("/login", users.login);

router.get("/logout", users.logout);

module.exports = router;
