const service = require('../services/service');

const typeToTableMap = {
    'pools': 'pools',
    'all': 'pools'
};

async function getItems(type, filters = {}) {
    try {
        console.log(`=== Getting items of type: ${type} ===`);
        console.log('Filters received:', JSON.stringify(filters, null, 2));

        const tableName = typeToTableMap[type] || 'pools'; // ברירת מחדל לטבלת pools
        
        console.log(`Using table: ${tableName}`);
        const items = await service.get(tableName, filters);
        console.log(`Found ${items.length} items`);

        return items;
    } catch (error) {
        console.error(`=== ERROR getting ${type} ===`);
        console.error('Error message:', error.message);
        console.error('=== END ERROR ===');
        throw error;
    }
}

module.exports = {
    getItems
};
