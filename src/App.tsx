import React from 'react';
import './App.css';

function App() {
  return (
    <div className="app">
      {/* Header with Navigation and Welcome Text */}
      <header className="header">
        <div className="header-content">
          {/* Left Side - Welcome Text */}
          <div className="header-left">
            <h2 className="welcome-text">Welcome!</h2>
          </div>
          
          {/* Right Side - Navigation */}
          <div className="header-right">
            <nav className="nav-links">
              <a href="#home">Home</a>
              <a href="#about">About</a>
              <a href="#projects">Projects</a>
              <a href="#contact">Contact</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content - Centered */}
      <div className="main-content">
        <div className="content-wrapper">
          {/* Left Side - Name Section */}
          <div className="name-section-container">
            <div className="name-section">
              <div className="chinese-name">唐艾迪</div>
              <div className="name-divider"></div>
              <div className="english-name">
                <div>Edward</div>
                <div>Tang</div>
              </div>
            </div>
          </div>

          {/* Right Side - Summary Section */}
          <div className="summary-section">
            <div className="summary-label">Summary</div>
            <div className="summary-text">
              Edward Tang is a developer who loves building design-forward digital solutions, and discovering new ways to define how users interact with technology and AI. Previously an artist.<br/><br/>Currently a student at <br/>the University of Waterloo.
            </div>
          </div>

          {/* Bottom Left - Links Section */}
          <div className="links-section">
            <h3 className="links-heading">My Links</h3>
            <div className="links-list">
              <a href="https://linkedin.com/in/tanged" target="_blank" rel="noopener noreferrer">linkedin.com/in/tanged</a>
              <a href="https://github.com/tangedy" target="_blank" rel="noopener noreferrer">github.com/tangedy</a>
              <a href="https://artstation.com/tangedy" target="_blank" rel="noopener noreferrer">artstation.com/tangedy</a>
              <a href="mailto:e56tang@uwaterloo.ca">e56tang@uwaterloo.ca</a>
            </div>
          </div>

          {/* Footer Credit */}
          <div className="footer-credit">
            Designed By Edward Tang and Yi Wen Quach
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
