import React from 'react';
import './Contact.css';
import { useStaggeredFadeIn } from './hooks/useStaggeredFadeIn';

interface ContactProps {
  onNavigateHome: () => void;
  onNavigateToAbout: () => void;
  onNavigateToProjects: () => void;
}

const Contact: React.FC<ContactProps> = ({ onNavigateHome, onNavigateToAbout, onNavigateToProjects }) => {
  // Use staggered fade-in for each section
  const contactTitle = useStaggeredFadeIn<HTMLDivElement>(2, { delay: 200 });
  const contactContent = useStaggeredFadeIn<HTMLDivElement>(3, { delay: 200 });

  return (
    <div className="app">
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
              <button onClick={onNavigateHome} className="nav-button">Home</button>
              <button onClick={onNavigateToAbout} className="nav-button">About</button>
              <button onClick={onNavigateToProjects} className="nav-button">Projects</button>
              <button className="nav-button active">Contact</button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="main-content">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
