const multer = require('multer');
const path = require('path');
const fs = require('fs');

// יצירת תיקייה אם לא קיימת
const ensureDirectoryExists = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
};

// הגדרת אחסון לבריכות
const poolStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../uploads/pools');
        ensureDirectoryExists(uploadPath);
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        // שם ייחודי: timestamp + extension מקורי
        const uniqueName = `pool_${Date.now()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

// פילטר לסוגי קבצים מותרים
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('רק קבצי תמונה מותרים (JPG, JPEG, PNG)'), false);
    }
};

// יצירת multer instance לבריכות
const uploadPoolImage = multer({
    storage: poolStorage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB מקסימום
    }
});

// פונקציה למחיקת תמונה ישנה
const deleteOldImage = (imagePath) => {
    if (imagePath) {
        const fullPath = path.join(__dirname, '../uploads/pools', path.basename(imagePath));
        if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
            console.log('Old image deleted:', fullPath);
        }
    }
};

module.exports = {
    uploadPoolImage,
    deleteOldImage
};