const genericService = require('../services/genericService');
const service = require('../services/service');
async function getLessons(filters = {}) {
    try {
        // console.log('=== Getting lessons ===');
        // console.log('Filters received:', JSON.stringify(filters, null, 2));

        const lessons = await service.getLessons('lessons', filters);
        console.log(`Found ${lessons.length} lessons`);

        return lessons;
    } catch (error) {
        console.error('=== ERROR getting lessons ===');
        console.error('Error message:', error.message);
        console.error('=== END ERROR ===');
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
        console.log(`=== Updating lesson ID: ${lessonId} ===`);
        console.log('Update data:', JSON.stringify(updateData, null, 2));

        delete updateData.lesson_id;
        await genericService.update('lessons', lessonId, updateData);
        return { message: 'Lesson updated successfully' };
    } catch (error) {
        throw error;
    }
}

async function deleteLesson(lessonId) {
    try {
        const result = await genericService.deleteItem('lessons', lessonId);
        return result;
    } catch (error) {
        throw error;
    }
}

async function getLessonsByTeacher(teacherId) {
    try {
        const lessons = await genericService.getItems('lessons', { teacher_id: teacherId });
        return lessons;
    } catch (error) {
        throw error;
    }
}

async function getLessonsByPool(poolId) {
    try {
        const lessons = await genericService.getItems('lessons', { pool_id: poolId });
        return lessons;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    getLessons,
    createLesson,
    updateLesson,
    deleteLesson,
    getLessonsByTeacher,
    getLessonsByPool
};
