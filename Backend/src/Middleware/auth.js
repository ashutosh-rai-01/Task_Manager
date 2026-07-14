const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                message: 'Unauthorized: No token provided',
                success: false
            });
        }

        const token = authHeader.split(' ')[1];
        const secret = process.env.JWT_SECRET;
        const decoded = jwt.verify(token, secret);
        
        req.user = decoded; // Contains user id and email
        next();
    } catch (err) {
        console.error('Auth Middleware Error:', err.message);
        return res.status(401).json({
            message: 'Unauthorized: Invalid or expired token',
            success: false
        });
    }
};

module.exports = authMiddleware;
