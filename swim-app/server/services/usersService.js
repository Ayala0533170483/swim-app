const pool = require('./connection');

async function getUserWithPassword(email) {
    const sql = `
        SELECT 
            users.user_id,
            users.name,
            users.email,
            users.type_id,
            users.is_active,
            passwords.password_hash,
            user_types.type_name
        FROM users
        JOIN passwords ON users.user_id = passwords.user_id
        LEFT JOIN user_types ON users.type_id = user_types.type_id
        WHERE users.email = ? AND users.is_active = 1
    `;
    const [rows] = await pool.query(sql, [email]);
    return rows[0];
}

async function createUserWithPasswordHash(userData, password_hash) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        if (userData.is_active === undefined) {
            userData.is_active = 1;
        }

        const [userResult] = await connection.query('INSERT INTO users SET ?', {
            name: userData.name,
            email: userData.email,
            type_id: userData.type_id,
            is_active: userData.is_active
        });

        const user_id = userResult.insertId;
        await connection.query('INSERT INTO passwords SET ?', {
            user_id,
            password_hash
        });

        await connection.commit();
        const newUser = await getUserById(user_id);
        return newUser;

    } catch (err) {
        await connection.rollback();
        throw err;
    } finally {
        connection.release();
    }
}

async function getUserById(user_id) {
    const sql = `
        SELECT 
            users.user_id,
            users.name,
            users.email,
            users.type_id,
            users.is_active,
            user_types.type_name
        FROM users
        LEFT JOIN user_types ON users.type_id = user_types.type_id
        WHERE users.user_id = ?
    `;
    const [rows] = await pool.query(sql, [user_id]);
    return rows[0];
}

async function getAllUsersByType(typeName) {
    const type = typeName.endsWith('s') ? typeName.slice(0, -1) : typeName;

    const sql = `
        SELECT 
            u.user_id,
            u.name,
            u.email,
            u.is_active,
            ut.type_name
        FROM users AS u
        LEFT JOIN user_types AS ut ON u.type_id = ut.type_id
        WHERE ut.type_name = ? AND u.is_active = 1
        ORDER BY u.name
    `;
    const [rows] = await pool.query(sql, [type]);
    return rows;
}

module.exports = {
    getUserWithPassword,
    createUserWithPasswordHash,
    getUserById,
    getAllUsersByType
};