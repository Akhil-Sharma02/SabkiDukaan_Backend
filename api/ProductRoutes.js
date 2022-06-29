const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Product = require("../models/Product");

router.post("/postproduct", async (req, res) => {
    const currentUser = req.user;
    const prod = {
        ...req.body,
        byId: req.user._id,
        byUsername: req.user.username,
    };
    if (prod.img === "")
        prod.img =
            "https://lightwidget.com/wp-content/uploads/local-file-not-found.png";
    const p = await Product.create(prod);
    await currentUser.products.push({ product: p });
    await currentUser.save();
});

router.get("/products", async (req, res) => {
    const prods = await Product.find({});
    res.send(prods);
});

router.get("/product/:id", async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.send(product);
});

router.delete("/product/:id", async (req, res) => {
    const currentUser = await User.findById(req.user._id).populate(
        "products.product"
    );
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    const newarr = currentUser.products.filter((prod) => {
        return String(prod.product._id) != id;
    });
    currentUser.products = newarr;
    await currentUser.save();
    res.send("OK");
});

router.get("/sellproduct/:id", async (req, res) => {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    const buyUserId = product.bids[0].byId;
    const buyUser = await User.findById(buyUserId);
    const bidsWon = buyUser.bidsWon;
    const prod = {
        name: product.name,
        img: product.img,
        desc: product.desc,
        byUsername: product.byUsername,
        price: product.maxBid,
    };
    bidsWon.unshift(prod);
    await buyUser.save();
    const sellUser = req.user;
    const pastProd = sellUser.pastProducts;
    pastProd.push(prod);
    const prods = sellUser.products;
    const newarr = prods.filter((prod) => {
        return String(prod.product._id) != id;
    });
    sellUser.products = newarr;
    await sellUser.save();
    res.send("Okay");
});

module.exports = router;
