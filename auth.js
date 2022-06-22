const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        console.log("redirecting");
        console.log(req.isAuthenticated());
        console.log(req.user);
        return res.status(403).json({ redirectUrl: "/login" });
    }
    console.log("not redirecting");
    next();
};

module.exports = {
    isLoggedIn,
};
