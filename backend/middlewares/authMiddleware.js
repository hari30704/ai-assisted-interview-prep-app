const jwt = require('jsonwebtoken')
const User = require("../models/User");

//Middleware to prevent unauthorized access
const protect = async (req, res, next) => {
    try {
        let token = req.headers.authorization;

        if (!token || !token.startsWith("Bearer")) {
            return res.status(401).json({ message: "Not authorized, no token" });
        }
        
        token = token.split(" ")[1]; // Extract token from Bearer
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password");
        next();   
    } catch (error) {
        res.status(401).json({ message: " token failed", error: error.message });
    }
};

module.exports = { protect };