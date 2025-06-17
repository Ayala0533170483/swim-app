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
