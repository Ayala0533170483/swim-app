const express = require('express');
const router = express.Router();
const lessonRequestsController = require('../controllers/lessonRequestsController');

router.post('/', lessonRequestsController.createRequest);

router.get('/', (req, res) => {
    const role = req.user.role;
    const functionName = `get${role.charAt(0).toUpperCase() + role.slice(1)}Requests`;
    lessonRequestsController[functionName](req, res);
});

router.put('/:requestId', lessonRequestsController.updateRequestStatus);

router.delete('/:requestId', lessonRequestsController.deleteRequest);

module.exports = router;
