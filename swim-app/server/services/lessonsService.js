const pool = require('./connection');

async function getMyLessons({ role, id }) {
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
            l.min_age,
            l.max_age,
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
            l.min_age,
            l.max_age,
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

    const [updateResult] = await conn.query(
      `UPDATE lessons
       SET num_registered = num_registered + 1
       WHERE lesson_id = ? AND is_active = 1`,
      [lessonId]
    );

    if (updateResult.affectedRows === 0) {
      throw new Error('השיעור לא נמצא או שהוא לא פעיל');
    }

    const [lessonDetails] = await conn.query(
      `SELECT 
        l.lesson_id,
        l.lesson_date,
        l.start_time,
        l.end_time,
        l.lesson_type,
       l.min_age,
l.max_age,
        l.level,
        p.name as pool_name,
        teacher.name as teacher_name,
        student.name as student_name,
        student.email as student_email
       FROM lessons l
       JOIN pools p ON l.pool_id = p.pool_id
       JOIN users teacher ON l.teacher_id = teacher.user_id
       JOIN users student ON student.user_id = ?
       WHERE l.lesson_id = ?`,
      [studentId, lessonId]
    );

    await conn.commit();

    return {
      registration_id: insertResult.insertId,
      lesson_id: lessonId,
      student_id: studentId,
      registration_date: new Date(),
      is_active: 1,
      emailData: lessonDetails[0]
    };

  } catch (error) {
    await conn.rollback();
    console.error('Transaction Error:', error.message);
    throw error;
  } finally {
    conn.release();
  }
}

async function checkTeacherScheduleConflicts(teacherId, lessonDate, startTime, endTime, excludeLessonId = null) {
  console.log('🔍 Checking conflicts for:', {
    teacherId,
    lessonDate,
    startTime,
    endTime,
    excludeLessonId
  });

  const sql = `
    SELECT 
      l.lesson_id,
      l.pool_id,
      p.name as pool_name,
      l.lesson_date,
      l.start_time,
      l.end_time,
      l.lesson_type,
      l.level,
      l.min_age,
      l.max_age
    FROM lessons l
    LEFT JOIN pools p ON l.pool_id = p.pool_id
    WHERE l.teacher_id = ? 
    AND l.lesson_date = ?
    AND l.is_active = 1
    AND (
      -- חפיפה מלאה או חלקית: השיעור החדש מתחיל לפני שהקיים נגמר
      -- והשיעור החדש נגמר אחרי שהקיים מתחיל
      (? < l.end_time AND ? > l.start_time)
    )
    ${excludeLessonId ? 'AND l.lesson_id != ?' : ''}
    ORDER BY l.start_time`;

  const params = [teacherId, lessonDate, startTime, endTime];
  if (excludeLessonId) {
    params.push(excludeLessonId);
  }

  console.log('🔍 SQL Query:', sql);
  console.log('🔍 Parameters:', params);

  const [rows] = await pool.query(sql, params);
  
  console.log('🔍 Found conflicts:', rows);
  
  return rows;
}

module.exports = {
  getMyLessons,
  getAvailableLessons,
  registerStudentToLesson,
  checkTeacherScheduleConflicts
};
