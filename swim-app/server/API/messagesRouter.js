
const express = require('express');
const router = express.Router();
const messagesController = require('../controllers/messagesController');
const verifyToken = require('../middleware/verifyToken');

router.get('/', verifyToken, async (req, res) => {
    try {
        console.log('=== GET /messages ===');
        const query = { ...req.query };
        
        if (query.user_id === 'null' && req.user && req.user.id) {
            query.user_id = req.user.id;
        }
        
        const messages = await messagesController.getMessages(query);
        res.json({ data: messages });
    } catch (error) {
        console.error('Error in GET /messages:', error);
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        console.log('=== POST /messages ===');
        console.log('Request body:', JSON.stringify(req.body, null, 2));
        
        const messageData = req.body;

        if (messageData.name && !messageData.full_name) {
            messageData.full_name = messageData.name;
            delete messageData.name;
        }

    
        if (!messageData.full_name || !messageData.email || !messageData.subject || !messageData.message) {
            console.log('Missing fields validation failed');
            return res.status(400).json({
                success: false,
                message: 'חסרים שדות חובה',
                error: 'שם, אימייל, נושא והודעה הם שדות חובה',
                received: {
                    full_name: !!messageData.full_name,
                    email: !!messageData.email,
                    subject: !!messageData.subject,
                    message: !!messageData.message
                }
            });
        }

       
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        if (!emailRegex.test(messageData.email)) {
            console.log('Email validation failed');
            return res.status(400).json({
                success: false,
                message: 'כתובת אימייל לא תקינה',
                error: 'אנא הכנס כתובת אימייל תקינה'
            });
        }

        const validSubjects = ['registration', 'schedule', 'prices', 'facilities', 'complaint', 'other'];
        if (!validSubjects.includes(messageData.subject)) {
            console.log('Subject validation failed');
            return res.status(400).json({
                success: false,
                message: 'נושא לא תקין',
                error: 'אנא בחר נושא תקין'
            });
        }

        const newMessage = await messagesController.createMessage(messageData);

        res.status(201).json({
            success: true,
            data: newMessage,
            message: 'ההודעה נשלחה בהצלחה'
        });

    } catch (error) {
        console.error('Error in POST /messages:', error);
        res.status(500).json({
            success: false,
            message: 'שגיאה בשליחת ההודעה',
            error: error.message
        });
    }
});

router.delete('/:id', verifyToken, async (req, res) => {
    try {
        console.log('=== DELETE /messages/:id ===');
        const messageId = req.params.id;
        console.log('Message ID to delete:', messageId);

        if (!messageId || isNaN(messageId)) {
            return res.status(400).json({
                success: false,
                message: 'מזהה הודעה לא תקין'
            });
        }

        await messagesController.deleteMessage(messageId);

        res.json({
            success: true,
            message: 'ההודעה נמחקה בהצלחה'
        });

    } catch (error) {
        console.error('Error in DELETE /messages:', error);
        res.status(500).json({
            success: false,
            message: 'שגיאה במחיקת ההודעה',
            error: error.message
        });
    }
});

module.exports = router;
