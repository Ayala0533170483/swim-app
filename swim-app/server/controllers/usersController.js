const genericService = require('../services/genericService');
const usersService = require('../services/usersService');
const { sendUserRemovalEmail, sendLessonCancellationEmail } = require('./emailsController');
const { log } = require('../utils/logger');


async function createUser(userData) {
    try {
        const newUser = await genericService.create('users', userData);

        if (newUser.id) {
            newUser.user_id = newUser.id;
            delete newUser.id;
        }

        log('User created successfully', { userId: newUser.user_id, email: userData.email, type: userData.type });

        return newUser;
    } catch (error) {
        log('Failed to create user', { error: error.message, email: userData.email });
        throw error;
    }
}

async function getUsers(filters = {}) {
    try {
        if (filters.user_id) {
            const user = await usersService.getUserById(filters.user_id);
            if (!user) {
                throw new Error('User not found');
            }
            return [user];
        }

        if (filters.type) {
            const rawData = await usersService.getAllUsersByType(filters.type);

            const usersMap = new Map();
            rawData.forEach(row => {
                const userId = row.user_id;

                if (!usersMap.has(userId)) {
                    usersMap.set(userId, {
                        user_id: row.user_id,
                        name: row.name,
                        email: row.email,
                        is_active: row.is_active,
                        type_name: row.type_name,
                        lessons: []
                    });
                }

                if (row.lesson_id) {
                    const lesson = {
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
                        lesson_is_active: row.lesson_is_active,
                        num_registered: row.num_registered
                    };

                    if (row.type_name === 'student' && row.registration_id) {
                        lesson.registration_id = row.registration_id;
                        lesson.registration_date = row.registration_date;
                        lesson.registration_status = row.registration_status;
                    }
                    const existingLesson = usersMap.get(userId).lessons.find(l => l.lesson_id === lesson.lesson_id);
                    if (!existingLesson) {
                        usersMap.get(userId).lessons.push(lesson);
                    }
                }
            });

            return Array.from(usersMap.values());
        }

        return await genericService.get('users', filters);
    } catch (error) {
        throw error;
    }
}

async function updateUser(id, updateData) {
    try {
        delete updateData.id;
        delete updateData.user_id;

        await genericService.update('users', id, updateData);

        log('User updated successfully', { userId: id, updatedFields: Object.keys(updateData) });

        return { message: 'User updated successfully' };
    } catch (error) {
        log('Failed to update user', { userId: id, error: error.message });
        throw error;
    }
}

async function deleteUser(id, additionalData = null) {
    try {
        if (additionalData && additionalData.userType === 'students') {

            const student = await usersService.getUserById(id);
            if (!student) {
                throw new Error('Student not found');
            }

            const cancelledLessons = await usersService.deleteStudent(id);
            if (cancelledLessons && cancelledLessons.length > 0) {
                for (const lessonData of cancelledLessons) {

                    if (lessonData.lesson_type === 'private') {
                        try {
                            const emailResult = await sendLessonCancellationEmail(
                                lessonData.teacher_email,
                                lessonData.teacher_name,
                                lessonData
                            );
                        } catch (emailError) {
                        }
                    } else {
                        console.log(' Skipping non-private lesson');
                    }
                }
            } else {
                console.log(' No cancelled lessons found');
            }

            try {
                const studentEmailResult = await sendUserRemovalEmail(student.email, student.name, 'students');
            } catch (emailError) {
                console.error(` Failed to send removal email to student ${student.email}:`, emailError);
            }

            log('Student deleted successfully', { studentId: id, email: student.email, cancelledLessons: cancelledLessons?.length || 0 });

            return { message: 'Student deleted successfully' };
        } else {
            await genericService.remove('users', id);
            
            log('User deleted successfully', { userId: id });
            
            return { message: 'User deleted successfully' };
        }
    } catch (error) {
        log('Failed to delete user', { userId: id, error: error.message });
        throw error;
    }
}



module.exports = {
    createUser,
    getUsers,
    updateUser,
    deleteUser
};
