/**
 * Requiring dependencies
 */
import models from "./models_sql";
require("dotenv").config();
//import models from './models_sql';

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const formidable = require("express-formidable");
const session = require("express-session");
const passport = require("passport");
const hb = require("express-handlebars");
const flash = require("connect-flash");


/**
 * Instantiating the application
 */
const app = express();
const jwt = require("./helpers/jwt.helper");
app.use(cookieParser());
// app.use(formidable());
app.use(session({ secret: process.env.SESSION_SECRET }));

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  require("./models/user").findById(id, (err, user) => {
    done(err, user);
  });
});

/**
 * Setting up postgres connection.....
 */
models.sequelize.sync().then(() => {
  app.listen(8081);
});

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

/**
 * Configuring the application
 */
app.use(cors());
app.use("/api", jwt());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.engine("handlebars", hb());
app.set("view engine", "handlebars");
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true
});
app.use("/assets", express.static(require("path").join(__dirname, "/assets")));

/**
 * Frontend & API Routes
 */
app.use("/", require("./routes/index"));
// API Routes
app.use("/api", require("./routes/apiRoutes"));
  // Frontend Catch-all Routes
app.use("/dashboard", require("./routes/frontendRoutes"));
app.use("/profile/:id", require("./routes/frontendRoutes"));


app.get(/([a-zA-Z0-9\s_\\.\-\(\):])+(.js|.json|.ico)$/i, (req, res) =>
  res.sendFile(require("path").join(__dirname, "client/build", req.url))
);

app.use(
  "/static",
  express.static(require("path").join(__dirname, "client/build/static"))
);

/**
 * Setup listening port for the application
 */

const PORT = process.env.PORT || 5011;
app.listen(PORT, () =>
  console.log(`Backend started on http://localhost:${PORT}`)
);
mongoose.connection.once("open", () => console.log("Database connected"));
mongoose.Promise = global.Promise;
//module.exports = { app };
