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
        SELECT users.*, passwords.password_hash
        FROM users
        JOIN passwords ON users.id = passwords.user_id
        WHERE users.email = ?
    `;
    const [rows] = await pool.query(sql, [email]);
    return rows[0];
}
async function createUserWithPasswordHash(userData, password_hash) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        if (userData.is_active === undefined) {
            userData.is_active = true;
        }
        const [userResult] = await connection.query('INSERT INTO users SET ?', userData);
        const user_id = userResult.insertId;

        // save passwords
        await connection.query('INSERT INTO passwords SET ?', {
            user_id,
            password_hash
        });

        await connection.commit();
        return user_id;
    } catch (err) {
        await connection.rollback();
        throw err;
    } finally {
        connection.release();
    }
}

// Create a new row 
async function create(table, data) {
    data.is_active ??= true;
    const [res] = await pool.query('INSERT INTO ?? SET ?', [table, data]);
    return { id: res.insertId, ...data };
  }
  
// Update an existing row
async function update(table, id, data) {
    await pool.query('UPDATE ?? SET ? WHERE id = ?', [table, data, id]);
}

// Soft delete a row 
async function remove(table, id) {
    await pool.query('UPDATE ?? SET is_active = false WHERE id = ?', [table, id]);
}

module.exports = { get, create, update, remove, getUserWithPassword, createUserWithPasswordHash };