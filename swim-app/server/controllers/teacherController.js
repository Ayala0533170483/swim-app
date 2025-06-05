const service = require('../services/service');

// מיפוי סוגי פריטים לטבלאות במסד הנתונים
const typeToTableMap = {
    'students': 'students',
    'classes': 'classes',
    'lessons': 'lessons',
    'assignments': 'assignments',
    'grades': 'grades',
    // הוסף כאן עוד סוגי פריטים לפי הצורך
};

async function createItem(type, itemData) {
    try {
        const tableName = typeToTableMap[type];
        if (!tableName) {
            throw new Error(`Invalid item type: ${type}`);
        }

        const newItem = await service.create(tableName, itemData);
        return newItem;
    } catch (error) {
        console.error(`Error creating ${type}:`, error);
        throw error;
    }
}

async function getItems(type, filters = {}) {
    try {
        const tableName = typeToTableMap[type];
        if (!tableName) {
            throw new Error(`Invalid item type: ${type}`);
        }

        const items = await service.get(tableName, filters);
        return items;
    } catch (error) {
        console.error(`Error getting ${type}:`, error);
        throw error;
    }
}

async function updateItem(type, id, updateData) {
    try {
        const tableName = typeToTableMap[type];
        if (!tableName) {
            throw new Error(`Invalid item type: ${type}`);
        }

        await service.update(tableName, id, updateData);
        return { message: `${type} updated successfully` };
    } catch (error) {
        console.error(`Error updating ${type}:`, error);
        throw error;
    }
}

async function deleteItem(type, id) {
    try {
        const tableName = typeToTableMap[type];
        if (!tableName) {
            throw new Error(`Invalid item type: ${type}`);
        }

        await service.remove(tableName, id);
        return { message: `${type} deleted successfully` };
    } catch (error) {
        console.error(`Error deleting ${type}:`, error);
        throw error;
    }
}

module.exports = {
    createItem,
    getItems,
    updateItem,
    deleteItem
};
