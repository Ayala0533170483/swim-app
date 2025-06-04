const service = require('../services/service');
const { log } = require('../utils/logger');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const SECRET = process.env.JWT_SECRET || 'access-secret';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh-secret';

async function signup(userData, ip) {
    try {
        const existingUser = await service.getUserWithPassword(userData.email);
        if (existingUser) {
            throw new Error('Email already in use');
        }

        const saltRounds = 10;
        const password_hash = await bcrypt.hash(userData.password, saltRounds);
        const newUser = await service.createUserWithPasswordHash(userData, password_hash);
        const accessToken = createAccessToken(newUser, ip);
        const refreshToken = createRefreshToken(newUser, ip);

        return { user: newUser, accessToken, refreshToken };

    } catch (err) {
        throw err;
    }

}

async function login(email, password, ip) {
    try {
        const user = await service.getUserWithPassword(email);
        if (!user) {
            throw new Error('שגיאת שרת,נסה שוב');
        }

        const isValidPassword = await bcrypt.compare(password, user.password_hash);
        if (!isValidPassword) {
            throw new Error('אחד או יותר מהפרטים שהזנת שגוי');
        }
        const { password_hash, ...userWithoutPassword } = user;

        // יצירת טוקנים
        const accessToken = createAccessToken(userWithoutPassword, ip);
        const refreshToken = createRefreshToken(userWithoutPassword, ip);

        return { user: userWithoutPassword, accessToken, refreshToken };
    } catch (err) {
        throw err;
    }
}

function createAccessToken(user, ip) {
    return jwt.sign(
        { id: user.user_id, email: user.email, ip },
        SECRET,
        { expiresIn: '15m' }
    );
}

function createRefreshToken(user, ip) {
    return jwt.sign(
        { id: user.user_id, email: user.email, ip },
        REFRESH_SECRET,
        { expiresIn: '7d' }
    );
}

// הוסף את הפונקציה הזאת בסוף הקובץ, לפני module.exports:

async function refreshAccessToken(refreshToken, ip) {
    try {
        // בדוק אם הרפרש טוקן תקף
        const decoded = jwt.verify(refreshToken, REFRESH_SECRET);

        // בדוק IP (אבטחה)
        if (decoded.ip !== ip) {
            throw new Error('IP mismatch');
        }

        // בדוק שהמשתמש עדיין קיים בדטהבייס
        const user = await service.getUserById(decoded.id);
        if (!user || !user.is_active) {
            throw new Error('User not found');
        }

        // צור Access Token חדש (משתמש בפונקציה שכבר יש לך)
        const newAccessToken = createAccessToken(user, ip);

        return { user, accessToken: newAccessToken };

    } catch (err) {
        throw new Error('Invalid refresh token');
    }
}

module.exports = { signup, login, refreshAccessToken };

