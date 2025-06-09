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
    const token = req.cookies.accessToken;
    // const authHeader = req.headers['authorization'];
    // const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, SECRET, (err, payload) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }

        const requestIp = getRequestIp(req);
        if (payload.ip !== requestIp) {
            return res.status(403).json({ error: 'IP mismatch' });
        }
        req.user = payload;
        next();
    });
}

module.exports = verifyToken;