const pool = require('./connection');

async function createRequest(requestData) {
    try {
        requestData.is_active ??= 1;
        const [res] = await pool.query('INSERT INTO lesson_requests SET ?', requestData);
        
        const result = { 
            request_id: res.insertId, 
            id: res.insertId, 
            ...requestData 
        };
        return result;
    } catch (error) {
        throw error;
    }
}

async function getTeacherRequests(teacherId) {
    const sql = `
        SELECT 
            lr.*,
            s.name as student_name,
            s.email as student_email,
            t.name as teacher_name,
            p.name as pool_name
        FROM lesson_requests lr
        JOIN users s ON lr.student_id = s.user_id
        JOIN users t ON lr.teacher_id = t.user_id
        LEFT JOIN pools p ON lr.pool_id = p.pool_id
        WHERE lr.teacher_id = ? 
        AND lr.is_active = 1
        ORDER BY lr.requested_date DESC
    `;
    
    const [rows] = await pool.query(sql, [teacherId]);
    return rows;
}

async function getStudentRequests(studentId) {
    const sql = `
        SELECT 
            lr.*,
            t.name as teacher_name,
            p.name as pool_name
        FROM lesson_requests lr
        JOIN users t ON lr.teacher_id = t.user_id
        LEFT JOIN pools p ON lr.pool_id = p.pool_id
        WHERE lr.student_id = ? 
        AND lr.is_active = 1
        ORDER BY lr.requested_date DESC
    `;
    
    const [rows] = await pool.query(sql, [studentId]);
    return rows;
}

async function updateRequestStatus(requestId, statusData) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        
        // עדכן את הסטטוס (הטריגר יטפל ביצירת השיעור אם מאושר)
        const updateSql = `UPDATE lesson_requests SET status = ? WHERE request_id = ?`;
        const [result] = await connection.query(updateSql, [statusData.status, requestId]);
        
        if (result.affectedRows === 0) {
            throw new Error('No rows were updated');
        }
        
        // אם הסטטוס הוא approved או rejected, עדכן is_active ל-0
        if (statusData.status === 'approved' || statusData.status === 'rejected') {
            const deactivateSql = `UPDATE lesson_requests SET is_active = 0 WHERE request_id = ?`;
            await connection.query(deactivateSql, [requestId]);
        }
        
        await connection.commit();
        
        // החזר את הבקשה המעודכנת
        const [updatedRows] = await connection.query(`
            SELECT 
                lr.*,
                s.name as student_name,
                s.email as student_email,
                t.name as teacher_name,
                p.name as pool_name
            FROM lesson_requests lr
            JOIN users s ON lr.student_id = s.user_id
            JOIN users t ON lr.teacher_id = t.user_id
            LEFT JOIN pools p ON lr.pool_id = p.pool_id
            WHERE lr.request_id = ?
        `, [requestId]);
        
        return updatedRows[0];
        
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

async function getRequestById(requestId, teacherId) {
    const sql = `
        SELECT 
            lr.*,
            s.name as student_name,
            s.email as student_email,
            t.name as teacher_name,
            p.name as pool_name
        FROM lesson_requests lr
        JOIN users s ON lr.student_id = s.user_id
        JOIN users t ON lr.teacher_id = t.user_id
        LEFT JOIN pools p ON lr.pool_id = p.pool_id
        WHERE lr.request_id = ? AND lr.teacher_id = ? AND lr.is_active = 1
    `;
    const [rows] = await pool.query(sql, [requestId, teacherId]);
    return rows;
}

module.exports = {
    createRequest,
    getTeacherRequests,
    getStudentRequests,
    updateRequestStatus,
    getRequestById
};
