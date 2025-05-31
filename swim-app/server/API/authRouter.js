const express = require('express');
const router = express.Router();
const auth = require('../controllers/authController');

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const ip = req.ip;
        
        const { user, accessToken, refreshToken } = await auth.login(email, password, ip);

        // HTTP handling - cookies ו-response
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false, // שנה ל-true בפרודקשן
            sameSite: 'Strict',
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

        // HTTP handling - cookies ו-response
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false, // שנה ל-true בפרודקשן
            sameSite: 'Strict',
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
        sameSite: 'Strict'
    });
    res.json({ message: 'Logged out successfully' });
});

module.exports = router;
