import { useState } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';

const links = [
  { label: 'About', href: '#about' },
  { label: 'Work', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Skills', href: '#skills' },
  { label: 'Education', href: '#education' },
];

const Navigation = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <nav className="nav-shell shell" aria-label="Main navigation">
        <a className="wordmark" href="#home" onClick={() => setOpen(false)} aria-label="Frank Jeyasingh, home">
          <img className="wordmark-logo" src="/fj-logo.png" alt="" width={362} height={320} />
          <span className="wordmark-text">DIVIYAN FRANK JEYASINGH</span>
        </a>
        <div className="desktop-nav">
          {links.map((link) => <a key={link.href} href={link.href}>{link.label}</a>)}
        </div>
        <a className="nav-contact" href="#contact">Let's talk <ArrowUpRight size={16} /></a>
        <button
          type="button"
          className="mobile-toggle"
          aria-label={open ? 'Close navigation' : 'Open navigation'}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>
      {open && (
        <div className="mobile-nav" id="mobile-navigation">
          {links.map((link) => <a key={link.href} href={link.href} onClick={() => setOpen(false)}>{link.label}</a>)}
          <a href="#contact" onClick={() => setOpen(false)}>Contact <ArrowUpRight size={16} /></a>
        </div>
      )}
    </header>
  );
};

export default Navigation;
