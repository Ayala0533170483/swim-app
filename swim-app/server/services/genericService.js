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

async function create(table, data) {
    try {
        data.is_active ??= 1;
        const [res] = await pool.query('INSERT INTO ?? SET ?', [table, data]);
        
        // החזר עם contact_id כי זה השדה הראשי בטבלה
        const result = { contact_id: res.insertId, id: res.insertId, ...data };
        return result;
    } catch (error) {
        throw error;
    }
}

async function update(table, id, data) {
    try {
        // השדה הראשי בטבלת contact הוא contact_id
        const idField = table === 'contact' ? 'contact_id' : 
                       (table.endsWith('s') ? table.slice(0, -1) + '_id' : 'id');
        
        const sql = `UPDATE ${table} SET ? WHERE ${idField} = ?`;
        const [result] = await pool.query(sql, [data, id]);
        return result;
    } catch (error) {
        throw error;
    }
}

async function remove(table, id) {
    const idField = table === 'contact' ? 'contact_id' : 
                   (table.endsWith('s') ? table.slice(0, -1) + '_id' : 'id');
    const sql = `UPDATE ${table} SET is_active = 0 WHERE ${idField} = ?`;
    await pool.query(sql, [id]);
}

module.exports = {
    get,
    create,
    update,
    remove
};
