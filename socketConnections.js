const Product = require("./models/Product");

exports = module.exports = function (io) {
    io.on("connection", (socket) => {
        console.log(`User Connected: ${socket.id}`);
        socket.on("bid-entered", async (data) => {
            console.log("Bid entered backend socket");
            const prod = await Product.findById(data.id);
            const bids = prod.bids;
            bids.unshift({
                qty: data.value,
                byUsername: data.byUsername,
                byId: data.byId,
            });
            if (bids.length > 10) {
                console.log("Poping");
                let el = bids.pop();
                console.log(el);
            }
            prod.maxBid = data.value;
            await prod.save();
            io.to(data.id).emit("bid-received", bids);
        });

        socket.on("join-product", (data) => {
            console.log("join product backend socket");
            console.log("Joined");
            socket.join(data.id);
        });

        socket.on("product-sold", (data) => {
            io.to(data.id).emit("product-sold-received", data);
        });
    });
};
