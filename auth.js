const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.status(403).json({ redirectUrl: "/login" });
    }
    next();
};

module.exports = {
    isLoggedIn,
};
