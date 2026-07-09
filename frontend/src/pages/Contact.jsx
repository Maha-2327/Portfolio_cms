import React, { useState } from 'react';
import api from '../api/api';

const initialForm = { name: '', email: '', subject: '', message: '' };

const Contact = () => {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ loading: false, success: false, error: '' });

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) {
      errs.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      errs.email = 'Enter a valid email address';
    }
    if (!form.message.trim() || form.message.trim().length < 10) {
      errs.message = 'Message should be at least 10 characters';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus({ loading: true, success: false, error: '' });
    try {
      await api.post('/contact', form);
      setStatus({ loading: false, success: true, error: '' });
      setForm(initialForm);
      setTimeout(() => setStatus((s) => ({ ...s, success: false })), 4000);
    } catch (err) {
      setStatus({
        loading: false,
        success: false,
        error: err.response?.data?.message || 'Something went wrong. Please try again.',
      });
    }
  };

  return (
    <div className="page contact-page">
      <h1>Get In Touch</h1>
      <p className="muted">Have a project in mind or just want to say hi? Send me a message.</p>

      {status.success && (
        <div className="toast toast-success">✅ Message sent successfully! I'll get back to you soon.</div>
      )}
      {status.error && <div className="toast toast-error">⚠️ {status.error}</div>}

      <form onSubmit={handleSubmit} className="contact-form" noValidate>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input id="name" name="name" type="text" value={form.name} onChange={handleChange} />
          {errors.name && <span className="field-error">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" value={form.email} onChange={handleChange} />
          {errors.email && <span className="field-error">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="subject">Subject (optional)</label>
          <input id="subject" name="subject" type="text" value={form.subject} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label htmlFor="message">Message</label>
          <textarea id="message" name="message" rows="5" value={form.message} onChange={handleChange} />
          {errors.message && <span className="field-error">{errors.message}</span>}
        </div>

        <button type="submit" className="btn btn-primary" disabled={status.loading}>
          {status.loading ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </div>
  );
};

export default Contact;
