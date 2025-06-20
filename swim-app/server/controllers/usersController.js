const genericService = require('../services/genericService');
const usersService = require('../services/usersService');

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
            // קבלת הנתונים הגולמיים מהסרוויס
            const rawData = await usersService.getAllUsersByType(filters.type);
            
            // עיבוד הנתונים - ארגון השיעורים תחת כל משתמש
            const usersMap = new Map();
            
            rawData.forEach(row => {
                const userId = row.user_id;
                
                // אם המשתמש עדיין לא קיים במפה, צור אותו
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
                
                // אם יש שיעור (lesson_id לא null), הוסף אותו למערך השיעורים
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
                    
                    // עבור תלמידים, הוסף גם פרטי הרשמה
                    if (row.type_name === 'student' && row.registration_id) {
                        lesson.registration_id = row.registration_id;
                        lesson.registration_date = row.registration_date;
                        lesson.registration_status = row.registration_status;
                    }
                    
                    // בדיקה שהשיעור לא קיים כבר (למניעת כפילויות)
                    const existingLesson = usersMap.get(userId).lessons.find(l => l.lesson_id === lesson.lesson_id);
                    if (!existingLesson) {
                        usersMap.get(userId).lessons.push(lesson);
                    }
                }
            });
            
            // החזרת מערך של משתמשים מעובדים
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

async function deleteUser(id) {
    try {
        await genericService.remove('users', id);
        return { message: 'User deleted successfully' };
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
