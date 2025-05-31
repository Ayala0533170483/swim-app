import React, { useState } from 'react';
import '../styles/Contact.css';

function Contact() {
  const [form, setForm] = useState({ 
    name: '', 
    email: '', 
    phone: '',
    subject: '',
    message: '' 
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // כאן נשלח את הפניה לשרת
      console.log('Contact form submitted:', form);
      
      // סימולציה של שליחה לשרת
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSubmitStatus('success');
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      <div className="container">
        <div className="contact-header">
          <h1>צור קשר</h1>
          <p>נשמח לשמוע ממך! צור איתנו קשר בכל שאלה או בקשה</p>
        </div>

        <div className="contact-content">
          <div className="contact-info">
            <h2>פרטי התקשרות</h2>
            
            <div className="contact-methods">
              <div className="contact-method">
                <div className="method-icon">📞</div>
                <div className="method-details">
                  <h3>טלפון</h3>
                  <p>03-1234567</p>
                  <span>ראשון-חמישי: 08:00-18:00</span>
                </div>
              </div>

              <div className="contact-method">
                <div className="method-icon">✉️</div>
                <div className="method-details">
                  <h3>אימייל</h3>
                  <p>info@swimschool.co.il</p>
                  <span>מענה תוך 24 שעות</span>
                </div>
              </div>

              <div className="contact-method">
                <div className="method-icon">📍</div>
                <div className="method-details">
                  <h3>כתובת</h3>
                  <p>רחוב הירקון 123</p>
                  <span>תל אביב, ישראל</span>
                </div>
              </div>

              <div className="contact-method">
                <div className="method-icon">💬</div>
                <div className="method-details">
                  <h3>WhatsApp</h3>
                  <p>050-1234567</p>
                  <span>זמין 24/7</span>
                </div>
              </div>
            </div>

            <div className="social-media">
              <h3>עקבו אחרינו</h3>
              <div className="social-links">
                <a href="#" className="social-link facebook">📘 Facebook</a>
                <a href="#" className="social-link instagram">📷 Instagram</a>
                <a href="#" className="social-link youtube">📺 YouTube</a>
              </div>
            </div>
          </div>

          <div className="contact-form-section">
            <h2>שלח הודעה</h2>
            
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">שם מלא *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="form-input"
                    placeholder="הכנס את שמך המלא"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">אימייל *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="form-input"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">טלפון</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="050-1234567"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="subject">נושא *</label>
                  <select
                    id="subject"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    required
                    className="form-input"
                  >
                    <option value="">בחר נושא</option>
                    <option value="registration">הרשמה לקורסים</option>
                    <option value="schedule">מידע על לוחות זמנים</option>
                    <option value="prices">מחירים ותשלומים</option>
                    <option value="facilities">מתקנים ושירותים</option>
                    <option value="complaint">תלונה</option>
                    <option value="other">אחר</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="message">הודעה *</label>
                <textarea
                  id="message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  className="form-textarea"
                  placeholder="כתב את הודעתך כאן..."
                  rows="6"
                />
              </div>

              {submitStatus === 'success' && (
                <div className="success-message">
                  ✅ ההודעה נשלחה בהצלחה! נחזור אליך בקרוב.
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="error-message">
                  ❌ שגיאה בשליחת ההודעה. אנא נסה שוב.
                </div>
              )}

              <button 
                type="submit" 
                className="submit-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'שולח...' : 'שלח הודעה'}
              </button>
            </form>
          </div>
        </div>

        <div className="faq-section">
          <h2>שאלות נפוצות</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h3>איך נרשמים לקורס?</h3>
              <p>ניתן להירשם דרך האתר, בטלפון או בהגעה לאחד הסניפים שלנו.</p>
            </div>
            <div className="faq-item">
              <h3>מה צריך להביא לשיעור הראשון?</h3>
              <p>בגד ים, כובע שחייה, משקפי שחייה ומגבת. שאר הציוד זמין להשאלה.</p>
            </div>
            <div className="faq-item">
              <h3>האם יש הנחות לקבוצות?</h3>
              <p>כן! יש הנחות מיוחדות למשפחות, קבוצות וחברי מועדון.</p>
            </div>
            <div className="faq-item">
              <h3>מה המדיניות ביטול?</h3>
              <p>ניתן לבטל שיעור עד 24 שעות מראש ללא חיוב נוסף.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
