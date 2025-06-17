const usersService = require('../services/usersService');
const { log } = require('../utils/logger');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const SECRET = process.env.JWT_SECRET || 'access-secret';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh-secret';

async function signup(userData, ip) {
    try {
        const existingUser = await usersService.getUserWithPassword(userData.email);
        if (existingUser) {
            throw new Error('Email already in use');
        }

        const saltRounds = 10;
        const password_hash = await bcrypt.hash(userData.password, saltRounds);
        const newUser = await usersService.createUserWithPasswordHash(userData, password_hash);
        const accessToken = createAccessToken(newUser, ip);
        const refreshToken = createRefreshToken(newUser, ip);

        return { user: newUser, accessToken, refreshToken };

    } catch (err) {
        throw err;
    }

}

async function login(email, password, ip) {
    try {
        const user = await usersService.getUserWithPassword(email);
        if (!user) {
            throw new Error('שגיאת שרת,נסה שוב');
        }

        const isValidPassword = await bcrypt.compare(password, user.password_hash);
        if (!isValidPassword) {
            throw new Error('אחד או יותר מהפרטים שהזנת שגוי');
        }
        const { password_hash, ...userWithoutPassword } = user;

        const accessToken = createAccessToken(userWithoutPassword, ip);
        const refreshToken = createRefreshToken(userWithoutPassword, ip);

        return { user: userWithoutPassword, accessToken, refreshToken };
    } catch (err) {
        throw err;
    }
}

function createAccessToken(user, ip) {
    return jwt.sign(
        { id: user.user_id, email: user.email,role: user.type_name, ip },
        SECRET,
        { expiresIn: '15m' }
    );
}

function createRefreshToken(user, ip) {
    return jwt.sign(
        { id: user.user_id, email: user.email,role: user.type_name, ip },
        REFRESH_SECRET,
        { expiresIn: '7d' }
    );
}

async function refreshAccessToken(refreshToken, ip) {
    try {
        const decoded = jwt.verify(refreshToken, REFRESH_SECRET);
        if (decoded.ip !== ip) {
            throw new Error('IP mismatch');
        }

        const user = await usersService.getUserById(decoded.id);
        if (!user || !user.is_active) {
            throw new Error('User not found');
        }

        const newAccessToken = createAccessToken(user, ip);

        return { user, accessToken: newAccessToken };

    } catch (err) {
        throw new Error('Invalid refresh token');
    }
}

module.exports = { signup, login, refreshAccessToken };

//קש 