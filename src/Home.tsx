import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import './App.css';
import { useStaggeredFadeIn } from './hooks/useStaggeredFadeIn';
import { usePageMetadata } from './hooks/usePageMetadata';
import './Home.css';

const greetingStorageKey = 'home-greeting';

const getNextGreeting = () => {
  try {
    return window.localStorage.getItem(greetingStorageKey) === 'Welcome!'
      ? 'Huān-yíng!'
      : 'Welcome!';
  } catch {
    return 'Welcome!';
  }
};

function Home() {
    const [greeting] = useState(getNextGreeting);

    useEffect(() => {
      try {
        window.localStorage.setItem(greetingStorageKey, greeting);
      } catch {
        // The greeting still works when browser storage is unavailable.
      }
    }, [greeting]);

    usePageMetadata(
      'Edward Tang | Software Developer & Product Designer',
      'Edward Tang is a software developer and product designer building thoughtful digital and AI experiences.',
      '/'
    );

    // Use staggered fade-in for each section with proper types
    const headerLeft = useStaggeredFadeIn<HTMLDivElement>(0, { delay: 200 });
    const headerRight = useStaggeredFadeIn<HTMLDivElement>(1, { delay: 200 });
    const chineseName = useStaggeredFadeIn<HTMLDivElement>(2, { delay: 200 });
    const nameDivider = useStaggeredFadeIn<HTMLDivElement>(3, { delay: 200 });
    const englishName = useStaggeredFadeIn<HTMLDivElement>(4, { delay: 200 });
    const summaryLabel = useStaggeredFadeIn<HTMLDivElement>(5, { delay: 200 });
    const summaryText = useStaggeredFadeIn<HTMLDivElement>(6, { delay: 200 });
    const linksHeading = useStaggeredFadeIn<HTMLHeadingElement>(7, { delay: 200 });
    const linksList = useStaggeredFadeIn<HTMLDivElement>(8, { delay: 200 });
    const footerCredit = useStaggeredFadeIn<HTMLDivElement>(9, { delay: 200, rootMargin: '0px' });
    return (
      <div className="app home-page">
          {/* Header with Navigation and Welcome Text */}
          <header className="header">
            <div className="header-content">
              {/* Left Side - Welcome Text */}
              <div 
                ref={headerLeft.ref}
                className={`header-left fade-in-element ${headerLeft.isVisible ? 'visible' : ''}`}
              >
                <h2 className="welcome-text">{greeting}</h2>
              </div>
              
              {/* Right Side - Navigation */}
              <div 
                ref={headerRight.ref}
                className={`header-right fade-in-element ${headerRight.isVisible ? 'visible' : ''}`}
              >
                <nav className="nav-links">
                  <NavLink to="/" end className="nav-button">Home</NavLink>
                  <NavLink to="/about" className="nav-button">About</NavLink>
                  <NavLink to="/projects" className="nav-button">Projects</NavLink>
                </nav>
              </div>
            </div>
          </header>
    
          {/* Main Content - Centered */}
          <main className="main-content">
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
                  Edward Tang is a developer with a love<br/> for creating software both functional <br/> and aesthetically deliberate in design. <br/> <br/> He is curious about interactive software<br/>and ways to adopt new technology <br/> seamlessly into our every day lives. <br/><br/>Currently a student at <br/>the University of Waterloo.
                </div>
              </div>
    
              {/* Bottom Left - Links Section */}
              <div className="links-section">
                <h3 
                  ref={linksHeading.ref}
                  className={`links-heading fade-in-element ${linksHeading.isVisible ? 'visible' : ''}`}
                >
                  MY LINKS
                </h3>
                <div 
                  ref={linksList.ref}
                  className={`links-list fade-in-element ${linksList.isVisible ? 'visible' : ''}`}
                >
                  <a href="https://linkedin.com/in/tanged" target="_blank" rel="noopener noreferrer">linkedin.com/in/tanged   ↗</a>
                  <a href="https://artstation.com/tangedy" target="_blank" rel="noopener noreferrer">artstation.com/tangedy  ↗</a>
                  <a href="mailto:e56tang@uwaterloo.ca" target="_blank" rel="noopener noreferrer">e56tang@uwaterloo.ca ↗</a>
                  <a href="https://github.com/tangedy">github.com/tangedy        ↗</a>
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
          </main>
        </div>
      );
}

export default Home;
