const genericService = require('../services/genericService');
const lessonsService = require('../services/lessonsService');
const { checkTimeConflict, checkQuarterHourWarnings } = require('../utils/timeUtils');

async function getMyLessons(filters = {}) {
    try {
        const rawLessons = await lessonsService.getMyLessons(filters);
        console.log(`Found ${rawLessons.length} lesson records`);
        const lessonsMap = new Map();

        rawLessons.forEach(row => {
            const lessonId = row.lesson_id;

            if (!lessonsMap.has(lessonId)) {
                lessonsMap.set(lessonId, {
                    lesson_id: row.lesson_id,
                    teacher_id: row.teacher_id,
                    pool_id: row.pool_id,
                    pool_name: row.pool_name,
                    lesson_date: row.lesson_date,
                    start_time: row.start_time,
                    end_time: row.end_time,
                    lesson_type: row.lesson_type,
                    max_participants: row.max_participants,
                    min_age: row.min_age,
                    max_age: row.max_age,
                    level: row.level,
                    registrations: []
                });
            }

            if (row.registration_id) {
                lessonsMap.get(lessonId).registrations.push({
                    registration_id: row.registration_id,
                    student_id: row.student_id,
                    name: row.name,
                    registration_date: row.registration_date,
                    status: row.status
                });
            }
        });
        const processedLessons = Array.from(lessonsMap.values());
        console.log(`Processed into ${processedLessons.length} unique lessons`);

        return processedLessons;
    } catch (error) {
        console.error('=== ERROR getting lessons ===');
        console.error('Error message:', error.message);
        console.error('=== END ERROR ===');
        throw error;
    }
}

async function getAvailableLessons(studentId) {
    try {
        const availableLessons = await lessonsService.getAvailableLessons(studentId);
        console.log(`Found ${availableLessons.length} available lessons`);
        return availableLessons;
    } catch (error) {
        throw error;
    }
}

async function createLesson(lessonData) {
    try {
        if (!lessonData.user_id || !lessonData.pool_id || !lessonData.lesson_date) {
            throw new Error('Missing required fields: teacher_id, pool_id, lesson_date');
        }

        const teacherId = lessonData.user_id;
        const newPoolId = parseInt(lessonData.pool_id);

        console.log('🔍 Creating lesson with data:', {
            teacherId,
            date: lessonData.lesson_date,
            start: lessonData.start_time,
            end: lessonData.end_time,
            pool: newPoolId
        });

        // קבלת השיעורים הקיימים של המורה באותו תאריך
        const existingLessons = await lessonsService.getTeacherLessonsForDate(
            teacherId,
            lessonData.lesson_date
        );

        console.log('🔍 Found existing teacher lessons:', existingLessons.length);

        // הכנת אובייקט השיעור החדש לבדיקה
        const newLesson = {
            start_time: lessonData.start_time,
            end_time: lessonData.end_time,
            pool_id: newPoolId,
            lesson_date: lessonData.lesson_date
        };

        // בדיקה 1: חפיפה מלאה
        const conflictingLesson = checkTimeConflict(newLesson, existingLessons);
        
        if (conflictingLesson) {
            console.log('🚫 TEACHER SCHEDULE CONFLICT - BLOCKING CREATION');
            throw new Error(JSON.stringify({
                type: 'SCHEDULE_CONFLICT',
                message: 'יש לך שיעור קיים בזמן חופף',
                conflicts: [conflictingLesson]
            }));
        }

        // בדיקה 2: אזהרות רבע שעה בבריכות שונות
        const warnings = checkQuarterHourWarnings(newLesson, existingLessons);

        // יצירת השיעור
        lessonData.teacher_id = teacherId;
        delete lessonData.user_id;
        const result = await lessonsService.createLesson(lessonData);

        if (warnings.length > 0) {
            console.log(`⚠️ Teacher lesson created with ${warnings.length} warnings:`, warnings);
        }

        return {
            lesson: result,
            warnings: warnings
        };

    } catch (error) {
        console.error('❌ Error in createLesson:', error.message);

        if (error.message.startsWith('{"type":"SCHEDULE_CONFLICT"')) {
            throw error;
        }
        throw error;
    }
}

async function updateLesson(lessonId, updateData) {
    try {
        delete updateData.registrations;
        delete updateData.id;
        await genericService.update('lessons', lessonId, updateData);
        return { message: 'Lesson updated successfully' };
    } catch (error) {
        throw error;
    }
}

async function deleteLesson(lessonId) {
    try {
        console.log(`=== Deleting lesson ID: ${lessonId} ===`);
        const result = await genericService.remove('lessons', lessonId);
        console.log('Lesson deleted successfully');
        return result;
    } catch (error) {
        console.error('Error in deleteLesson:', error);
        throw error;
    }
}

module.exports = {
    getMyLessons,
    getAvailableLessons,
    createLesson,
    updateLesson,
    deleteLesson
};