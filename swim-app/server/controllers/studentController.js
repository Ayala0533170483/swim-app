const service = require('../services/service');

// מיפוי סוגי פריטים לטבלאות במסד הנתונים
const typeToTableMap = {
    'users': 'users',
    'students': 'students',
    'classes': 'classes',
    'lessons': 'lessons',
    'assignments': 'assignments',
    'grades': 'grades',
    'cancellations': 'cancellations',
    'lesson_requests': 'lesson_requests'
};

async function getItems(type, filters = {}) {
    try {
        console.log(`=== Getting items of type: ${type} ===`);
        console.log('Filters received:', JSON.stringify(filters, null, 2));

        const tableName = typeToTableMap[type];
        if (!tableName) {
            throw new Error(`Invalid item type: ${type}`);
        }

        // טיפול מיוחד עבור users
        if (type === 'users' && filters.user_id) {
            console.log(`Getting user profile for user_id: ${filters.user_id}`);
            const user = await service.getUserById(filters.user_id);

            if (!user) {
                throw new Error('User not found');
            }

            console.log('User found:', JSON.stringify(user, null, 2));
            return [user]; // מחזיר מערך כמו שהקליינט מצפה
        }

        // טיפול רגיל עבור שאר הסוגים
        console.log(`Using table: ${tableName}`);
        const items = await service.getItems(tableName, filters);
        console.log(`Found ${items.length} items`);

        return items;
    } catch (error) {
        console.error(`=== ERROR getting ${type} ===`);
        console.error('Error message:', error.message);
        console.error('=== END ERROR ===');
        throw error;
    }
}

async function createItem(table, data) {
    const result = await service.createItem(table, data);
    return result;
}

async function updateItem(table, id, data) {
    const result = await service.updateItem(table, id, data);
    return result;
}

async function deleteItem(table, id) {
    const result = await service.deleteItem(table, id);
    return result;
}

async function loginUser(email, password) {
    const result = await service.loginUser(email, password);
    return result;
}

async function registerUser(userData) {
    const result = await service.registerUser(userData);
    return result;
}

module.exports = {
    getItems,
    createItem,
    updateItem,
    deleteItem,
    loginUser,
    registerUser
};
