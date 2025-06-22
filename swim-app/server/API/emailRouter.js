const express = require('express');
const router = express.Router();

// זמנית - נתיב בסיסי
router.get('/', (req, res) => {
    res.json({ message: 'Email router is working' });
});

module.exports = router;
