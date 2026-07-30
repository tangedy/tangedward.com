import React from 'react';
import { NavLink } from 'react-router-dom';
import './Contact.css';
import { useStaggeredFadeIn } from './hooks/useStaggeredFadeIn';
import { usePageMetadata } from './hooks/usePageMetadata';

const Contact: React.FC = () => {
  usePageMetadata(
    'Contact | Edward Tang',
    'Contact Edward Tang about software development, product design, and collaboration opportunities.',
    '/contact'
  );

  // Use staggered fade-in for each section

  const contactContent = useStaggeredFadeIn<HTMLDivElement>(3, { delay: 200 });

  return (
    <div className="app contact-page">
      {/* Header with Navigation */}
      <header className="header">
        <div className="header-content">
          {/* Left Side - Page Title */}
          <div className="header-left">
            <h2 className="welcome-text">Contact</h2>
          </div>
          
          {/* Right Side - Navigation */}
          <div className="header-right">
            <nav className="nav-links">
              <NavLink to="/" end className="nav-button">Home</NavLink>
              <NavLink to="/about" className="nav-button">About</NavLink>
              <NavLink to="/projects" className="nav-button">Projects</NavLink>
              <NavLink to="/contact" className="nav-button">Contact</NavLink>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="contact-wrapper">
          {/* Contact Content */}
          <div 
            ref={contactContent.ref}
            className={`contact-content fade-in-element ${contactContent.isVisible ? 'visible' : ''}`}
          >
            {/* Left Side - Get in Touch */}
            <div className="contact-left">
              <h1 className="contact-heading">
                <span>Get in</span>
                <span>Touch</span>
              </h1>
            </div>

            {/* Vertical Separator */}
            <div className="contact-separator"></div>

            {/* Right Side - Content */}
            <div className="contact-right">
              <p className="contact-text">
                I'm always open to discussing new opportunities, collaborations, or just having a conversation about technology and design.
              </p>
              <p className="contact-text">
                Feel free to reach out if you'd like to connect or have any questions about my work.
              </p>
              <div className="contact-actions">
                <a className="contact-primary" href="mailto:e56tang@uwaterloo.ca">
                  Email Edward
                </a>
                <a href="https://linkedin.com/in/tanged" target="_blank" rel="noopener noreferrer">
                  LinkedIn ↗︎
                </a>
                <a href="https://github.com/tangedy" target="_blank" rel="noopener noreferrer">
                  GitHub ↗︎
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Contact;
