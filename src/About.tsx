import React, { useState } from 'react';
import './About.css';
import { useStaggeredFadeIn } from './hooks/useStaggeredFadeIn';

interface Experience {
  id: number;
  title: string;
  company: string;
  year: string;
  description: string;
  imageUrl: string;
}

interface AboutProps {
  onNavigateHome: () => void;
  onNavigateToProjects: () => void;
}

function About({ onNavigateHome, onNavigateToProjects }: AboutProps) {
  // Modal state
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Experiences data
  const experiences: Experience[] = [
    {
      id: 1,
      title: "Backend Developer Intern",
      company: "Government of Ontario",
      year: "2025",
      description: "Developed and maintained backend services for government applications, working with Java, Spring Boot, Maven, and React for error handling, security development, and frontend features.",
      imageUrl: "/project assets/OPS collage.png"
    },
    {
      id: 2,
      title: "Founding App Designer",
      company: "Waddlewell LLC",
      year: "2025",
      description: "Led the design and development of a mobile app, securing $334K in early-stage investment through strategic pitching and cross-functional collaboration.",
      imageUrl: "/project assets/waddle prototyping.png"
    },
    {
      id: 3,
      title: "Frontend Developer",
      company: "University of Waterloo Boxing Club",
      year: "2024",
      description: "helped build the onnboarding portal with React and Tailwind CSS that grew our club's membership from 0 to 60+ members in two weeks!",
      imageUrl: "/project assets/uw boxing collage.png"
    }
  ];

  // Use staggered fade-in for each section
  const aboutTitle = useStaggeredFadeIn<HTMLDivElement>(2, { delay: 200 });
  const briefSummary = useStaggeredFadeIn<HTMLDivElement>(3, { delay: 200 });
  const skillsSection = useStaggeredFadeIn<HTMLDivElement>(4, { delay: 200 });
  const experienceSection = useStaggeredFadeIn<HTMLDivElement>(5, { delay: 200 });
  const reviewSection = useStaggeredFadeIn<HTMLDivElement>(6, { delay: 200 });

  // Modal functions
  const openModal = (experience: Experience) => {
    setSelectedExperience(experience);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    const modalContent = document.querySelector('.modal-content') as HTMLElement;
    const modalOverlay = document.querySelector('.modal-overlay') as HTMLElement;
    
    if (modalContent && modalOverlay) {
      // Add exit animations
      modalContent.style.animation = 'modalContentSlideOut 0.3s ease-in forwards';
      modalOverlay.style.animation = 'modalFadeOut 0.3s ease-in forwards';
      
      // Wait for animation to complete before closing
      setTimeout(() => {
        setIsModalOpen(false);
        setSelectedExperience(null);
      }, 200);
    } else {
      setIsModalOpen(false);
      setSelectedExperience(null);
    }
  };

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
              {/* <button className="nav-button">Contact</button> */}
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
                {experiences.map((experience, index) => (
                  <React.Fragment key={experience.id}>
                    <div 
                      className="experience-item clickable"
                      onClick={() => openModal(experience)}
                    >
                      <div className="experience-content">
                        <h3>{experience.title}</h3>
                        <p>{experience.company}</p>
                      </div>
                      <div className="experience-date">
                        <span>{experience.year}</span>
                      </div>
                    </div>
                    {index < experiences.length - 1 && <div className="timeline-line"></div>}
                  </React.Fragment>
                ))}
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

      {/* Experience Modal */}
      {isModalOpen && selectedExperience && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>×</button>
            
            <div className="modal-body">
              {/* Left Side - Text Content */}
              <div className="modal-text">
                <h2>{selectedExperience.title}</h2>
                <h3>{selectedExperience.company}</h3>
                <p>{selectedExperience.description}</p>
              </div>
              
              {/* Right Side - Image */}
              <div className="modal-image">
                <img src={selectedExperience.imageUrl} alt={selectedExperience.title} />
                <p className="modal-image-caption">
                  {selectedExperience.title === "Backend Developer Intern" && "All the intern's first day! & Lunch at the office"}
                  {selectedExperience.title === "Founding App Designer" && "Getting the hang of prototyping in figma!"}
                  {selectedExperience.title === "Frontend Developer" && "Morning after deploying the site & landing page!"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default About;
