const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Product = require("../models/Product");
const passport = require("passport");
const { isLoggedIn } = require("../auth");

router.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({
            username: username,
            email: email,
        });
        await User.register(user, password);
        res.status(200).json({ msg: "Registered Successfully" });
    } catch (err) {
        res.send(err);
    }
});

router.post("/login", passport.authenticate("local", {}), (req, res) => {
    const { username } = req.body;
    console.log(`${username} loggedIn`);
    console.log(req.user._id);
    const data = {
        _id: req.user._id,
        email: req.user.email,
        username: req.user.username,
        products: req.user.products,
        bidsWon: req.user.bidsWon,
    };
    console.log(req.user);
    res.send(data);
});

router.get("/logout", function (req, res, next) {
    req.logout(function (err) {
        if (err) {
            res.send(err);
        }
        res.send("Logged Out Successfully");
    });
});

router.get("/authenticate", (req, res) => {
    console.log("User");
    console.log(req.user);
    if (req.isAuthenticated()) {
        res.status(200).send(req.user);
    } else {
        res.status(404).send({});
    }
});

router.get("/getuser", (req, res) => {
    console.log("The user is");
    console.log(req.user);
    res.send(req.user);
});

router.get("/userProducts", isLoggedIn, async (req, res) => {
    console.log("in userProducts");
    console.log(req.user);
    const currentUser = await User.findById(req.user._id).populate(
        "products.product"
    );
    console.log("currentUser is");
    console.log(currentUser);
    console.log("currentUser was");
    res.send(currentUser);
});

router.get("/getBidsWon", isLoggedIn, (req, res) => {
    const currUser = req.user;
    console.log("Bids won");
    console.log(currUser);
    const bidsWon = currUser.bidsWon;
    res.send(bidsWon);
});

module.exports = router;
