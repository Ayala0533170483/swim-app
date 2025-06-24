const emailRegisterlessonsTemplate = (studentName, teacherName, requestData, status) => {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('he-IL', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (timeString) => {
        return timeString.substring(0, 5);
    };

    const isApproved = status === 'approved';
    const statusIcon = isApproved ? '🎉' : '😔';
    const statusText = isApproved ? 'אושרה' : 'נדחתה';
    const statusColor = isApproved ? '#28a745' : '#dc3545';

    return `
    <!DOCTYPE html>
    <html dir="rtl" lang="he">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>עדכון בקשת שיעור</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f4f4f4;
            }
            .container {
                background: white;
                padding: 30px;
                border-radius: 10px;
                box-shadow: 0 0 10px rgba(0,0,0,0.1);
            }
            .header {
                text-align: center;
                margin-bottom: 30px;
                padding-bottom: 20px;
                border-bottom: 2px solid #eee;
            }
            .status-badge {
                display: inline-block;
                padding: 10px 20px;
                border-radius: 25px;
                color: white;
                font-weight: bold;
                margin: 10px 0;
                background-color: ${statusColor};
            }
            .lesson-details {
                background: #f8f9fa;
                padding: 20px;
                border-radius: 8px;
                margin: 20px 0;
            }
            .detail-row {
                display: flex;
                justify-content: space-between;
                margin: 10px 0;
                padding: 5px 0;
                border-bottom: 1px solid #eee;
            }
            .detail-label {
                font-weight: bold;
                color: #666;
            }
            .footer {
                text-align: center;
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #eee;
                color: #666;
                font-size: 14px;
            }
            .logo {
                font-size: 24px;
                font-weight: bold;
                color: #0066cc;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">🏊‍♀️ SWIMWISE</div>
                <h1>${statusIcon} בקשת השיעור שלך ${statusText}</h1>
                <div class="status-badge">${statusText.toUpperCase()}</div>
            </div>

            <div class="content">
                <p>שלום ${studentName},</p>
                
                ${isApproved ? `
                    <p>יש לנו חדשות מעולות! המורה ${teacherName} אישר את בקשת השיעור שלך.</p>
                    <p><strong>השיעור נוצר במערכת ואתה יכול לראות אותו ברשימת השיעורים שלך.</strong></p>
                ` : `
                    <p>למרבה הצער, המורה ${teacherName} לא יכול לקיים את השיעור המבוקש.</p>
                    <p>אנו מזמינים אותך לשלוח בקשה חדשה לזמן אחר או למורה אחר.</p>
                `}

                <div class="lesson-details">
                    <h3>פרטי הבקשה:</h3>
                    <div class="detail-row">
                        <span class="detail-label">מורה:</span>
                        <span>${teacherName}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">תאריך:</span>
                        <span>${formatDate(requestData.request_date)}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">שעה:</span>
                        <span>${formatTime(requestData.start_time)} - ${formatTime(requestData.end_time)}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">בריכה:</span>
                        <span>${requestData.pool_name || 'לא צויין'}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">רמה:</span>
                        <span>${requestData.level || 'לא צויין'}</span>
                    </div>
                    ${requestData.note ? `
                    <div class="detail-row">
                        <span class="detail-label">הערות:</span>
                        <span>${requestData.note}</span>
                    </div>
                    ` : ''}
                </div>

                ${isApproved ? `
                    <p><strong>מה הלאה?</strong></p>
                    <ul>
                        <li>השיעור נוסף לרשימת השיעורים שלך במערכת</li>
                        <li>תוכל לראות את פרטי השיעור בעמוד "השיעורים שלי"</li>
                        <li>אנא הגע בזמן לשיעור</li>
                    </ul>
                ` : `
                    <p><strong>מה הלאה?</strong></p>
                    <ul>
                        <li>תוכל לשלוח בקשה חדשה לזמן אחר</li>
                        <li>תוכל לנסות מורה אחר</li>
                        <li>תוכל לפנות אלינו לעזרה במציאת זמן מתאים</li>
                    </ul>
                `}
            </div>

            <div class="footer">
                <p>תודה שבחרת ב-SWIMWISE</p>
                <p>צוות SWIMWISE 🏊‍♀️</p>
            </div>
        </div>
    </body>
    </html>
    `;
};

module.exports = {
    emailRegisterlessonsTemplate
};
