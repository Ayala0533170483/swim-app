const service = require('../services/genericService');

async function createUser(userData) {
    try {
        console.log('=== Creating user ===');
        console.log('User data received:', JSON.stringify(userData, null, 2));

        console.log('Calling service.create for users table');
        const newUser = await service.create('users', userData);

        // תיקון מפתח ראשי
        if (newUser.id) {
            newUser.user_id = newUser.id;
            delete newUser.id;
        }

        console.log('=== User created successfully ===');
        return newUser;
    } catch (error) {
        console.error('=== ERROR creating user ===');
        console.error('Error message:', error.message);
        console.error('=== END ERROR ===');
        throw error;
    }
}

async function getUsers(filters = {}) {
    try {
        // טיפול מיוחד עבור user_id ספציפי
        if (filters.user_id) {
            const user = await service.getUserById(filters.user_id);
            if (!user) {
                throw new Error('User not found');
            }

            console.log('User found:', JSON.stringify(user, null, 2));
            return [user]; // מחזיר מערך כמו שהקליינט מצפה
        }

        // קבלת כל היוזרים עם פילטרים
        const users = await service.get('users', filters);
        console.log(`Found ${users.length} users`);

        return users;
    } catch (error) {
        console.error('=== ERROR getting users ===');
        console.error('Error message:', error.message);
        console.error('=== END ERROR ===');
        throw error;
    }
}

async function updateUser(id, updateData) {
    try {
        console.log('=== Updating user ===');
        console.log('User ID:', id);
        console.log('Update data:', JSON.stringify(updateData, null, 2));

        // ניקוי שדות לא רצויים
        delete updateData.id;
        delete updateData.user_id;

        await service.update('users', id, updateData);

        console.log('=== User updated successfully ===');
        return { message: 'User updated successfully' };
    } catch (error) {
        console.error('=== ERROR updating user ===');
        console.error('Error message:', error.message);
        throw error;
    }
}

async function deleteUser(id) {
    try {
        console.log(`=== Deleting user with id: ${id} ===`);

        await service.remove('users', id);
        console.log('=== User deleted successfully ===');
        return { message: 'User deleted successfully' };
    } catch (error) {
        console.error('=== ERROR deleting user ===');
        console.error('Error message:', error.message);
        console.error('=== END ERROR ===');
        throw error;
    }
}

module.exports = {
    createUser,
    getUsers,
    updateUser,
    deleteUser
};
