import { useState } from 'react';
import ScrollReveal from '../animation/ScrollReveal';
import StaggerReveal from '../animation/StaggerReveal';
import type { ContactFormData } from '../../types';

const PROGRAMS_LIST = [
  'Foundation Training',
  'Meythari (Body Conditioning)',
  'Kolthari (Weapons Training)',
  'Ankathari (Advanced Combat)',
  'Verumkai (Unarmed Combat)',
  'Kalari Chikitsa / Marma Therapy',
  "Kids' Kalari",
  "Women's Self-Defense",
  'General Enquiry',
];

const EMPTY_FORM: ContactFormData = { name: '', email: '', phone: '', program: '', message: '' };

export default function ContactForm() {
  const [form, setForm] = useState<ContactFormData>(EMPTY_FORM);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      // Stubbed — replace with real Laravel API endpoint
      await new Promise((r) => setTimeout(r, 1200));
      setStatus('success');
      setForm(EMPTY_FORM);
    } catch {
      setStatus('error');
    }
  };

  return (
    <section
      aria-labelledby="contact-heading"
      style={{ backgroundColor: 'var(--color-bg)', padding: 'clamp(5rem, 10vw, 9rem) 1.5rem' }}
    >
      <div
        className="max-w-7xl mx-auto"
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'clamp(3rem, 6vw, 7rem)', alignItems: 'start' }}
      >
        {/* Info */}
        <div>
          <ScrollReveal>
            <p className="section-label">Enrollment & Contact</p>
            <div className="section-divider" />
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <h2 id="contact-heading" style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 700, lineHeight: 1.1, marginBottom: '1.5rem' }}>
              Begin Your<br /><span style={{ color: 'var(--color-gold)' }}>Kalari Journey</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.15}>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.9, marginBottom: '2.5rem', fontSize: '0.97rem' }}>
              Fill in the form and our team will reach out within 24 hours to arrange your free trial class. Alternatively, call or WhatsApp us directly.
            </p>
          </ScrollReveal>
          <StaggerReveal stagger={0.08} delay={0.2}>
            {[
              { label: 'Main Centre', value: '+91 495 278 3410', href: 'tel:+914952783410', type: 'tel' },
              { label: 'WhatsApp', value: '+91 98765 43210', href: 'https://wa.me/919876543210', type: 'whatsapp' },
              { label: 'Email', value: 'info@kalariacademy.in', href: 'mailto:info@kalariacademy.in', type: 'email' },
            ].map((item) => (
              <div key={item.label} style={{ marginBottom: '1.2rem' }}>
                <p style={{ fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-text-dim)', marginBottom: '0.3rem' }}>{item.label}</p>
                <a href={item.href} target={item.type === 'whatsapp' ? '_blank' : undefined} rel={item.type === 'whatsapp' ? 'noopener noreferrer' : undefined}
                  style={{ fontSize: '1rem', color: 'var(--color-gold-light)', transition: 'color 0.3s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-gold)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-gold-light)')}>
                  {item.value}
                </a>
              </div>
            ))}
          </StaggerReveal>
          <ScrollReveal delay={0.4}>
            <address style={{ fontStyle: 'normal', marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--color-border)', fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: 1.8 }}>
              <p style={{ fontWeight: 500, color: 'var(--color-text)', marginBottom: '0.3rem' }}>Madhurakandy C.V.N Kalari</p>
              Madhura kandy, CVN KALARI, Vengeri<br />
              Kozhikode, Kerala 673010<br />
              India
            </address>
          </ScrollReveal>
        </div>

        {/* Form */}
        <ScrollReveal delay={0.2}>
          <form onSubmit={handleSubmit} noValidate aria-label="Enrollment enquiry form" style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {[
              { name: 'name', label: 'Full Name', type: 'text', required: true, placeholder: 'Your full name' },
              { name: 'email', label: 'Email Address', type: 'email', required: true, placeholder: 'your@email.com' },
              { name: 'phone', label: 'Phone Number', type: 'tel', required: false, placeholder: '+91 98765 43210' },
            ].map((field) => (
              <div key={field.name} style={{ paddingBottom: '1.8rem' }}>
                <label htmlFor={`contact-${field.name}`} style={{ display: 'block', fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
                  {field.label}{field.required && <span style={{ color: 'var(--color-gold)', marginLeft: '4px' }} aria-label="required">*</span>}
                </label>
                <input
                  id={`contact-${field.name}`}
                  name={field.name}
                  type={field.type}
                  required={field.required}
                  placeholder={field.placeholder}
                  value={(form as unknown as Record<string, string>)[field.name]}
                  onChange={handleChange}
                  className="form-field"
                />
              </div>
            ))}

            <div style={{ paddingBottom: '1.8rem' }}>
              <label htmlFor="contact-program" style={{ display: 'block', fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
                Interested Program
              </label>
              <select id="contact-program" name="program" value={form.program} onChange={handleChange} className="form-field">
                <option value="">Select a program…</option>
                {PROGRAMS_LIST.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            <div style={{ paddingBottom: '1.8rem' }}>
              <label htmlFor="contact-message" style={{ display: 'block', fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
                Message
              </label>
              <textarea
                id="contact-message"
                name="message"
                rows={4}
                placeholder="Any questions or details about your background…"
                value={form.message}
                onChange={handleChange}
                className="form-field"
                style={{ resize: 'vertical' }}
              />
            </div>

            <button
              type="submit"
              disabled={status === 'sending'}
              className="btn btn-primary"
              style={{ alignSelf: 'flex-start', opacity: status === 'sending' ? 0.7 : 1, cursor: status === 'sending' ? 'wait' : 'pointer' }}
            >
              {status === 'sending' ? 'Sending…' : 'Send Enquiry'}
            </button>

            {status === 'success' && (
              <p role="status" style={{ marginTop: '1rem', color: 'var(--color-gold)', fontSize: '0.9rem' }}>
                ✓ Thank you! We'll be in touch within 24 hours.
              </p>
            )}
            {status === 'error' && (
              <p role="alert" style={{ marginTop: '1rem', color: '#e07070', fontSize: '0.9rem' }}>
                Something went wrong. Please call us directly.
              </p>
            )}
          </form>
        </ScrollReveal>
      </div>
    </section>
  );
}
