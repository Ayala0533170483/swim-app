const createGeneralMessageTemplate = (recipientName, subject, messageContent) => {
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
                line-height: 1.8;
                text-align: right;
            }
            .greeting {
                font-size: 18px;
                color: #2c3e50;
                margin-bottom: 20px;
                text-align: right;
            }
    
            .message-content {
                background-color: #ffffff;
                padding: 20px;
                margin: 20px 0;
                border-radius: 8px;
                border: 1px solid #e9ecef;
                color: #495057;
                text-align: right;
                white-space: pre-wrap;
                word-wrap: break-word;
            }
            .attachment-info {
                background-color: #fff3cd;
                border: 1px solid #ffeaa7;
                padding: 15px;
                margin: 20px 0;
                border-radius: 5px;
                text-align: right;
                color: #856404;
            }
            .footer { 
                background-color: #f8f9fa;
                text-align: center; 
                color: #6c757d; 
                padding: 30px 20px;
                font-size: 14px;
                border-top: 1px solid #e9ecef;
            }
            .logo {
                font-size: 20px;
                font-weight: bold;
                color: #4a90e2;
                margin-bottom: 10px;
            }
            .school-info {
                color: #495057;
                font-size: 13px;
                margin-top: 10px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>SwimWise</h1>
            </div>
            <div class="content">
                <div class="greeting">שלום ${recipientName}</div>
        
                
                <div class="message-content">
${messageContent}
                </div>
                
            </div>
            <div class="footer">
                <div class="logo">SwimWise</div>
                <div class="school-info">
                    בית הספר לשחייה<br>
                    צוות השירות
                </div>
            </div>
        </div>
    </body>
    </html>
    `;
};

module.exports = {
    createGeneralMessageTemplate
};
