const genericService = require('../services/genericService');

const TABLE_NAME = 'contact';

async function getMessages(filters = {}) {
    try {
        const messages = await genericService.get(TABLE_NAME);
        console.log('Raw messages from DB:', messages);
        const messagesWithId = messages.map(message => {
            console.log('Processing message:', message);
            return {
                ...message,
                id: message.contact_id 
            };
        });

        console.log('Messages with ID:', messagesWithId);
        return messagesWithId;
    } catch (error) {
        console.error('Error in getMessages:', error);
        throw error;
    }
}


async function createMessage(messageData) {
    try {
        console.log('=== messagesController.createMessage START ===');
        console.log('Message data received:', JSON.stringify(messageData, null, 2));


        if (!messageData) {
            console.error('No message data provided');
            throw new Error('No message data provided');
        }


        const dataToInsert = {
            full_name: messageData.name || messageData.full_name,
            email: messageData.email,
            phone: messageData.phone || null,
            subject: messageData.subject,
            message: messageData.message,
            created_at: new Date(),
            is_active: 1
        };

        console.log('Data to insert:', JSON.stringify(dataToInsert, null, 2));


        if (!dataToInsert.full_name || !dataToInsert.email || !dataToInsert.subject || !dataToInsert.message) {
            console.error('Missing required fields');
            console.error('full_name:', !!dataToInsert.full_name);
            console.error('email:', !!dataToInsert.email);
            console.error('subject:', !!dataToInsert.subject);
            console.error('message:', !!dataToInsert.message);
            throw new Error('Missing required fields: name, email, subject, message');
        }

        console.log('Calling genericService.create...');
        const newMessage = await genericService.create(TABLE_NAME, dataToInsert);
        console.log('Created message successfully:', JSON.stringify(newMessage, null, 2));

        return newMessage;
    } catch (error) {
        console.error('=== ERROR in createMessage ===');
        console.error('Error type:', typeof error);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        console.error('Full error:', error);
        throw error;
    }
}

// async function updateMessage(messageId, updateData) {
//     try {
//         console.log('=== messagesController.updateMessage ===');
//         console.log('Message ID:', messageId, 'Update Data:', updateData);

//         await genericService.update(TABLE_NAME, messageId, updateData);
//         console.log('Message updated successfully');

//         return { success: true };
//     } catch (error) {
//         console.error('Error in updateMessage:', error);
//         throw error;
//     }
// }

async function updateMessage(messageId, updateData) {
    try {
        console.log('=== messagesController.updateMessage ===');
        console.log('Message ID:', messageId, 'Update Data:', updateData);

        // הסר שדות שלא צריכים להתעדכן או שיוצרים בעיות
        const { 
            id, 
            contact_id, 
            created_at,  // הסר את created_at - זה לא צריך להתעדכן
            ...dataToUpdate 
        } = updateData;
        
        console.log('Data after cleaning:', dataToUpdate);

        await genericService.update(TABLE_NAME, messageId, dataToUpdate);
        console.log('Message updated successfully');

        return { success: true };
    } catch (error) {
        console.error('Error in updateMessage:', error);
        throw error;
    }
}



async function deleteMessage(messageId) {
    try {
        console.log('=== messagesController.deleteMessage ===');
        console.log('Message ID:', messageId);

        await genericService.remove(TABLE_NAME, messageId);
        console.log('Message deleted successfully');

        return { success: true };
    } catch (error) {
        console.error('Error in deleteMessage:', error);
        throw error;
    }
}

module.exports = {
    getMessages,
    createMessage,
    deleteMessage,
    updateMessage
};
