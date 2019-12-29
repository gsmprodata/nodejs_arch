require("dotenv").config({ path: "../.env" });
const jwtActual = require("jsonwebtoken");

const getCalimsFromToken = (req) => {
    let token = req.headers["x-access-token"] || req.headers["authorization"]; // Express headers are auto converted to lowercase
    if (token.startsWith("Bearer ")) {
        // Remove Bearer from string
        token = token.slice(7, token.length);
    }
    var verifyOptions = {
        expiresIn:  "12h",
        algorithm:  ["HS512"]
       };
    let publicKEY = process.env.USER_AUTH_SECRET;
    let legit = "";
    try
    {
       legit = jwtActual.verify(token, publicKEY, verifyOptions);
    }
    catch(err){
        legit = err;
    }

    return legit;
};

const getUserIdFromToken = (req) => {
    let token = req.headers["x-access-token"] || req.headers["authorization"]; // Express headers are auto converted to lowercase
    if (token.startsWith("Bearer ")) {
        // Remove Bearer from string
        token = token.slice(7, token.length);
    }
    var verifyOptions = {
        expiresIn:  "12h",
        algorithm:  ["HS512"]
       };
    let publicKEY = process.env.USER_AUTH_SECRET;
    let legit = "";
    try
    {
       legit = jwtActual.verify(token, publicKEY, verifyOptions);
    }
    catch(err){
        legit = err;
    }

    return legit.sub;
};

module.exports = {
    getCalimsFromToken,
    getUserIdFromToken
};