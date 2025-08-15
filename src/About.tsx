import React from 'react';
import './About.css';
import { useStaggeredFadeIn } from './hooks/useStaggeredFadeIn';

interface AboutProps {
  onNavigateHome: () => void;
}

function About({ onNavigateHome }: AboutProps) {
  // Use staggered fade-in for each section
  const aboutTitle = useStaggeredFadeIn<HTMLDivElement>(2, { delay: 200 });
  const briefSummary = useStaggeredFadeIn<HTMLDivElement>(3, { delay: 200 });
  const skillsSection = useStaggeredFadeIn<HTMLDivElement>(4, { delay: 200 });
  const experienceSection = useStaggeredFadeIn<HTMLDivElement>(5, { delay: 200 });
  const reviewSection = useStaggeredFadeIn<HTMLDivElement>(6, { delay: 200 });

  return (
    <div className="app">
      {/* Header with Navigation */}
      <header className="header">
        <div className="header-content">
          {/* Left Side - Page Title */}
          <div className="header-left">
            <h2 className="welcome-text">About</h2>
          </div>
          
          {/* Right Side - Navigation */}
          <div className="header-right">
            <nav className="nav-links">
              <button onClick={onNavigateHome} className="nav-button">Home</button>
              <a href="#about" className="active">About</a>
              <a href="#projects">Projects</a>
              <a href="#contact">Contact</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="main-content">
        <div className="about-wrapper">
          {/* Page Title */}
          <div 
            ref={aboutTitle.ref}
            className={`about-title fade-in-element ${aboutTitle.isVisible ? 'visible' : ''}`}
          >
          </div>

          {/* Brief Summary */}
          <div 
            ref={briefSummary.ref}
            className={`about-section fade-in-element ${briefSummary.isVisible ? 'visible' : ''}`}
          >
            <h2>about me</h2>
            <p>
              I'm an undergraduate honours student studying mathematics at the University of Waterloo. I enjoy solving complex problems that challenge my critical thinking, and learning new things everyday.<br></br><br></br>My unique background in the arts and principals of design allows me to bring a creative perspective to software development, focusing on the big picture and humanitarian design in the things I build.
            </p>
          </div>

          {/* Skills */}
          <div 
            ref={skillsSection.ref}
            className={`about-section fade-in-element ${skillsSection.isVisible ? 'visible' : ''}`}
          >
            <h2>Skills</h2>
            <div className="skills-content">
              <div className="skill-category">
                <h3>Languages</h3>
                <p>Java, JavaScript, TypeScript, Python, C, HTML/CSS</p>
              </div>
              <div className="skill-category">
                <h3>Tools & Frameworks</h3>
                <p>React, Node.js, Next.JS, Flask, TailwindCSS, Springboot, Maven, Git, Azure DevOps, Linux</p>
              </div>
            </div>
          </div>

          {/* Experience and Testimonial Grid */}
          <div className="experience-testimonial-grid">
            {/* Left Side - Experience Timeline */}
            <div 
              ref={experienceSection.ref}
              className={`about-section experience-left fade-in-element ${experienceSection.isVisible ? 'visible' : ''}`}
            >
              <h2>Experience</h2>
              <div className="experience-timeline">
                <div className="experience-item">
                  <div className="experience-content">
                    <h3>Backend Developer Intern</h3>
                    <p>Government of Ontario</p>
                  </div>
                  <div className="experience-date">
                    <span>2024</span>
                  </div>
                </div>
                <div className="timeline-line"></div>
                <div className="experience-item">
                  <div className="experience-content">
                    <h3>Web Developer</h3>
                    <p>University of Waterloo Boxing Club</p>
                  </div>
                  <div className="experience-date">
                    <span>2023</span>
                  </div>
                </div>
                <div className="timeline-line"></div>
                <div className="experience-item">
                  <div className="experience-content">
                    <h3>App Designer</h3>
                    <p>Waddle</p>
                  </div>
                  <div className="experience-date">
                    <span>2022</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Testimonial */}
            <div 
              ref={reviewSection.ref}
              className={`about-section testimonial-right fade-in-element ${reviewSection.isVisible ? 'visible' : ''}`}
            >
         
              <blockquote>
                "Edward has consistently delivered outstanding results while working with our teams and business clients. 
                Both our client and our own teams are very happy working with him."
              </blockquote>
              <cite>— Senior Manager, Government of Ontario</cite>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
