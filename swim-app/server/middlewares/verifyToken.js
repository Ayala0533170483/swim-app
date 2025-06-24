const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'access-secret';

function getRequestIp(req) {
    const forwarded = req.headers['x-forwarded-for'];
    if (forwarded) {
        return forwarded.split(',')[0];
    }
    return req.ip;
}

function verifyToken(req, res, next) {
    const path = ['/login', '/signup', '/refresh', '/logout'];
    if (path.includes(req.path)) {
        return next();
    }

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        const error = new Error('Access token required');
        error.status = 401;
        return next(error);
    }

    jwt.verify(token, SECRET, (err, payload) => {
        if (err) {
            const error = new Error('Invalid or expired token');
            error.status = 403;
            return next(error);
        }

        const requestIp = getRequestIp(req);
        if (payload.ip !== requestIp) {
            const error = new Error('IP mismatch');
            error.status = 403;
            return next(error);
        }

        req.user = payload;
        next();
    });
}

module.exports = verifyToken;
