const Express = require("express");
const jwtActual = require("jsonwebtoken");
const app = Express();

// Templating Routes
app.get("/", (req, res) => {
    res.render("index", { layout: "landing", title: "StreetHack" });
  });

app.get("/enterprise", (req, res) => {
res.render("enterprise", {
    layout: "landing",
    title: "Enterprise | StreetHack"
});
});

app.get("/university", (req, res) => {
res.render("university", {
    layout: "landing",
    title: "University | StreetHack"
});
});

app.get("/blockhack", (req, res) => {
res.render("blockhack", {
    layout: "landing",
    title:
    "BlockHack - IIT-KGP Global Entrepreneurship Summit 2019 | StreetHack"
});
});

app.get("/hackathon", (req, res) => {
res.render("hackathon", {
    layout: "landing",
    title: "Enterprise Hackathons | StreetHack"
});
});

app.get("/uhack", (req, res) => {
res.render("uhack", {
    layout: false,
    title: "UHack - StreetHack University Hackathons | StreetHack"
});
});

app.get("/login", (req, res) => {
if (req.user) return res.redirect("/dashboard");
const errors = req.flash().error || [];
return res.render("auth", {
    layout: false,
    login: "login",
    title: "Login to StreetHack",
    errors
});
});

app.get("/register", (req, res) => {
if (req.user) return res.redirect("/dashboard");
return res.render("auth", {
    layout: false,
    register: "register",
    title: "Register for StreetHack"
});
});

app.get("/forgotPassword", (req, res) => {
if (req.user) return res.redirect("/dashboard");
return res.render("auth", {
    layout: false,
    forgotPassword: "register",
    title: "Forgot Password | StreetHack"
});
});

app.get("/askForInvite", (req, res) => {
if (req.user) return res.redirect("/dashboard");
return res.render("askForInvite", {
    layout: false
});
});

app.post("/buildProfile", (req, res) => {
if (req.user && req.user._id == req.body.user) {
    return res.render("buildProfile", {
    layout: false,
    token: jwtActual.sign(
        { sub: req.user._id },
        process.env.USER_AUTH_SECRET,
        {
        expiresIn: "12h",
        algorithm: "HS512"
        }
    ),
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    about: req.user.about,
    githubUrl: req.user.githubUrl ? req.user.githubUrl : "",
    linkedinUrl: req.user.linkedinUrl ? req.user.linkedinUrl : "",
    facebookUrl: req.user.facebookUrl ? req.user.facebookUrl : "",
    skills: req.user.skills.join(", "),
    interests: req.user.interests.join(", "),
    projects: req.user.projects,
    previousInternships: req.user.previousInternships,
    previousWorkExperience: req.user.previousWorkExperience,
    achievements: req.user.achievements,
    academicDetails: req.user.academicDetails,
    papersPublished: req.user.papersPublished
    });
}
return res.redirect("/dashboard");
});

  module.exports = app;
  