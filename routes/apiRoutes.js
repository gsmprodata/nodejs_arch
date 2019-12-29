const express = require("express");
const app = express(); 
/**
 * This portion will define the inner routes
 * Add new routes in the inner file according
 * to their action and controller..........///
 */
const leaderBoardRouter = require("./leaderboard");
const auhtRouter = require("./auth");
const hackathonRouter = require("./hackathons");
const userRouter = require("./user");
const locationRouter = require("./location");
const skillRouter = require("./skills");

/**
 * Authentication api
 */
app.use("/auth", auhtRouter);

/**
 *  Leaderboard APIs
 */
app.use("/leaderboard", leaderBoardRouter);

/**
 *  Hackathon APIs
 */
app.use("/hackathons", hackathonRouter);

/**
 * User Routes 
 */
app.use("/users", userRouter);

/**
 * Location Routes
 */
app.use("/location", locationRouter);

/**
 * Skill Routes
 */
app.use("/skill", skillRouter);

module.exports = app;
