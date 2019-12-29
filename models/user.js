const mongoose = require("mongoose");
const findOrCreate = require("mongoose-findorcreate");

/**
 *  User Model
 */

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    emailIsVerified: {
      type: Boolean,
      default: false,
      required: true
    },
    password: {
      type: String,
      default: ""
    },
    about: {
      type: String,
      trim: true
    },
    isDeactivated: {
      type: Boolean,
      default: false,
      required: true
    },
    regCodeRequired: Boolean,
    profileImageUrl: String,
    following: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
    followers: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
    hackathonsRegisteredFor: [
      { type: mongoose.Schema.ObjectId, ref: "Hackathon" }
    ],
    id: false,
    facebookId: String,
    facebookUrl: String,
    githubId: String,
    githubUrl: String,
    googleId: String,
    googleUrl: String,
    linkedinId: String,
    linkedinUrl: String,
    interests: [String],
    projects: [Object],
    previousInternships: [Object],
    previousWorkExperience: [Object],
    papersPublished: [Object],
    academicDetails: [Object],
    achievements: [Object],
    skills: [String],
    contributions: [Object],
    githubUsername: String
  },
  {
    timestamps: true
  }
);
UserSchema.plugin(findOrCreate);
UserSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("User", UserSchema);
