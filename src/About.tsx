import React from 'react';
import './About.css';
import { useStaggeredFadeIn } from './hooks/useStaggeredFadeIn';

interface AboutProps {
  onNavigateHome: () => void;
  onNavigateToProjects: () => void;
}

function About({ onNavigateHome, onNavigateToProjects }: AboutProps) {
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
              <button className="nav-button active">About</button>
              <button onClick={onNavigateToProjects} className="nav-button">Projects</button>
              <button className="nav-button">Contact</button>
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
                <p>Python, C, C#, Java, JavaScript, TypeScript, HTML/CSS</p>
              </div>
              <div className="skill-category">
                <h3>Tools & Frameworks</h3>
                <p>React, Node.js, Next.JS, Flask, Tailwind, Spring Boot, Maven, Git, Azure DevOps, Linux</p>
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
                    <span>2025</span>
                  </div>
                </div>
                <div className="timeline-line"></div>
                <div className="experience-item">
                  <div className="experience-content">
                    <h3>Founding App Designer</h3>
                    <p>Waddlewell LLC</p>
                  </div>
                  <div className="experience-date">
                    <span>2025</span>
                  </div>
                </div>
                <div className="timeline-line"></div>
                <div className="experience-item">
                  <div className="experience-content">
                    <h3>Frontend Developer</h3>
                    <p>University of Waterloo Boxing Club</p>
                  </div>
                  <div className="experience-date">
                    <span>2024</span>
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
