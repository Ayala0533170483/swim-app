const genericService = require('../services/genericService');
const usersService = require('../services/usersService');
const { sendUserRemovalEmail, sendLessonCancellationEmail } = require('./emailController');


async function createUser(userData) {
    try {
        const newUser = await genericService.create('users', userData);

        if (newUser.id) {
            newUser.user_id = newUser.id;
            delete newUser.id;
        }

        return newUser;
    } catch (error) {
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

        return { message: 'User updated successfully' };
    } catch (error) {
        throw error;
    }
}


// החלף את הפונקציה deleteUser הקיימת בזו:
// async function deleteUser(id, additionalData = null) {
//     try {
//         // בדיקה אם מדובר בתלמיד
//         if (additionalData && additionalData.userType === 'students') {
//             // קבלת פרטי התלמיד לפני המחיקה
//             const student = await usersService.getUserById(id);
//             if (!student) {
//                 throw new Error('Student not found');
//             }

//             const cancelledLessons = await usersService.deleteStudent(id);

//             if (cancelledLessons && cancelledLessons.length > 0) {
//                 for (const lessonData of cancelledLessons) {
//                     // שליחת מייל רק לשיעורים פרטיים
//                     if (lessonData.lesson_type === 'private') {
//                         try {
//                             await sendLessonCancellationEmail(
//                                 lessonData.teacher_email,
//                                 lessonData.teacher_name,
//                                 lessonData
//                             );
//                         } catch (emailError) {
//                             console.error(`Failed to send cancellation email to teacher ${lessonData.teacher_email}:`, emailError);
//                             // ממשיכים גם אם המייל נכשל
//                         }
//                     }
//                 }
//             }

//             // שליחת מייל לתלמיד על הסרתו מהמערכת
//             try {
//                 await sendUserRemovalEmail(student.email, student.name, 'students');
//             } catch (emailError) {
//                 console.error(`Failed to send removal email to student ${student.email}:`, emailError);
//                 // ממשיכים גם אם המייל נכשל
//             }

//             return { message: 'Student deleted successfully' };
//         } else {
//             // מחיקה רגילה למשתמשים אחרים
//             await genericService.remove('users', id);
//             return { message: 'User deleted successfully' };
//         }
//     } catch (error) {
//         throw error;
//     }
// }

async function deleteUser(id, additionalData = null) {
    try {
        // בדיקה אם מדובר בתלמיד
        if (additionalData && additionalData.userType === 'students') {
            console.log('🔍 Deleting student with ID:', id);
            
            // קבלת פרטי התלמיד לפני המחיקה
            const student = await usersService.getUserById(id);
            if (!student) {
                throw new Error('Student not found');
            }
            console.log('👤 Student found:', student.name);

            // מחיקת התלמיד וקבלת רשימת המורים והשיעורים שבוטלו
            const cancelledLessons = await usersService.deleteStudent(id);
            console.log('📚 Cancelled lessons:', cancelledLessons.length);
            console.log('📋 Lessons data:', cancelledLessons);

            // שליחת מיילים למורים של שיעורים פרטיים שבוטלו
            if (cancelledLessons && cancelledLessons.length > 0) {
                for (const lessonData of cancelledLessons) {
                    console.log('🔍 Checking lesson type:', lessonData.lesson_type);
                    
                    // שליחת מייל רק לשיעורים פרטיים
                    if (lessonData.lesson_type === 'private') {
                        console.log('📧 Sending email to teacher:', lessonData.teacher_email);
                        try {
                            const emailResult = await sendLessonCancellationEmail(
                                lessonData.teacher_email,
                                lessonData.teacher_name,
                                lessonData
                            );
                            console.log('✅ Email sent successfully:', emailResult);
                        } catch (emailError) {
                            console.error(`❌ Failed to send cancellation email to teacher ${lessonData.teacher_email}:`, emailError);
                        }
                    } else {
                        console.log('⏭️ Skipping non-private lesson');
                    }
                }
            } else {
                console.log('📭 No cancelled lessons found');
            }

            // שליחת מייל לתלמיד על הסרתו מהמערכת
            console.log('📧 Sending removal email to student:', student.email);
            try {
                const studentEmailResult = await sendUserRemovalEmail(student.email, student.name, 'students');
                console.log('✅ Student removal email sent:', studentEmailResult);
            } catch (emailError) {
                console.error(`❌ Failed to send removal email to student ${student.email}:`, emailError);
            }

            return { message: 'Student deleted successfully' };
        } else {
            // מחיקה רגילה למשתמשים אחרים
            await genericService.remove('users', id);
            return { message: 'User deleted successfully' };
        }
    } catch (error) {
        throw error;
    }
}



module.exports = {
    createUser,
    getUsers,
    updateUser,
    deleteUser
};
