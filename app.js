const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const methodOverride = require("method-override");
const morgan = require("morgan");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const expressSession = require("express-session");

const config = require("./config");

const Movie = require("./models/movie");
const Comment = require("./models/comment");
const User = require("./models/user");

const movieRoutes = require("./routes/movies");
const commentRoutes = require("./routes/comments");
const mainRoutes = require("./routes/main");
const authRoutes = require("./routes/auth");


mongoose.connect(config.db.connection, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});

mongoose.Promise = global.Promise;

console.log(config.db.username);

app.set("view engine", "ejs");
app.use(express.static("public"));

app.use(expressSession({
	secret: "ashdhai0hsidjasasdpoajoj123jaish0hasd",
	resave: false,
	saveUninitialized: false
}));

app.use(bodyParser.urlencoded({extended: true}));


app.use(methodOverride("_method"));

app.use(passport.initialize());
app.use(passport.session()); //Allows persistent sessions.
passport.serializeUser(User.serializeUser()); // What data shoudl be stored in session
passport.deserializeUser(User.deserializeUser()); // Get the user data from the stored session
passport.use(new LocalStrategy(User.authenticate())); // Use the local strategy

app.use(morgan("tiny"));

// const seed = require("./utils/seed");
// seed();

//Current user middleware config
app.use((req, res, next) => {
	res.locals.user = req.user;
	next();
})

app.use(mainRoutes);
app.use(authRoutes);
app.use("/movies/:id/comments", commentRoutes);
app.use("/movies", movieRoutes);


app.listen(3000, () => {
	console.log("Running on port 3000");
});
