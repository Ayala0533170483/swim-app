const express = require('express');
const router = express.Router();
const auth = require('../controllers/authController');

router.post('/login', async (req, res) => {
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
        res.status(401).json({ error: error.message });
    }
});

router.post('/signup', async (req, res) => {
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
        console.error(error);
        const status = error.message.includes('in use') ? 409 : 500;
        res.status(status).json({ error: error.message });
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

router.post('/refresh', (req, res) => {
    const token = req.cookies.refreshToken;
    if (!token) return res.sendStatus(401);

    jwt.verify(token, REFRESH_SECRET, (err, payload) => {
        if (err) return res.sendStatus(403);

        const ip = req.ip;
        if (payload.ip !== ip) {
            return res.status(403).json({ error: 'IP mismatch' });
        }

        const newAccessToken = jwt.sign(
            { id: payload.id, email: payload.email, ip: payload.ip },
            ACCESS_SECRET,
            { expiresIn: '15m' }
        );

        res.json({ accessToken: newAccessToken });
    });
});
module.exports = router;
