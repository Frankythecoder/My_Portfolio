import { useState, type ChangeEvent, type FormEvent } from 'react';
import { ArrowUpRight, Github, Linkedin, Mail, MapPin, Phone, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const initialForm = { name: '', email: '', subject: '', message: '' };
const CONTACT_EMAIL = 'diviyanfrankjeyasingh@gmail.com';
// Web3Forms delivers form submissions to the inbox registered with this public access key
const WEB3FORMS_URL = 'https://api.web3forms.com/submit';
const WEB3FORMS_ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;

// Gmail draft that the visitor sends from their own account, so it truly comes from them
const buildGmailDraftLink = ({ name, subject, message }: typeof initialForm) => {
  const body = name.trim() ? `${message}\n\n— ${name.trim()}` : message;
  const params = new URLSearchParams({ view: 'cm', fs: '1', to: CONTACT_EMAIL, su: subject || 'Hello Frank', body });
  return `https://mail.google.com/mail/?${params.toString()}`;
};

const Contact = () => {
  const [formData, setFormData] = useState(initialForm);
  const [sending, setSending] = useState(false);
  const { toast } = useToast();
  const gmailDraftLink = buildGmailDraftLink(formData);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (sending) return;
    const botcheck = (event.currentTarget.elements.namedItem('botcheck') as HTMLInputElement | null)?.checked ?? false;
    setSending(true);
    try {
      if (!WEB3FORMS_ACCESS_KEY) throw new Error('VITE_WEB3FORMS_ACCESS_KEY is not set');
      const response = await fetch(WEB3FORMS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          ...formData,
          access_key: WEB3FORMS_ACCESS_KEY,
          from_name: `${formData.name} via Portfolio`,
          botcheck,
        }),
      });
      const result: { success?: boolean; message?: string } = await response.json().catch(() => ({}));
      if (!response.ok || !result.success) throw new Error(result.message || `Request failed: ${response.status}`);
      toast({ title: 'Message sent!', description: "Thanks for reaching out. I'll get back to you soon." });
      setFormData(initialForm);
    } catch (error) {
      console.error('Contact form error:', error);
      toast({ title: 'Message not sent', description: 'Please try again or email me directly.', variant: 'destructive' });
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <section id="contact" className="section section-anchor contact-section">
        <div className="shell">
          <div className="section-heading"><span className="section-index">CONTACT</span><span className="section-line" /><span className="section-aside">THE NEXT CHAPTER</span></div>
          <div className="contact-intro"><span className="tiny-label">HAVE AN IDEA? LET'S MAKE IT REAL.</span><h2 className="display-heading">Let's make something<br /><em>great together.</em></h2><p>Whether it's a project, a role, or just a good conversation — my inbox is open.</p></div>
          <div className="contact-grid">
            <div className="contact-details">
              <span className="tiny-label">REACH OUT DIRECTLY</span>
              <a href="mailto:diviyanfrankjeyasingh@gmail.com" className="contact-detail"><span className="contact-detail-icon"><Mail size={21} /></span><span><small>EMAIL ME</small>diviyanfrankjeyasingh@gmail.com</span></a>
              <a href="tel:+918939769590" className="contact-detail"><span className="contact-detail-icon"><Phone size={21} /></span><span><small>GIVE ME A CALL</small>+91 893 976 9590</span></a>
              <div className="contact-detail"><span className="contact-detail-icon"><MapPin size={21} /></span><span><small>BASED IN</small>Chennai, India</span></div>
              <div className="contact-socials"><span className="tiny-label">FIND ME ONLINE</span><div><a href="https://github.com/Frankythecoder" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><Github size={20} /> GitHub <ArrowUpRight size={15} /></a><a href="https://www.linkedin.com/in/diviyan-frank-jeyasingh-28890b27b/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><Linkedin size={20} /> LinkedIn <ArrowUpRight size={15} /></a></div></div>
            </div>
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-heading"><span className="tiny-label">DROP ME A NOTE</span><Send size={21} /></div>
              <div className="form-row"><label htmlFor="contact-name">YOUR NAME<input id="contact-name" name="name" value={formData.name} onChange={handleChange} placeholder="What should I call you?" required /></label><label htmlFor="contact-email">EMAIL ADDRESS<input id="contact-email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" required /></label></div>
              <input type="checkbox" name="botcheck" className="form-honeypot" tabIndex={-1} autoComplete="off" aria-hidden="true" />
              <label htmlFor="contact-subject">SUBJECT<input id="contact-subject" name="subject" value={formData.subject} onChange={handleChange} placeholder="What's on your mind?" required /></label>
              <label htmlFor="contact-message">YOUR MESSAGE<textarea id="contact-message" name="message" value={formData.message} onChange={handleChange} placeholder="Tell me about your idea..." rows={5} required /></label>
              <button className="button-primary form-submit" type="submit" disabled={sending}>{sending ? 'Sending...' : 'Send message'} <ArrowUpRight size={18} /></button>
              <div className="form-alt-send"><span className="tiny-label">OR SEND FROM YOUR OWN EMAIL</span></div>
            </form>
          </div>
        </div>
      </section>
      <footer className="site-footer"><div className="shell footer-inner"><a className="wordmark" href="#home"><img className="wordmark-logo" src="/fj-logo.png" alt="" width={362} height={320} loading="lazy" /><span className="wordmark-text">DIVIYAN FRANK JEYASINGH</span></a><a href="#home">BACK TO TOP ↑</a></div></footer>
    </>
  );
};

export default Contact;
