const genericService = require('../services/genericService');

const TABLE_NAME = 'contact';

async function getMessages(filters = {}) {
    try {
        console.log('=== messagesController.getMessages ===');
        console.log('Filters:', filters);
        
        const messages = await genericService.get(TABLE_NAME, filters);
        console.log('Retrieved messages:', messages.length);
        
        return messages;
    } catch (error) {
        console.error('Error in getMessages:', error);
        throw error;
    }
}

async function createMessage(messageData) {
    try {
        console.log('=== messagesController.createMessage ===');
        console.log('Message data received:', JSON.stringify(messageData, null, 2));
        
        // בדיקה שהנתונים קיימים
        if (!messageData) {
            throw new Error('No message data provided');
        }
        
        // מיפוי השדות לפי מבנה הטבלה
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
        
        // בדיקה שהשדות החובה קיימים
        if (!dataToInsert.full_name || !dataToInsert.email || !dataToInsert.subject || !dataToInsert.message) {
            throw new Error('Missing required fields: name, email, subject, message');
        }
        
        const newMessage = await genericService.create(TABLE_NAME, dataToInsert);
        console.log('Created message:', JSON.stringify(newMessage, null, 2));
        
        return newMessage;
    } catch (error) {
        console.error('Error in createMessage:', error);
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
    deleteMessage
};
