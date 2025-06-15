const genericService = require('../services/genericService');
const service = require('../services/service');

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
            const user = await service.getUserById(filters.user_id);
            if (!user) {
                throw new Error('User not found');
            }

            return [user]; 
        }

        const users = await service.get('users', filters);

        return users;
    } catch (error) {
        throw error;
    }
}

async function updateUser(id, updateData) {
    try {
        delete updateData.id;
        delete updateData.user_id;

        await genericService.update('users',"user_id", id, updateData);

        return { message: 'User updated successfully' };
    } catch (error) {
        throw error;
    }
}

async function deleteUser(id) {
    try {

        await service.remove('users', id);
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
