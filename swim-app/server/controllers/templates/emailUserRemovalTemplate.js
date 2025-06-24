const createUserRemovalTemplate = (userName, userType) => {
    const userTypeHebrew = userType === 'students' ? 'תלמיד' : 'מורה';

    return `
    <!DOCTYPE html>
    <html dir="rtl" lang="he">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            * { box-sizing: border-box; }
            body { 
                font-family: 'Segoe UI', Tahoma, Arial, sans-serif; 
                direction: rtl; 
                text-align: right; 
                margin: 0; 
                padding: 0;
                background-color: #f0f8ff;
            }
            .container { 
                max-width: 600px; 
                margin: 20px auto; 
                background-color: white;
                border-radius: 10px;
                overflow: hidden;
                box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            }
            .header { 
                background: linear-gradient(135deg, #e74c3c, #c0392b);
                color: white; 
                padding: 30px 20px; 
                text-align: center; 
            }
            .header h1 {
                margin: 0;
                font-size: 24px;
                font-weight: bold;
                text-align: center;
            }
            .content { 
                padding: 30px 25px;
                line-height: 1.6;
                text-align: right;
            }
            .greeting {
                font-size: 18px;
                color: #2c3e50;
                margin-bottom: 20px;
                text-align: right;
            }
            .removal-message {
                background-color: #f8d7da;
                border-right: 4px solid #dc3545;
                padding: 20px;
                margin: 20px 0;
                border-radius: 5px;
                color: #721c24;
                text-align: right;
            }
            .contact-info {
                background-color: #d1ecf1;
                border: 1px solid #bee5eb;
                padding: 20px;
                margin: 25px 0;
                border-radius: 8px;
                text-align: right;
            }
            .contact-info h3 {
                color: #0c5460;
                margin-top: 0;
                margin-bottom: 15px;
                font-size: 18px;
                text-align: right;
            }
            .footer { 
                background-color: #f8f9fa;
                text-align: right; 
                color: #6c757d; 
                padding: 20px;
                font-size: 14px;
            }
            .emoji { font-size: 1.2em; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1><span class="emoji">🏊‍♀️</span>SWIMWISE<span class="emoji">🏊‍♂️</span></h1>
            </div>
            <div class="content">
                <div class="greeting">שלום ${userName}</div>
                
                <div class="removal-message">
                   SWIMWISE הוסרת מהמערכת של בית הספר לשחייה .
                    <br><br>
                    כל השיעורים שהיית רשום אליהם בוטלו אוטומטית.
                </div>
                
                <div class="contact-info">
                    <h3>?יש לך שאלות</h3>
                    <p>
                        אם יש לך שאלות או הערות בנוגע להסרתך מהמערכת,
                        <br>
                        אנא פנה להנהלת בית הספר לשחייה.
                    </p>
                    <p>
                        <strong>!אנחנו כאן לעזור</strong>
                    </p>
                </div>
                
                <p style="color: #6c757d; font-size: 14px; margin-top: 30px; text-align: right;">
                    . SWIMWISE תודה שהיית חלק מקהילת 
                </p>
            </div>
            <div class="footer">
                <p><strong>🌊 בהצלחה בהמשך!</strong></p>
                <p>SWIMWISE | צוות ההנהלה</p>
            </div>
        </div>
    </body>
    </html>
    `;
};

module.exports = {
    createUserRemovalTemplate
};
