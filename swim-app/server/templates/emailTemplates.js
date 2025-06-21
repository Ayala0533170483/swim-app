const createLessonConfirmationTemplate = (studentName, lessonData) => {
    const lessonDate = new Date(lessonData.lesson_date);
    const formattedDate = lessonDate.toLocaleDateString('he-IL', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

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
                background: linear-gradient(135deg, #4a90e2, #357abd);
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
            // .success-message {
            //     background-color: #d4edda;
            //     border-right: 4px solid #28a745;
            //     padding: 15px;
            //     margin: 20px 0;
            //     border-radius: 5px;
            //     color: #155724;
            //     text-align: right;
            // }
            .lesson-details { 
                background-color: #f8f9fa;
                border: 1px solid #e9ecef;
                padding: 20px; 
                margin: 25px 0; 
                border-radius: 8px;
                text-align: right;
            }
            .lesson-details h3 {
                color: #4a90e2;
                margin-top: 0;
                margin-bottom: 15px;
                font-size: 20px;
                border-bottom: 2px solid #4a90e2;
                padding-bottom: 8px;
                text-align: right;
            }
            .detail-row {
                padding: 8px 0;
                border-bottom: 1px solid #e9ecef;
                text-align: right;
            }
            .detail-row:last-child {
                border-bottom: none;
            }
            .detail-label {
                font-weight: bold;
                color: #495057;
                display: inline-block;
                margin-left: 10px;
            }
            .detail-value {
                color: #2c3e50;
                font-weight: 500;
                display: inline-block;
            }
            .calendar-info {
                background-color: #fff3cd;
                border: 1px solid #ffeaa7;
                padding: 15px;
                margin: 20px 0;
                border-radius: 5px;
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
                <h1><span class="emoji">🏊‍♀️</span>SwimWise<span class="emoji">🏊‍♂️</span></h1>
            </div>
            <div class="content">
                <div class="greeting">שלום ,${studentName}</div>
                
                <div class="success-message">
                    <strong></strong> נרשמת לשיעור השחייה 
                </div>
                
                <div class="lesson-details">
                    <h3>פרטי השיעור שלך:</h3>
                    
                    <div class="detail-row">
                        <span class="detail-value">${formattedDate}</span>
                        <span class="detail-label">📅 תאריך:</span>
                    </div>
                    
                    <div class="detail-row">
                        <span class="detail-value">${lessonData.start_time} - ${lessonData.end_time}</span>
                        <span class="detail-label">⏰ שעה:</span>
                    </div>
                    
                    <div class="detail-row">
                        <span class="detail-value">${lessonData.pool_name}</span>
                        <span class="detail-label">🏊 בריכה:</span>
                    </div>
                    
                    <div class="detail-row">
                        <span class="detail-value">${lessonData.teacher_name}</span>
                        <span class="detail-label">👨‍🏫 מדריך:</span>
                    </div>
                    
                    <div class="detail-row">
                        <span class="detail-value">${lessonData.lesson_type === 'private' ? 'שיעור פרטי' : 'שיעור קבוצתי'}</span>
                        <span class="detail-label">📋 סוג שיעור:</span>
                    </div>
                </div>
                
                <div class="calendar-info">
                    <strong>הוספה ליומן</strong><br>
                    קובץ היומן מצורף למייל - לחץ עליו כדי להוסיף את השיעור ליומן שלך
                </div>
                
                <p style="color: #6c757d; font-size: 14px; margin-top: 30px; text-align: right;">
                    אנא הגע 10 דקות לפני תחילת השיעור עם ציוד שחייה מתאים.
                </p>
            </div>
            <div class="footer">
                <p><strong>🌊 בהצלחה בשיעור!</strong> </p>
                <p>swinSchool | צוות השירות</p>
            </div>
        </div>
    </body>
    </html>
    `;
};


module.exports = {
    createLessonConfirmationTemplate
};
