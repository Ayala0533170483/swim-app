const genericService = require('../services/genericService');
const lessonsService = require('../services/lessonsService');
const { checkTimeConflict, checkQuarterHourWarnings } = require('../utils/timeUtils');
const { log } = require('../utils/logger');

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

        const existingLessons = await lessonsService.getTeacherLessonsForDate(
            teacherId,
            lessonData.lesson_date
        );

        console.log('🔍 Found existing teacher lessons:', existingLessons.length);

        const newLesson = {
            start_time: lessonData.start_time,
            end_time: lessonData.end_time,
            pool_id: newPoolId,
            lesson_date: lessonData.lesson_date
        };

        const conflictingLesson = checkTimeConflict(newLesson, existingLessons);
        
        if (conflictingLesson) {
            console.log('🚫 TEACHER SCHEDULE CONFLICT - BLOCKING CREATION');
            throw new Error(JSON.stringify({
                type: 'SCHEDULE_CONFLICT',
                message: 'יש לך שיעור קיים בזמן חופף',
                conflicts: [conflictingLesson]
            }));
        }

        const warnings = checkQuarterHourWarnings(newLesson, existingLessons);

        lessonData.teacher_id = teacherId;
        delete lessonData.user_id;
        const result = await lessonsService.createLesson(lessonData);

        if (warnings.length > 0) {
            console.log(`⚠️ Teacher lesson created with ${warnings.length} warnings:`, warnings);
        }

        log('Lesson created successfully', { 
            lessonId: result.lesson_id, 
            teacherId: teacherId, 
            poolId: newPoolId, 
            date: lessonData.lesson_date,
            type: lessonData.lesson_type,
            warnings: warnings.length 
        });

        return {
            lesson: result,
            warnings: warnings
        };

    } catch (error) {
        console.error('❌ Error in createLesson:', error.message);

        if (error.message.startsWith('{"type":"SCHEDULE_CONFLICT"')) {
            log('Failed to create lesson - schedule conflict', { 
                teacherId: lessonData.user_id, 
                date: lessonData.lesson_date, 
                startTime: lessonData.start_time 
            });
            throw error;
        }
        
        log('Failed to create lesson', { 
            teacherId: lessonData.user_id, 
            error: error.message 
        });
        
        throw error;
    }
}

async function updateLesson(lessonId, updateData) {
    try {
        delete updateData.registrations;
        delete updateData.id;
        await genericService.update('lessons', lessonId, updateData);
        
        log('Lesson updated successfully', { lessonId: lessonId, updatedFields: Object.keys(updateData) });
        
        return { message: 'Lesson updated successfully' };
    } catch (error) {
        log('Failed to update lesson', { lessonId: lessonId, error: error.message });
        throw error;
    }
}

async function deleteLesson(lessonId) {
    try {
        console.log(`=== Deleting lesson ID: ${lessonId} ===`);
        const result = await genericService.remove('lessons', lessonId);
        console.log('Lesson deleted successfully');
        
        log('Lesson deleted successfully', { lessonId: lessonId });
        
        return result;
    } catch (error) {
        console.error('Error in deleteLesson:', error);
        
        log('Failed to delete lesson', { lessonId: lessonId, error: error.message });
        
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
