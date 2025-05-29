const dal = require('../DAL/dal');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { log } = require('../utils/logger');

const SECRET = process.env.JWT_SECRET || 'access-secret';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh-secret';

function createAccessToken(user, ip) {
    return jwt.sign(
        { id: user.id, email: user.email, ip },
        SECRET,
        { expiresIn: '15m' }
    );
}

function createRefreshToken(user, ip) {
    return jwt.sign(
        { id: user.id, email: user.email, ip },
        REFRESH_SECRET,
        { expiresIn: '7d' }
    );
}

function sendAuthTokens(res, user, ip) {
    const accessToken = createAccessToken(user, ip);
    const refreshToken = createRefreshToken(user, ip);

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'Strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({ user, accessToken });
}

async function createItem(table, data) {
    if (!data || Object.keys(data).length === 0) {
        log(`[CREATE FAILED] No data provided`, { table });
        throw new Error('Data is required');
    }
    const result = await dal.create(table, data);
    log(`[CREATE] Item created`, { table, data });
    return result;
}

async function getItems(table, filters = {}) {
    const result = dal.get(table, filters);
    log(`[GET]`, { table, filters });
    return result;
}


async function updateItem(table, id, data) {
    const result = dal.update(table, id, data);
    log(`[UPDATE]`, { table, id, data });
    return result;
}

async function deleteItem(table, id) {
    const result = dal.remove(table, id);
    log(`[DELETE]`, { table, id });
    return result;
}

async function loginUser(email, password) {
    log(`[LOGIN ATTEMPT]`, { email });
    const user = await dal.getUserWithPassword(email);
    if (!user) {
        log(`[LOGIN FAILED] Email not found`, { email });
        throw new Error('User not found');
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
        log(`[LOGIN FAILED] Wrong password`, { email });
        throw new Error('Incorrect password');
    }

    log(`[LOGIN SUCCESS]`, { userId: user.id });
    const { password_hash, ...userWithoutPassword } = user;
    return userWithoutPassword;
}

async function registerUser(userData) {
    const { password, ...userFields } = userData;
    const password_hash = await bcrypt.hash(password, 10);
    const user_id = await dal.createUserWithPasswordHash(userFields, password_hash);
    log(`[REGISTER] New user registered`, { userId: user_id, ...userFields });
    return { id: user_id, ...userFields };
}

module.exports = {
    createItem,
    getItems,
    updateItem,
    deleteItem,
    loginUser,
    registerUser,
    createAccessToken,
    createRefreshToken,
    sendAuthTokens
};