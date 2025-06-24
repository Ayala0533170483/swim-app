const pool = require('./connection');

async function loadPermissionsFromDB() {
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();

        const sql = `
            SELECT 
                ut.type_id,
                pr.method,
                pr.route_pattern,
                pr.requires_ownership
            FROM user_type_permissions utp
            JOIN user_types ut ON utp.type_id = ut.type_id
            JOIN permission_routes pr ON utp.route_id = pr.route_id
            ORDER BY ut.type_id, pr.method, pr.route_pattern
        `;

        const [rows] = await conn.query(sql);
        await conn.commit();
        
        return rows;
    } catch (error) {
        await conn.rollback();
        throw error;
    } finally {
        conn.release();
    }
}

module.exports = {
    loadPermissionsFromDB
};
