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
    const data = {
        _id: req.user._id,
        email: req.user.email,
        username: req.user.username,
        products: req.user.products,
        bidsWon: req.user.bidsWon,
    };
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
    if (req.isAuthenticated()) {
        res.status(200).send(req.user);
    } else {
        res.status(404).send({});
    }
});

router.get("/getuser", (req, res) => {
    res.send(req.user);
});

router.get("/userProducts", isLoggedIn, async (req, res) => {
    const currentUser = await User.findById(req.user._id).populate(
        "products.product"
    );
    res.send(currentUser);
});

router.get("/getBidsWon", isLoggedIn, (req, res) => {
    const currUser = req.user;
    const bidsWon = currUser.bidsWon;
    res.send(bidsWon);
});

module.exports = router;
