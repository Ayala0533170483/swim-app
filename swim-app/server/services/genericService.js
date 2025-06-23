// const pool = require('./connection');

// async function get(table, filters = {}) {
//     let sql = 'SELECT * FROM ?? WHERE is_active = true';
//     const params = [table];
//     for (const key in filters) {
//         if (filters[key] !== undefined && filters[key] !== "") {
//             sql += ` AND ${key} = ?`;
//             params.push(filters[key]);
//         }
//     }
//     const [rows] = await pool.query(sql, params);
//     return rows;
// }

// async function create(table, data) {
//     try {
//         data.is_active ??= 1;
//         const [res] = await pool.query('INSERT INTO ?? SET ?', [table, data]);
        
//         // החזר עם השדה הנכון לפי הטבלה
//         const idField = table === 'contact' ? 'contact_id' : 
//                        (table.endsWith('s') ? table.slice(0, -1) + '_id' : 'id');
        
//         const result = { [idField]: res.insertId, id: res.insertId, ...data };
//         return result;
//     } catch (error) {
//         throw error;
//     }
// }

// async function update(table, id, data) {
//     try {
//         // השדה הראשי בטבלת contact הוא contact_id, בטבלת pools זה pool_id
//         const idField = table === 'contact' ? 'contact_id' : 
//                        (table.endsWith('s') ? table.slice(0, -1) + '_id' : 'id');
        
//         console.log('Update - table:', table, 'idField:', idField, 'id:', id); // 🎯 דיבוג
        
//         const sql = `UPDATE ${table} SET ? WHERE ${idField} = ?`;
//         const [result] = await pool.query(sql, [data, id]);
        
//         console.log('Update SQL result:', result); // 🎯 דיבוג
        
//         // החזר את הנתונים המעודכנים
//         if (result.affectedRows > 0) {
//             // קבל את הרשומה המעודכנת
//             const [updatedRows] = await pool.query(`SELECT * FROM ${table} WHERE ${idField} = ?`, [id]);
//             return updatedRows[0];
//         } else {
//             throw new Error('No rows were updated');
//         }
//     } catch (error) {
//         console.error('Update error:', error); // 🎯 דיבוג
//         throw error;
//     }
// }

// async function remove(table, id) {
//     try {
//         const idField = table === 'contact' ? 'contact_id' : 
//                        (table.endsWith('s') ? table.slice(0, -1) + '_id' : 'id');
        
//         console.log('Delete - table:', table, 'idField:', idField, 'id:', id); // 🎯 דיבוג
        
//         const sql = `UPDATE ${table} SET is_active = 0 WHERE ${idField} = ?`;
//         const [result] = await pool.query(sql, [id]);
        
//         console.log('Delete SQL result:', result); // 🎯 דיבוג
        
//         return result.affectedRows > 0;
//     } catch (error) {
//         console.error('Delete error:', error); // 🎯 דיבוג
//         throw error;
//     }
// }

// module.exports = {
//     get,
//     create,
//     update,
//     remove
// };
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
        
        // החזר עם השדה הנכון לפי הטבלה
        const idField = table === 'contact' ? 'contact_id' : 
                       table === 'lesson_requests' ? 'request_id' :
                       (table.endsWith('s') ? table.slice(0, -1) + '_id' : 'id');
        
        const result = { [idField]: res.insertId, id: res.insertId, ...data };
        return result;
    } catch (error) {
        throw error;
    }
}

async function update(table, id, data) {
    try {
        // השדה הראשי לפי הטבלה
        const idField = table === 'contact' ? 'contact_id' : 
                       table === 'lesson_requests' ? 'request_id' :
                       (table.endsWith('s') ? table.slice(0, -1) + '_id' : 'id');
        
        console.log('Update - table:', table, 'idField:', idField, 'id:', id);
        
        const sql = `UPDATE ${table} SET ? WHERE ${idField} = ?`;
        const [result] = await pool.query(sql, [data, id]);
        
        console.log('Update SQL result:', result);
        
        if (result.affectedRows > 0) {
            const [updatedRows] = await pool.query(`SELECT * FROM ${table} WHERE ${idField} = ?`, [id]);
            return updatedRows[0];
        } else {
            throw new Error('No rows were updated');
        }
    } catch (error) {
        console.error('Update error:', error);
        throw error;
    }
}

async function remove(table, id) {
    try {
        const idField = table === 'contact' ? 'contact_id' : 
                       table === 'lesson_requests' ? 'request_id' :
                       (table.endsWith('s') ? table.slice(0, -1) + '_id' : 'id');
        
        console.log('Delete - table:', table, 'idField:', idField, 'id:', id);
        
        const sql = `UPDATE ${table} SET is_active = 0 WHERE ${idField} = ?`;
        const [result] = await pool.query(sql, [id]);
        
        console.log('Delete SQL result:', result);
        
        return result.affectedRows > 0;
    } catch (error) {
        console.error('Delete error:', error);
        throw error;
    }
}

module.exports = {
    get,
    create,
    update,
    remove
};
