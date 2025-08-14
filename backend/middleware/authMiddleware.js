const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    // Get token from headers
    const authHeader = req.header("Authorization");
    if (!authHeader) {
        return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.replace("Bearer ", "").trim();

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach decoded payload to request
        req.user = { id: decoded.userId };

        next();
    } catch (err) {
        console.error("JWT verification failed:", err);
        res.status(401).json({ error: "Invalid or expired token" });
    }
};
