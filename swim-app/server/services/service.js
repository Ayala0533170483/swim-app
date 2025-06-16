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

async function getLessons({ role, id }) {
    const sql = `
        SELECT 
            l.lesson_id,
            l.teacher_id,
            l.pool_id,
            p.name as pool_name,
            l.lesson_date,
            l.start_time,
            l.end_time,
            l.lesson_type,
            l.max_participants,
            l.age_range,
            l.level,
            l.is_active,
            l.num_registered,
            lr.registration_id,
            lr.student_id,
            lr.registration_date,
            lr.is_active as status,
            u.name
        FROM lessons l
        LEFT JOIN pools p ON l.pool_id = p.pool_id
        LEFT JOIN lesson_registrations lr ON l.lesson_id = lr.lesson_id
        LEFT JOIN users u ON lr.student_id = u.user_id
        WHERE (
            (? = 'teacher' AND l.teacher_id = ?) OR
            (? = 'student' AND lr.student_id = ? AND lr.is_active = 1)
        ) AND l.is_active = 1
        ORDER BY l.lesson_id, lr.registration_id`;

    const [rows] = await pool.query(sql, [role, id, role, id]);
    console.log(`Found ${rows.length} rows for ${role} id: ${id}`);

    return rows;
}
async function getAvailableLessons(studentId) {
    const sql = `
        SELECT 
            l.lesson_id,
            l.teacher_id,
            l.pool_id,
            p.name as pool_name,
            l.lesson_date,
            l.start_time,
            l.end_time,
            l.lesson_type,
            l.max_participants,
            l.age_range,
            l.level,
            l.is_active,
            l.num_registered,
            (l.max_participants - l.num_registered) as available_spots,
            u.name as teacher_name
        FROM lessons l
        LEFT JOIN pools p ON l.pool_id = p.pool_id
        LEFT JOIN users u ON l.teacher_id = u.user_id
        LEFT JOIN lesson_registrations lr ON l.lesson_id = lr.lesson_id 
            AND lr.student_id = ? 
            AND lr.is_active = 1
        WHERE l.is_active = 1 
        AND l.num_registered < l.max_participants
        AND lr.registration_id IS NULL
        ORDER BY l.lesson_date, l.start_time`;

    const [rows] = await pool.query(sql, [studentId]);
    return rows;
}


async function registerStudentToLesson(lessonId, studentId) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // 1. INSERT לטבלת lesson_registrations
    const [insertResult] = await conn.query(
      `INSERT INTO lesson_registrations (lesson_id, student_id, registration_date, is_active)
       SELECT ?, ?, NOW(), 1
       WHERE EXISTS (
         SELECT 1 FROM lessons WHERE lesson_id = ? AND is_active = 1
       )
       AND NOT EXISTS (
         SELECT 1 FROM lesson_registrations 
         WHERE lesson_id = ? AND student_id = ? AND is_active = 1
       )`,
      [lessonId, studentId, lessonId, lessonId, studentId]
    );

    if (insertResult.affectedRows === 0) {
      throw new Error('לא ניתן להירשם - השיעור אינו קיים או שכבר רשום');
    }

    // 2. UPDATE לטבלת lessons - העלאת מספר הנרשמים ב־1
    const [updateResult] = await conn.query(
      `UPDATE lessons
       SET num_registered = num_registered + 1
       WHERE lesson_id = ? AND is_active = 1`,
      [lessonId]
    );

    if (updateResult.affectedRows === 0) {
      throw new Error('השיעור לא נמצא או שהוא לא פעיל');
    }

    // 3. מחוייבים את העסקה
    await conn.commit();

    // 4. מחזירים פרטים
    return {
      registration_id: insertResult.insertId,
      lesson_id: lessonId,
      student_id: studentId,
      registration_date: new Date(),
      is_active: 1,
      num_registered_incremented: true
    };

  } catch (error) {
    // כל כישלון יגלגל את כל השינויים חזרה
    await conn.rollback();
    console.error('Transaction Error:', error.message);
    throw error;
  } finally {
    // לשחרר את החיבור בחזרה ל־pool
    conn.release();
  }
}



module.exports = {
    getLessons,
    getAvailableLessons,
    registerStudentToLesson,
    getUserWithPassword,
    createUserWithPasswordHash,
    getUserById
};