import React from 'react';
import './App.css';
import { useStaggeredFadeIn } from './hooks/useStaggeredFadeIn';

function App() {
  // Use staggered fade-in for each section with proper types
  const headerLeft = useStaggeredFadeIn<HTMLDivElement>(0, { delay: 150 });
  const headerRight = useStaggeredFadeIn<HTMLDivElement>(1, { delay: 150 });
  const chineseName = useStaggeredFadeIn<HTMLDivElement>(2, { delay: 200 });
  const nameDivider = useStaggeredFadeIn<HTMLDivElement>(3, { delay: 200 });
  const englishName = useStaggeredFadeIn<HTMLDivElement>(4, { delay: 200 });
  const summaryLabel = useStaggeredFadeIn<HTMLDivElement>(5, { delay: 200 });
  const summaryText = useStaggeredFadeIn<HTMLDivElement>(6, { delay: 200 });
  const linksHeading = useStaggeredFadeIn<HTMLHeadingElement>(7, { delay: 200 });
  const linksList = useStaggeredFadeIn<HTMLDivElement>(8, { delay: 200 });
  const footerCredit = useStaggeredFadeIn<HTMLDivElement>(9, { delay: 200 });

  return (
    <div className="app">
      {/* Header with Navigation and Welcome Text */}
      <header className="header">
        <div className="header-content">
          {/* Left Side - Welcome Text */}
          <div 
            ref={headerLeft.ref}
            className={`header-left fade-in-element ${headerLeft.isVisible ? 'visible' : ''}`}
          >
            <h2 className="welcome-text">Welcome!</h2>
          </div>
          
          {/* Right Side - Navigation */}
          <div 
            ref={headerRight.ref}
            className={`header-right fade-in-element ${headerRight.isVisible ? 'visible' : ''}`}
          >
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
              <div 
                ref={chineseName.ref}
                className={`chinese-name fade-in-element ${chineseName.isVisible ? 'visible' : ''}`}
              >
                唐艾迪
              </div>
              <div 
                ref={nameDivider.ref}
                className={`name-divider fade-in-element ${nameDivider.isVisible ? 'visible' : ''}`}
              ></div>
              <div 
                ref={englishName.ref}
                className={`english-name fade-in-element ${englishName.isVisible ? 'visible' : ''}`}
              >
                <div>Edward</div>
                <div>Tang</div>
              </div>
            </div>
          </div>

          {/* Right Side - Summary Section */}
          <div className="summary-section">
            <div 
              ref={summaryLabel.ref}
              className={`summary-label fade-in-element ${summaryLabel.isVisible ? 'visible' : ''}`}
            >
              Summary
            </div>
            <div 
              ref={summaryText.ref}
              className={`summary-text fade-in-element ${summaryText.isVisible ? 'visible' : ''}`}
            >
              Edward Tang is a developer who loves<br/> building design-forward digital solutions,<br/> and discovering new ways to define how<br/> users interact with technology and AI.<br/>Previously an artist.<br/><br/>Currently a student at <br/>the University of Waterloo.
            </div>
          </div>

          {/* Bottom Left - Links Section */}
          <div className="links-section">
            <h3 
              ref={linksHeading.ref}
              className={`links-heading fade-in-element ${linksHeading.isVisible ? 'visible' : ''}`}
            >
              My Links
            </h3>
            <div 
              ref={linksList.ref}
              className={`links-list fade-in-element ${linksList.isVisible ? 'visible' : ''}`}
            >
              <a href="https://linkedin.com/in/tanged" target="_blank" rel="noopener noreferrer">linkedin.com/in/tanged</a>
              <a href="https://github.com/tangedy" target="_blank" rel="noopener noreferrer">github.com/tangedy</a>
              <a href="https://artstation.com/tangedy" target="_blank" rel="noopener noreferrer">artstation.com/tangedy</a>
              <a href="mailto:e56tang@uwaterloo.ca">e56tang@uwaterloo.ca</a>
            </div>
          </div>

          {/* Footer Credit */}
          <div 
            ref={footerCredit.ref}
            className={`footer-credit fade-in-element ${footerCredit.isVisible ? 'visible' : ''}`}
          >
            designed by Edward Tang and Yi Wen Quach
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
