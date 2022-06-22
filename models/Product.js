const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    img: {
        type: String,
        trim: true,
    },
    desc: {
        type: String,
        trim: true,
    },
    maxBid: {
        type: Number,
        min: 0,
        default: 0,
    },
    bids: [
        {
            _id: false,
            qty: Number,
            byUsername: String,
            byId: String,
        },
    ],
    byId: {
        type: String,
        default: "",
        trim: true,
    },
    byUsername: {
        type: String,
        default: "",
        trim: true,
    },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
