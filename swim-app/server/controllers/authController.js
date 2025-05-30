const authService = require('../services/Service');
const { log } = require('../utils/logger');

async function signup(req, res) {
    try {
        const ip = req.ip;
        const { user, accessToken, refreshToken } = await Service.signup(req.body, ip);

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'Strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        res.json({ user, accessToken });
    } catch (err) {
        console.error(err);
        const status = err.message.includes('in use') ? 409 : 500;
        res.status(status).json({ error: err.message });
    }
}

async function login(req, res) {
    try {
        const ip = req.ip;
        const { user, accessToken, refreshToken } = await Service.login(req.body.email, req.body.password, ip);

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'Strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        res.json({ user, accessToken });
    } catch (err) {
        console.error(err);
        res.status(401).json({ error: err.message });
    }
}

function logout(req, res) {
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'Strict'
    });
    log(`[LOGOUT]`, { ip: req.ip });
    res.json({ message: 'Logged out successfully' });
}

module.exports = { signup, login, logout };
