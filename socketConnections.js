const Product = require("./models/Product");

exports = module.exports = function (io) {
    io.on("connection", (socket) => {
        socket.on("bid-entered", async (data) => {
            const prod = await Product.findById(data.id);
            const bids = prod.bids;
            bids.unshift({
                qty: data.value,
                byUsername: data.byUsername,
                byId: data.byId,
            });
            if (bids.length > 10) {
                let el = bids.pop();
            }
            prod.maxBid = data.value;
            await prod.save();
            io.to(data.id).emit("bid-received", bids);
        });

        socket.on("join-product", (data) => {
            socket.join(data.id);
        });

        socket.on("product-sold", (data) => {
            io.to(data.id).emit("product-sold-received", data);
        });
    });
};
