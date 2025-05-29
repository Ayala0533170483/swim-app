// client/pages/ContactPage.jsx
import React, { useState } from 'react';

 function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    // כאן נשלח את הפניה לשרת
    console.log('Contact form submitted:', form);
  };

  return (
    <div>
      <h2>צור קשר</h2>
      <form onSubmit={handleSubmit}>
        <label>
          שם:
          <input name="name" value={form.name} onChange={handleChange} />
        </label>
        <label>
          אימייל:
          <input name="email" value={form.email} onChange={handleChange} />
        </label>
        <label>
          הודעה:
          <textarea name="message" value={form.message} onChange={handleChange} />
        </label>
        <button type="submit">שלח</button>
      </form>
    </div>
  );
}
export default Contact;