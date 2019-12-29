const mongoose = require("mongoose");

/**
 *  Hackathon Model
 */

const HackathonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    coverImageUrl: String,
    description: String,
    postedBy: { type: mongoose.Schema.ObjectId, ref: "Entity" },
    registeredUsers: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
    karmaPointsOnCompletion: Number,
    difficulty: String,
    steps: [Object]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Hackathon", HackathonSchema);
