const genericService = require('../services/genericService');
const lessonsService = require('../services/lessonsService');

async function getLessons(filters = {}) {
    try {
        const rawLessons = await lessonsService.getLessons(filters);
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
                    age_range: row.age_range,
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
        lessonData.teacher_id = lessonData.user_id;
        delete lessonData.user_id;
        const result = await genericService.create('lessons', lessonData);

        return result;
    } catch (error) {
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

// async function getLessonsByTeacher(teacherId) {
//     try {
//         const lessons = await genericService.get('lessons', { teacher_id: teacherId });
//         return lessons;
//     } catch (error) {
//         throw error;
//     }
// }

// async function getLessonsByPool(poolId) {
//     try {
//         const lessons = await genericService.getItems('lessons', { pool_id: poolId });
//         return lessons;
//     } catch (error) {
//         throw error;
//     }
// }



module.exports = {
    getLessons,
    getAvailableLessons,
    createLesson,
    updateLesson
    // deleteLesson,
    // getLessonsByTeacher,
    // getLessonsByPool,

};
