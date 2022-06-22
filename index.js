const express = require("express");
const app = express();
const mongoose = require("mongoose");
const UserRoutes = require("./api/UserRoutes");
const ProductRoutes = require("./api/ProductRoutes");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const passport = require("passport");
const localStrategy = require("passport-local");
const http = require("http");
const User = require("./models/User");
const { Server } = require("socket.io");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
        console.log("DB Connected");
    })
    .catch((err) => {
        console.log(err);
    });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV === "production") {
    app.set("trust proxy", 1);
}
app.use(
    cors({
        origin: ["http://localhost:3000", "https://sabkidukaan.netlify.app"],
        credentials: true,
    })
);
const storeMongo = new MongoDBStore({
    uri: process.env.MONGO_URL,
    collection: "mySessions",
});
app.use(
    session({
        name: "Test Cookie",
        secret: process.env.SECRET,
        resave: true,
        saveUninitialized: true,
        proxy: process.env.NODE_ENV === "production",
        cookie: {
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 1000 * 60 * 100,
            secure: process.env.NODE_ENV === "production",
        },
        store: storeMongo,
    })
);
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        orign: ["http://localhost:3000", "https://sabkidukaan.netlify.app"],
        method: ["GET", "POST"],
    },
});
const ioconnection = require("./socketConnections")(io);
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(UserRoutes);
app.use(ProductRoutes);
const port = process.env.PORT || 8000;
server.listen(port, () => {
    console.log(`Server running at port ${port}`);
});
