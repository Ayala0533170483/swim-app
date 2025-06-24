const lessonRequestsService = require('../services/lessonRequestsService');
const { sendLessonRequestStatusEmail } = require('./emailController');

async function createRequest(req, res) {
    try {
        const requestData = {
            ...req.body,
            requested_date: new Date(),
            status: 'pending'
        };

        const result = await lessonRequestsService.createRequest(requestData);

        res.json({
            success: true,
            message: 'הבקשה נשלחה בהצלחה',
            data: result
        });

    } catch (error) {
        console.error('Error creating lesson request:', error);
        res.status(500).json({
            success: false,
            message: 'שגיאה ביצירת הבקשה'
        });
    }
}

async function getTeacherRequests(req, res) {
    try {
        const teacherId = req.user.id;
        const requests = await lessonRequestsService.getTeacherRequests(teacherId);

        res.json({
            success: true,
            data: requests
        });

    } catch (error) {
        console.error('Error fetching teacher requests:', error);
        res.status(500).json({
            success: false,
            message: 'שגיאה בטעינת הבקשות'
        });
    }
}

async function getStudentRequests(req, res) {
    try {
        const studentId = req.user.id;
        const requests = await lessonRequestsService.getStudentRequests(studentId);

        res.json({
            success: true,
            data: requests
        });

    } catch (error) {
        console.error('Error fetching student requests:', error);
        res.status(500).json({
            success: false,
            message: 'שגיאה בטעינת הבקשות'
        });
    }
}

async function updateRequestStatus(req, res) {
    try {
        const { requestId } = req.params;
        const { status } = req.body;
        const teacherId = req.user.id;

        const updatedRequestData = await lessonRequestsService.updateRequestStatus(requestId, { status });

        try {
            await sendLessonRequestStatusEmail(
                updatedRequestData.student_email,
                updatedRequestData.student_name,
                updatedRequestData.teacher_name,
                updatedRequestData,
                status
            );
        } catch (emailError) {
            console.error('Failed to send status email:', emailError);
        }

        res.json({
            success: true,
            message: status === 'approved' ? 'הבקשה אושרה ושיעור נוצר במערכת' : 'הבקשה נדחתה'
        });

    } catch (error) {
        console.error('Error updating request status:', error);
        res.status(500).json({
            success: false,
            message: 'שגיאה בעדכון הבקשה'
        });
    }
}

async function deleteRequest(req, res) {
    try {
        const { requestId } = req.params;
        const teacherId = req.user.id;

        const updatedRequestData = await lessonRequestsService.updateRequestStatus(requestId, { status: 'rejected' });

        try {
            await sendLessonRequestStatusEmail(
                updatedRequestData.student_email,
                updatedRequestData.student_name,
                updatedRequestData.teacher_name,
                updatedRequestData,
                'rejected'
            );
        } catch (emailError) {
            console.error('Failed to send rejection email:', emailError);
        }

        res.json({
            success: true,
            message: 'הבקשה נדחתה'
        });

    } catch (error) {
        console.error('Error rejecting request:', error);
        res.status(500).json({
            success: false,
            message: 'שגיאה בדחיית הבקשה'
        });
    }
}

module.exports = {
    createRequest,
    getTeacherRequests,
    getStudentRequests,
    updateRequestStatus,
    deleteRequest
};
