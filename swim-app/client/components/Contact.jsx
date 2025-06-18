import React, { useState, useEffect, useContext } from 'react';
import AddItem from './AddItem';
import '../styles/Contact.css';
import contactFormStructure from '../structures/ContactStructure'
import useHandleError from '../hooks/useHandleError';
import { userContext } from './App';

function Contact() {
  const [form, setForm] = useState(contactFormStructure.defaultValues);
  const [contactMessages, setContactMessages] = useState([]);
  const [fieldErrors, setFieldErrors] = useState({});
  const { handleError } = useHandleError();

  const { userData } = useContext(userContext);

  useEffect(() => {
    if (userData) {
      console.log('User is logged in:', userData);
      setForm(prev => ({
        ...prev,
        name: userData.name || userData.full_name || '',
        email: userData.email || ''
      }));
    }
  }, [userData]);


  const handleChange = e => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (fieldErrors[name] && value.trim() !== '') {
      setFieldErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateRequiredFields = () => {
    const errors = {};
    const requiredFields = contactFormStructure.formFields.filter(field => field.required);

    requiredFields.forEach(field => {
      if (!form[field.key] || form[field.key].trim() === '') {
        errors[field.key] = 'זהו שדה חובה';
      }
    });

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const addContactMessage = async (newMessage) => {
    try {
      if (!validateRequiredFields()) {
        return;
      }

      const messageData = {
        ...newMessage,
        full_name: newMessage.name,
        ...(userData && { user_id: userData.user_id || userData.id })
      };

      console.log('Message sent successfully:', messageData);
      setContactMessages(prev => [...prev, messageData]);

      if (userData) {
        setForm({
          ...contactFormStructure.defaultValues,
          name: userData.name || userData.full_name || '',
          email: userData.email || ''
        });
      } else {
        setForm(contactFormStructure.defaultValues);
      }

      setFieldErrors({});
      alert('ההודעה נשלחה בהצלחה! נחזור אליך בהקדם.');

    } catch (error) {
      handleError('addError', error, error.response?.status >= 500);
    }
  };


  const isUserLoggedIn = userData;
  const currentUser = userData;

  return (
    <div className="contact-page">
      <div className="container">
        <div className="contact-header">
          <h1>צור קשר</h1>
          <p>נשמח לשמוע ממך! צור איתנו קשר בכל שאלה או בקשה</p>
          {isUserLoggedIn && currentUser && (
            <div className="user-info-banner">
              <p>שלום {currentUser.name || currentUser.full_name}! </p>
            </div>
          )}
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
                  <span>זמין 24/6</span>
                </div>
              </div>
            </div>
          </div>

          <div className="contact-form-section">
            <h2>שלח הודעה</h2>

            <div className="contact-form">
              <form>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">שם מלא *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      className={`form-input ${fieldErrors.name ? 'error' : ''} ${isUserLoggedIn ? 'auto-filled' : ''}`}
                      placeholder="הכנס את שמך המלא"
                      readOnly={userData}
                    />
                    {fieldErrors.name && (
                      <span className="field-error">{fieldErrors.name}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">אימייל *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      className={`form-input ${fieldErrors.email ? 'error' : ''} ${isUserLoggedIn ? 'auto-filled' : ''}`}
                      placeholder="your@email.com"
                      readOnly={userData}
                    />
                    {fieldErrors.email && (
                      <span className="field-error">{fieldErrors.email}</span>
                    )}
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
                      className={`form-input ${fieldErrors.subject ? 'error' : ''}`}
                    >
                      <option value="">בחר נושא</option>
                      <option value="registration">הרשמה לקורסים</option>
                      <option value="schedule">מידע על לוחות זמנים</option>
                      <option value="prices">מחירים ותשלומים</option>
                      <option value="facilities">מתקנים ושירותים</option>
                      <option value="complaint">תלונה</option>
                      <option value="other">אחר</option>
                    </select>
                    {fieldErrors.subject && (
                      <span className="field-error">{fieldErrors.subject}</span>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="message">הודעה *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    className={`form-textarea ${fieldErrors.message ? 'error' : ''}`}
                    placeholder="כתב את הודעתך כאן..."
                    rows="6"
                  />
                  {fieldErrors.message && (
                    <span className="field-error">{fieldErrors.message}</span>
                  )}
                </div>

                <AddItem
                  keys={contactFormStructure.formFields}
                  type={contactFormStructure.settings.submitType}
                  addDisplay={addContactMessage}
                  defaltValues={form}
                  nameButton={contactFormStructure.submitButton.text}
                  validationRules={contactFormStructure.validationRules}
                  useContactStyle={contactFormStructure.settings.useContactStyle}
                  fieldErrors={fieldErrors}
                />
              </form>
            </div>
          </div>
        </div>

        <div className="social-media-section">
          <h2>עקבו אחרינו</h2>
          <div className="social-links">
            <a href="#" className="social-link" target="_blank" rel="noopener noreferrer">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="#1877f2">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>

            <a href="#" className="social-link" target="_blank" rel="noopener noreferrer">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="url(#instagram-gradient)">
                <defs>
                  <linearGradient id="instagram-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#833ab4" />
                    <stop offset="50%" stopColor="#fd1d1d" />
                    <stop offset="100%" stopColor="#fcb045" />
                  </linearGradient>
                </defs>
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441
.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>

            <a href="#" className="social-link" target="_blank" rel="noopener noreferrer">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="#ff0000">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>

            <a href="#" className="social-link" target="_blank" rel="noopener noreferrer">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="#000000">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
              </svg>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Contact;