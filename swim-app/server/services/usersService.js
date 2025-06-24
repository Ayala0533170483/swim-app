const pool = require('./connection');

async function getUserWithPassword(email) {
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();

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
        const [rows] = await conn.query(sql, [email]);

        await conn.commit();
        return rows[0];
    } catch (error) {
        await conn.rollback();
        throw error;
    } finally {
        conn.release();
    }
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

        const newUser = await getUserByIdWithConnection(connection, user_id);

        await connection.commit();
        return newUser;

    } catch (err) {
        await connection.rollback();
        throw err;
    } finally {
        connection.release();
    }
}

async function getUserByIdWithConnection(connection, user_id) {
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
    const [rows] = await connection.query(sql, [user_id]);
    return rows[0];
}

async function getUserById(user_id) {
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();
        const user = await getUserByIdWithConnection(conn, user_id);

        await conn.commit();
        return user;
    } catch (error) {
        await conn.rollback();
        throw error;
    } finally {
        conn.release();
    }
}

async function getAllUsersByType(typeName) {
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();
        const type = typeName.endsWith('s') ? typeName.slice(0, -1) : typeName;
        const sql = `
            SELECT 
                u.user_id,
                u.name,
                u.email,
                u.is_active,
                ut.type_name,
                l.lesson_id,
                l.teacher_id,
                l.pool_id,
                p.name as pool_name,
                l.lesson_date,
                l.start_time,
                l.end_time,
                l.lesson_type,
                l.max_participants,
                l.min_age,
                l.max_age,
                l.level,
                l.is_active as lesson_is_active,
                l.num_registered,
                lr.registration_id,
                lr.registration_date,
                lr.is_active as registration_status
            FROM users AS u
            LEFT JOIN user_types AS ut ON u.type_id = ut.type_id
            LEFT JOIN lessons l ON (
                (ut.type_name = 'teacher' AND l.teacher_id = u.user_id) OR
                (ut.type_name = 'student' AND EXISTS (
                    SELECT 1 FROM lesson_registrations lr2 
                    WHERE lr2.lesson_id = l.lesson_id 
                    AND lr2.student_id = u.user_id 
                    AND lr2.is_active = 1
                ))
            )
            LEFT JOIN pools p ON l.pool_id = p.pool_id
            LEFT JOIN lesson_registrations lr ON (
                ut.type_name = 'student' 
                AND l.lesson_id = lr.lesson_id 
                AND lr.student_id = u.user_id 
                AND lr.is_active = 1
            )
            WHERE ut.type_name = ? 
            AND u.is_active = 1 
            AND (l.is_active = 1 OR l.lesson_id IS NULL)
            ORDER BY u.name, l.lesson_date, l.start_time
        `;

        const [rows] = await conn.query(sql, [type]);
        await conn.commit();
        return rows;
    } catch (error) {
        await conn.rollback();
        throw error;
    } finally {
        conn.release();
    }
}

async function deleteStudent(userId) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        const [resultSets] = await connection.query(
            'CALL DeactivateStudentAndGetTeachers(?)',
            [userId]
        );

        const privateLessons = Array.isArray(resultSets[0]) ? resultSets[0] : [];
        const debugMessage = Array.isArray(resultSets[1]) ? resultSets[1] : [];
        const [userCheck] = await connection.query(
            'SELECT user_id, name, is_active FROM users WHERE user_id = ?',
            [userId]
        );


        await connection.commit();
        return {
            privateTeachers: privateLessons,
            userStatus: userCheck[0] || null,
            debugInfo: debugMessage
        };

    } catch (err) {
        await connection.rollback();
        console.error('❌ Error in deleteStudent:', err);
        throw err;
    } finally {
        connection.release();
    }
}

module.exports = {
    getUserWithPassword,
    createUserWithPasswordHash,
    getUserById,
    getAllUsersByType,
    deleteStudent
};
