const genericService = require('../services/genericService');

const TABLE_NAME = 'contact';

async function getMessages(query = {}, user = null) {
    try {
        console.log('=== messagesController.getMessages ===');
        
        
        if (query.user_id === 'null' && user && user.id) {
            query.user_id = user.id;
        }

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
        return {
            success: true,
            data: messagesWithId
        };
    } catch (error) {
        console.error('Error in getMessages:', error);
        throw {
            statusCode: 500,
            message: 'שגיאה בטעינת ההודעות',
            error: error.message
        };
    }
}

async function createMessage(messageData) {
    try {
        console.log('=== messagesController.createMessage START ===');
        console.log('Message data received:', JSON.stringify(messageData, null, 2));

      
        if (!messageData) {
            console.error('No message data provided');
            throw {
                statusCode: 400,
                message: 'לא התקבלו נתוני הודעה',
                error: 'No message data provided'
            };
        }


        if (messageData.name && !messageData.full_name) {
            messageData.full_name = messageData.name;
            delete messageData.name;
        }

      
        if (!messageData.full_name || !messageData.email || !messageData.subject || !messageData.message) {
            console.log('Missing fields validation failed');
            throw {
                statusCode: 400,
                message: 'חסרים שדות חובה',
                error: 'שם, אימייל, נושא והודעה הם שדות חובה',
                received: {
                    full_name: !!messageData.full_name,
                    email: !!messageData.email,
                    subject: !!messageData.subject,
                    message: !!messageData.message
                }
            };
        }

      
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        if (!emailRegex.test(messageData.email)) {
            console.log('Email validation failed');
            throw {
                statusCode: 400,
                message: 'כתובת אימייל לא תקינה',
                error: 'אנא הכנס כתובת אימייל תקינה'
            };
        }

       
        const validSubjects = ['registration', 'schedule', 'prices', 'facilities', 'complaint', 'other'];
        if (!validSubjects.includes(messageData.subject)) {
            console.log('Subject validation failed');
            throw {
                statusCode: 400,
                message: 'נושא לא תקין',
                error: 'אנא בחר נושא תקין'
            };
        }

        const dataToInsert = {
            full_name: messageData.full_name,
            email: messageData.email,
            phone: messageData.phone || null,
            subject: messageData.subject,
            message: messageData.message,
            created_at: new Date(),
            is_active: 1
        };

        console.log('Data to insert:', JSON.stringify(dataToInsert, null, 2));

        console.log('Calling genericService.create...');
        const newMessage = await genericService.create(TABLE_NAME, dataToInsert);
        console.log('Created message successfully:', JSON.stringify(newMessage, null, 2));

        return {
            success: true,
            data: newMessage,
            message: 'ההודעה נשלחה בהצלחה'
        };
    } catch (error) {
        console.error('=== ERROR in createMessage ===');
        console.error('Error:', error);
        
       
        if (error.statusCode) {
            throw error;
        }
        
   
        throw {
            statusCode: 500,
            message: 'שגיאה בשליחת ההודעה',
            error: error.message
        };
    }
}

async function updateMessage(messageId, updateData) {
    try {
        console.log('=== messagesController.updateMessage ===');
        console.log('Message ID:', messageId, 'Update Data:', updateData);

      
        if (!messageId || isNaN(messageId)) {
            throw {
                statusCode: 400,
                message: 'מזהה הודעה לא תקין',
                error: 'Invalid message ID'
            };
        }

        
        const { 
            id, 
            contact_id, 
            created_at,
            ...dataToUpdate 
        } = updateData;
        
        console.log('Data after cleaning:', dataToUpdate);

        await genericService.update(TABLE_NAME, messageId, dataToUpdate);
        console.log('Message updated successfully');

        return {
            success: true,
            message: 'ההודעה עודכנה בהצלחה'
        };
    } catch (error) {
        console.error('Error in updateMessage:', error);
        
        if (error.statusCode) {
            throw error;
        }
        
        throw {
            statusCode: 500,
            message: 'שגיאה בעדכון ההודעה',
            error: error.message
        };
    }
}

async function deleteMessage(messageId) {
    try {
        console.log('=== messagesController.deleteMessage ===');
        console.log('Message ID:', messageId);

       
        if (!messageId || isNaN(messageId)) {
            throw {
                statusCode: 400,
                message: 'מזהה הודעה לא תקין',
                error: 'Invalid message ID'
            };
        }

        await genericService.remove(TABLE_NAME, messageId);
        console.log('Message deleted successfully');

        return {
            success: true,
            message: 'ההודעה נמחקה בהצלחה'
        };
    } catch (error) {
        console.error('Error in deleteMessage:', error);
        
        if (error.statusCode) {
            throw error;
        }
        
        throw {
            statusCode: 500,
            message: 'שגיאה במחיקת ההודעה',
            error: error.message
        };
    }
}

module.exports = {
    getMessages,
    createMessage,
    deleteMessage,
    updateMessage
};