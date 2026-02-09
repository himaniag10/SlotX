const jwt = require("jsonwebtoken");
require("dotenv").config();

const signAccessToken = (payload) =>
    jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    });

const verifyAccessToken = (token) =>
    jwt.verify(token, process.env.JWT_ACCESS_SECRET);

module.exports = {
    signAccessToken,
    verifyAccessToken,
};