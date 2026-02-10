const jwt = require("jsonwebtoken");
require("dotenv").config();

const signAccessToken = (payload) =>
    jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });

const verifyAccessToken = (token) =>
    jwt.verify(token, process.env.JWT_SECRET);

module.exports = {
    signAccessToken,
    verifyAccessToken,
};