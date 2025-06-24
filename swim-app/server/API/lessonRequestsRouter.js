const express = require('express');
const router = express.Router();
const lessonRequestsController = require('../controllers/lessonRequestsController');

router.post('/', (req, res, next) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            const error = new Error('חסרים נתונים נדרשים');
            throw error;
        }

        const { student_id, teacher_id, request_date, start_time, end_time } = req.body;

        if (!student_id || !teacher_id || !request_date || !start_time || !end_time) {
            const error = new Error('חסרים נתונים נדרשים');
            throw error;
        }

        lessonRequestsController.createRequest(req, res);
    } catch (error) {
        next(error);
    }
});

router.get('/', (req, res, next) => {
    try {
        if (!req.user) {
            const error = new Error('גישה לא מורשית - נדרש אימות');
            throw error;
        }

        const role = req.user.role;

        if (role) {
            const functionName = `get${role.charAt(0).toUpperCase() + role.slice(1)}Requests`;
            lessonRequestsController[functionName](req, res);
        } else {
            const error = new Error('גישה לא מורשית');
            throw error;
        }
    } catch (error) {
        next(error);
    }
});

router.put('/:requestId', (req, res, next) => {
    try {
        if (!req.user) {
            const error = new Error('גישה לא מורשית - נדרש אימות');
            throw error;
        }

        const { status } = req.body;
        const userRole = req.user.role;

        if (userRole !== 'teacher') {
            const error = new Error('רק מורים יכולים לעדכן סטטוס בקשות');
            throw error;
        }

        if (!status || !['approved', 'rejected'].includes(status)) {
            const error = new Error('סטטוס לא תקין');
            throw error;
        }

        lessonRequestsController.updateRequestStatus(req, res);
    } catch (error) {
        next(error);
    }
});

router.delete('/:requestId', (req, res, next) => {
    try {
        if (!req.user) {
            const error = new Error('גישה לא מורשית - נדרש אימות');
            throw error;
        }

        const userRole = req.user.role;

        if (userRole !== 'teacher') {
            const error = new Error('רק מורים יכולים למחוק בקשות');
            throw error;
        }

        lessonRequestsController.deleteRequest(req, res);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
