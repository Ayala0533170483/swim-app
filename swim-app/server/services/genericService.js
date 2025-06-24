const pool = require('./connection');

async function get(table, filters = {}) {
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();
        
        let sql = 'SELECT * FROM ?? WHERE is_active = true';
        const params = [table];
        for (const key in filters) {
            if (filters[key] !== undefined && filters[key] !== "") {
                sql += ` AND ${key} = ?`;
                params.push(filters[key]);
            }
        }

        const [rows] = await conn.query(sql, params);
        
        await conn.commit();
        return rows;
    } catch (error) {
        await conn.rollback();
        throw error;
    } finally {
        conn.release();
    }
}

async function create(table, data) {
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();
        
        data.is_active ??= 1;
        const [res] = await conn.query('INSERT INTO ?? SET ?', [table, data]);

        const idField = table.endsWith('s') ? table.slice(0, -1) + '_id' : 'id';
        const result = { [idField]: res.insertId, id: res.insertId, ...data };
        
        await conn.commit();
        return result;
    } catch (error) {
        await conn.rollback();
        throw error;
    } finally {
        conn.release();
    }
}

async function update(table, id, data) {
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();
        
        const idField = table.endsWith('s') ? table.slice(0, -1) + '_id' : 'id';
        const sql = `UPDATE ${table} SET ? WHERE ${idField} = ?`;
        const [result] = await conn.query(sql, [data, id]);

        console.log('Update SQL result:', result);

        if (result.affectedRows > 0) {
            const [updatedRows] = await conn.query(`SELECT * FROM ${table} WHERE ${idField} = ?`, [id]);
            await conn.commit();
            return updatedRows[0];
        } else {
            await conn.rollback();
            throw new Error('No rows were updated');
        }
    } catch (error) {
        await conn.rollback();
        console.error('Update error:', error);
        throw error;
    } finally {
        conn.release();
    }
}

async function remove(table, id) {
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();
        
        const idField = table.endsWith('s') ? table.slice(0, -1) + '_id' : 'id';
        console.log('Update - table:', table, 'idField:', idField, 'id:', id);
        
        const sql = `UPDATE ${table} SET is_active = 0 WHERE ${idField} = ?`;
        const [result] = await conn.query(sql, [id]);

        console.log('Delete SQL result:', result);
        
        await conn.commit();
        return result;
    } catch (error) {
        await conn.rollback();
        console.error('Delete error:', error);
        throw error;
    } finally {
        conn.release();
    }
}

module.exports = {
    get,
    create,
    update,
    remove
};
