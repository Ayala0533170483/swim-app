const pool = require('./connection');

async function get(table, filters = {}) {
    let sql = 'SELECT * FROM ?? WHERE is_active = true';
    const params = [table];
    for (const key in filters) {
        if (filters[key] !== undefined && filters[key] !== "") {
            sql += ` AND ${key} = ?`;
            params.push(filters[key]);
        }
    }
    const [rows] = await pool.query(sql, params);
    return rows;
}

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

async function create(table, data) {
    data.is_active ??= 1;
    const [res] = await pool.query('INSERT INTO ?? SET ?', [table, data]);
    return { id: res.insertId, ...data };
}

async function update(table, id, data) {
    const idField = table === 'users' ? 'user_id' : 'id';
    await pool.query(`UPDATE ?? SET ? WHERE ${idField} = ?`, [table, data, id]);
}

async function remove(table, id) {
    const idField = table === 'users' ? 'user_id' : 'id';
    await pool.query(`UPDATE ?? SET is_active = 0 WHERE ${idField} = ?`, [table, id]);
}

module.exports = {
    get,
    create,
    update,
    remove,
    getUserWithPassword,
    createUserWithPasswordHash,
    getUserById
};
