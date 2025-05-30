const express = require('express');
const router = express.Router();
const bl = require('../controllers/logic.js');     // ה־business logic שלך
const jwt = require('jsonwebtoken');

const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh-secret';
const ACCESS_SECRET = process.env.JWT_SECRET || 'access-secret';


// 1) LOGIN – בלי שינוי משמעותי
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await bl.loginUser(email, password);
        const ip = req.ip;
        bl.sendAuthTokens(res, user, ip);
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
});


// 2) SIGNUP (register) – מותאם לשדות בקומפוננטת ה־Signup שלך
router.post('/signup', async (req, res) => {
    try {
        // a) שליפת כל השדות ששלחת מה-frontend
        const { username, password, name, email, phone } = req.body;

        // b) בדיקת קיום משתמש על פי email (או username לפי בחירה)
        const existing = await bl.getItems('users', { email });
        if (existing.length > 0) {
            return res.status(409).json({ error: 'Email already exists' });
        }

        // c) יצירת משתמש חדש – בפונקציה שלך תטפל ב־hash של הסיסמה וב־INSERT
        const newUser = await bl.registerUser({ username, password, name, email, phone });

        // d) שליחת הטוקנים (access+refresh) בדיוק כמו ב־login
        const ip = req.ip;
        bl.sendAuthTokens(res, newUser, ip);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});


// 3) (אופציונלי) – אם תרצי עדיין refresh/logout, פשוט פתחי שוב את הקוד הזה
// router.post('/refresh', (req, res) => { … });
// router.post('/logout',  (req, res) => { … });


module.exports = router;
