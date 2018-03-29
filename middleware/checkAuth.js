const jwt = require('jsonwebtoken');
const jwtBlacklist = require('jwt-blacklist')(jwt);

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwtBlacklist.verify(token, process.env.JWT_KEY);
        req.userData = decoded;
        
        next();
    } catch(error) {
        res.status(401).json({
            message: 'Authorization failed'
        });
    }
};