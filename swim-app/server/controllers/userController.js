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

// מיפוי שמות השדות הראשיים
const typeToPrimaryKeyMap = {
    'users': 'user_id',
    'lessons': 'lesson_id',
    'cancellations': 'cancellation_id',
    'lesson_requests': 'request_id',
    'students': 'student_id',
    'classes': 'class_id',
    'assignments': 'assignment_id',
    'grades': 'grade_id'
};

// תרגום שדות עבריים לאנגליים
function translateHebrewFields(itemData) {
    const translation = {
        'בריכה': 'pool_id',
        'תאריך השיעור': 'lesson_date',
        'שעת התחלה': 'start_time',
        'שעת סיום': 'end_time',
        'סוג השיעור': 'lesson_type',
        'מקסימום משתתפים': 'max_participants',
        'טווח גילאים': 'age_range',
        'רמת השיעור': 'level',
        'מזהה מורה': 'teacher_id'
    };

    // תרגום ערכים
    const valueTranslation = {
        'פרטי': 'private',
        'קבוצתי': 'group',
        'מתחיל': 'beginner',
        'בינוני': 'intermediate',
        'מתקדם': 'advanced'
    };

    const translatedData = {};

    // קודם העתק את כל השדות האנגליים
    for (const [key, value] of Object.entries(itemData)) {
        if (!Object.keys(translation).includes(key)) { // אם זה לא שדה עברי
            if (value !== '' && value !== null && value !== undefined) {
                translatedData[key] = value;
            }
        }
    }

    // עכשיו תרגם את השדות העבריים (רק אם יש להם ערך משמעותי)
    for (const [hebrewKey, englishKey] of Object.entries(translation)) {
        if (itemData[hebrewKey] && itemData[hebrewKey] !== '' && itemData[hebrewKey] !== null) {
            const hebrewValue = itemData[hebrewKey];
            const englishValue = valueTranslation[hebrewValue] || hebrewValue;

            // רק אם הערך לא "n" או ערך ריק
            if (englishValue !== 'n' && englishValue !== '') {
                translatedData[englishKey] = englishValue;
            }
        }
    }

    return translatedData;
}

async function createItem(type, itemData) {
    try {
        console.log(`=== Creating item of type: ${type} ===`);
        console.log('Original data received:', JSON.stringify(itemData, null, 2));

        const tableName = typeToTableMap[type];
        if (!tableName) {
            throw new Error(`Invalid item type: ${type}`);
        }

        console.log(`Using table: ${tableName}`);

        if (type === 'lessons') {
            console.log('Before translation:', JSON.stringify(itemData, null, 2));
            itemData = translateHebrewFields(itemData);
            console.log('After translation:', JSON.stringify(itemData, null, 2));

            console.log('Starting validation...');
            validateLessonData(itemData);
            console.log('Validation passed successfully');
            
            // 🔴 שיעור שמורה יוצר מאושר אוטומטית
            itemData.is_confirmed = 1;
        }

        console.log('Calling service.create with data:', JSON.stringify(itemData, null, 2));
        const newItem = await service.create(tableName, itemData);

        const primaryKey = typeToPrimaryKeyMap[type];
        console.log(`Primary key for ${type}: ${primaryKey}`);

        if (primaryKey && newItem.id) {
            newItem[primaryKey] = newItem.id;
            delete newItem.id;
            console.log('After primary key fix:', JSON.stringify(newItem, null, 2));
        }

        console.log('=== Item created successfully ===');
        return newItem;
    } catch (error) {
        console.error(`=== ERROR creating ${type} ===`);
        console.error('Error type:', error.constructor.name);
        console.error('Error message:', error.message);
        console.error('Error code:', error.code);
        console.error('Error stack:', error.stack);
        console.error('=== END ERROR ===');
        throw error;
    }
}

function validateLessonData(itemData) {
    console.log('=== Starting validation ===');
    console.log('Data to validate:', JSON.stringify(itemData, null, 2));

    const requiredFields = ['pool_id', 'lesson_date', 'start_time', 'end_time', 'lesson_type'];
    console.log('Required fields:', requiredFields);

    const missingFields = requiredFields.filter(field => {
        const exists = itemData[field] && itemData[field] !== '';
        console.log(`Field ${field}: ${itemData[field]} - ${exists ? 'OK' : 'MISSING'}`);
        return !exists;
    });

    console.log('Missing fields:', missingFields);

    if (missingFields.length > 0) {
        const hebrewFieldNames = {
            'pool_id': 'בריכה',
            'lesson_date': 'תאריך השיעור',
            'start_time': 'שעת התחלה',
            'end_time': 'שעת סיום',
            'lesson_type': 'סוג השיעור',
            'teacher_id': 'מזהה מורה'
        };

        const missingHebrewFields = missingFields.map(field => hebrewFieldNames[field] || field);
        const errorMessage = `שדות חובה חסרים: ${missingHebrewFields.join(', ')}`;
        console.error('Validation failed:', errorMessage);
        throw new Error(errorMessage);
    }

    console.log('Checking lesson_type:', itemData.lesson_type);
    if (!['private', 'group'].includes(itemData.lesson_type)) {
        const errorMessage = 'סוג השיעור חייב להיות "private" או "group"';
        console.error('Lesson type validation failed:', errorMessage);
        throw new Error(errorMessage);
    }

    // הגדרת ערכי ברירת מחדל
    itemData.is_active = itemData.is_active ?? 1;

    // הוספת teacher_id זמני אם חסר
    if (!itemData.teacher_id) {
        console.log('Adding temporary teacher_id');
        itemData.teacher_id = 1; // זמני
    }

    console.log('Final data after validation:', JSON.stringify(itemData, null, 2));
    console.log('=== Validation completed successfully ===');
}

// שאר הפונקציות
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

async function updateItem(type, id, updateData) {
    try {
        const tableName = typeToTableMap[type];
        if (!tableName) {
            throw new Error(`Invalid item type: ${type}`);
        }

        delete updateData.id;
        delete updateData.user_id;

        console.log('Update data:', JSON.stringify(updateData, null, 2));
        console.log('Table:', tableName, 'ID:', id);

        await service.update(tableName, id, updateData);
        
        console.log('=== Item updated successfully ===');
        return { message: `${type} updated successfully` };
    } catch (error) {
        console.error(`=== ERROR updating ${type} ===`);
        console.error('Error message:', error.message);
        throw error;
    }
}

async function deleteItem(type, id) {
    try {
        console.log(`=== Deleting item of type: ${type}, id: ${id} ===`);

        const tableName = typeToTableMap[type];
        if (!tableName) {
            throw new Error(`Invalid item type: ${type}`);
        }

        await service.remove(tableName, id);
        console.log('=== Item deleted successfully ===');
        return { message: `${type} deleted successfully` };
    } catch (error) {
        console.error(`=== ERROR deleting ${type} ===`);
        console.error('Error message:', error.message);
        console.error('=== END ERROR ===');
        throw error;
    }
}

module.exports = {
    createItem,
    getItems,
    updateItem,
    deleteItem
};
