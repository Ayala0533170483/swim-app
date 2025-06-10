const service = require('../services/service');

// קבלת כל השיעורים עם פילטרים
async function getLessons(filters = {}) {
    try {
        console.log('=== Getting lessons ===');
        console.log('Filters received:', JSON.stringify(filters, null, 2));

        const lessons = await service.getItems('lessons', filters);
        console.log(`Found ${lessons.length} lessons`);

        return lessons;
    } catch (error) {
        console.error('=== ERROR getting lessons ===');
        console.error('Error message:', error.message);
        console.error('=== END ERROR ===');
        throw error;
    }
}

// קבלת שיעור לפי ID
async function getLessonById(lessonId) {
    try {
        console.log(`Getting lesson by ID: ${lessonId}`);

        const lesson = await service.getItems('lessons', { lesson_id: lessonId });

        if (!lesson || lesson.length === 0) {
            throw new Error('Lesson not found');
        }

        return lesson[0];
    } catch (error) {
        console.error('Error getting lesson by ID:', error.message);
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
        const result = await service.create('lessons', lessonData);
        console.log('Lesson created successfully');

        return result;
    } catch (error) {
        console.error('Error creating lesson:', error.message);
        throw error;
    }
}

// עדכון שיעור
async function updateLesson(lessonId, updateData) {
    try {
        console.log(`=== Updating lesson ID: ${lessonId} ===`);
        console.log('Update data:', JSON.stringify(updateData, null, 2));

        // הסרת שדות שלא צריך לעדכן
        delete updateData.lesson_id;

        await service.update('lessons', lessonId, updateData);

        console.log('Lesson updated successfully');
        return { message: 'Lesson updated successfully' };
    } catch (error) {
        console.error('Error updating lesson:', error.message);
        throw error;
    }
}

// מחיקת שיעור
async function deleteLesson(lessonId) {
    try {
        console.log(`=== Deleting lesson ID: ${lessonId} ===`);

        const result = await service.deleteItem('lessons', lessonId);

        console.log('Lesson deleted successfully');
        return result;
    } catch (error) {
        console.error('Error deleting lesson:', error.message);
        throw error;
    }
}

// קבלת שיעורים לפי מורה
async function getLessonsByTeacher(teacherId) {
    try {
        console.log(`Getting lessons for teacher ID: ${teacherId}`);

        const lessons = await service.getItems('lessons', { teacher_id: teacherId });

        return lessons;
    } catch (error) {
        console.error('Error getting lessons by teacher:', error.message);
        throw error;
    }
}

// קבלת שיעורים לפי בריכה
async function getLessonsByPool(poolId) {
    try {
        console.log(`Getting lessons for pool ID: ${poolId}`);

        const lessons = await service.getItems('lessons', { pool_id: poolId });

        return lessons;
    } catch (error) {
        console.error('Error getting lessons by pool:', error.message);
        throw error;
    }
}

module.exports = {
    getLessons,
    getLessonById,
    createLesson,
    updateLesson,
    deleteLesson,
    getLessonsByTeacher,
    getLessonsByPool
};
