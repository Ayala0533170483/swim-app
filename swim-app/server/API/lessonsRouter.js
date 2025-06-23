const express = require('express');
const router = express.Router();
const lessonRequestsController = require('../controllers/lessonRequestsController');

router.post('/', lessonRequestsController.createRequest);

router.get('/', (req, res) => {
    const role = req.user.role;
    
    if (role === 'teacher') {
        lessonRequestsController.getTeacherRequests(req, res);
    } else if (role === 'student') {
        lessonRequestsController.getStudentRequests(req, res);
    } else {
        res.status(403).json({
            success: false,
            message: 'גישה לא מורשית'
        });
    }
});

router.put('/:requestId', lessonRequestsController.updateRequestStatus);

module.exports = router;
