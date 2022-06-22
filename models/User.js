const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        trim: true,
        unique: true,
        required: true,
    },
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
            },
            _id: false,
        },
    ],
    bidsWon: [
        {
            name: String,
            img: String,
            desc: String,
            byUsername: String,
            price: Number,
        },
    ],
    pastProducts: [
        {
            name: String,
            img: String,
            desc: String,
            byUsername: String,
            price: Number,
        },
    ],
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);

module.exports = User;
