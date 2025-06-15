
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
        console.log(`=== Service.create called ===`);
        console.log(`Table: ${table}`);
        console.log('Data before processing:', JSON.stringify(data, null, 2));

        data.is_active ??= 1;
        console.log('Data after adding is_active:', JSON.stringify(data, null, 2));

        console.log('Executing SQL query...');
        const [res] = await pool.query('INSERT INTO ?? SET ?', [table, data]);
        console.log('SQL result:', res);

        const result = { id: res.insertId, ...data };
        console.log('Returning result:', JSON.stringify(result, null, 2));
        console.log(`=== Service.create completed ===`);

        return result;
    } catch (error) {
        console.error(`=== Service.create error ===`);
        console.error('SQL Error:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        throw error;
    }
}

async function update(table, type, id, data) {
    const sql = `UPDATE ?? SET ? WHERE ?? = ?`;
    await pool.query(sql, [table, data, type, id]);
}

async function remove(table, id) {
    const idField = table === 'contact' ? 'id' : (table.endsWith('s') ? table.slice(0, -1) + '_id' : 'id');
    const sql = `UPDATE ${table} SET is_active = 0 WHERE ${idField} = ?`;
    await pool.query(sql, [id]);
}


module.exports = {
    get,
    create,
    update,
    remove
};
