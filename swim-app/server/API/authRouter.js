const express = require('express');
const router = express.Router();
const auth = require('../controllers/authController');
const jwt = require('jsonwebtoken');
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh-secret';
const ACCESS_SECRET = process.env.JWT_SECRET || 'access-secret';

router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const ip = req.ip;

        const { user, accessToken, refreshToken } = await auth.login(email, password, ip);

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'Lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.json({ user, accessToken });
    } catch (error) {
        next(error); 
    }
});

router.post('/signup', async (req, res, next) => {
    try {
        const { name, email, password, type_id } = req.body;
        const ip = req.ip;

        const { user, accessToken, refreshToken } = await auth.signup(
            { name, email, password, type_id },
            ip
        );

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'Lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.json({ user, accessToken });

    } catch (error) {
        next(error); 
    }
});

router.post('/logout', (req, res) => {
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: false,
        sameSite: 'Lax'
    });
    res.json({ message: 'Logged out successfully' });
});

router.post('/refresh', (req, res, next) => {
    try {
        const token = req.cookies.refreshToken;
        if (!token) {
            const error = new Error('אין טוקן רענון');
            error.status = 401;
            throw error;
        }

        jwt.verify(token, REFRESH_SECRET, (err, payload) => {
            if (err) {
                const error = new Error('טוקן לא תקין');
                error.status = 403;
                return next(error);
            }

            const ip = req.ip;
            if (payload.ip !== ip) {
                const error = new Error('IP mismatch');
                error.status = 403;
                return next(error);
            }

            const newAccessToken = jwt.sign(
                { id: payload.id, email: payload.email, role: payload.role, ip: payload.ip },
                ACCESS_SECRET,
                { expiresIn: '15m' }
            );

            res.json({ accessToken: newAccessToken });
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
