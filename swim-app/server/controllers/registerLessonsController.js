const lessonsService = require('../services/lessonsService');

async function registerToLesson(registrationData) {
    try {
        console.log('Registering student to lesson:', registrationData);

        const result = await lessonsService.registerStudentToLesson(
            registrationData.lesson_id,
            registrationData.student_id
        );

        return result;
    } catch (error) {
        console.error('Error in registerToLesson:', error);
        throw error;
    }
}

module.exports = {
    registerToLesson
};