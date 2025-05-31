const service = require('../services/service');
const { log } = require('../utils/logger');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const SECRET = process.env.JWT_SECRET || 'access-secret';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh-secret';

async function signup(userData, ip) {
    try {
        // בדיקת קיום משתמש
        const existingUser = await service.getUserWithPassword(userData.email);
        if (existingUser) {
            throw new Error('Email already in use');
        }

        // הצפנת הסיסמה
        const saltRounds = 10;
        const password_hash = await bcrypt.hash(userData.password, saltRounds);

        // יצירת המשתמש
        const newUser = await service.createUserWithPasswordHash(userData, password_hash);
        
        // יצירת טוקנים
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
            throw new Error('Invalid credentials');
        }

        const isValidPassword = await bcrypt.compare(password, user.password_hash);
        if (!isValidPassword) {
            throw new Error('Invalid credentials');
        }

        // הסרת הסיסמה מהתשובה
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

async function getItems(table, filters = {}) {
    const result = await service.get(table, filters);
    log(`[GET]`, { table, filters });
    return result;
}

module.exports = { signup, login, getItems };
