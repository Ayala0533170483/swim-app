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
            return await usersService.getAllUsersByType(filters.type);
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

