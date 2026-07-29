import React, { useCallback, useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import './About.css';
import { useStaggeredFadeIn } from './hooks/useStaggeredFadeIn';
import { usePageMetadata } from './hooks/usePageMetadata';

interface Experience {
  id: number;
  title: string;
  company: string;
  year: string;
  description: string;
  imageUrl: string;
}

function About() {
  usePageMetadata(
    'About | Edward Tang',
    'Learn about Edward Tang\'s software development, product design, and machine learning experience.',
    '/about'
  );

  // Modal state
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const modalContentRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const closeTimerRef = useRef<number | null>(null);

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
    triggerRef.current = document.activeElement as HTMLElement;
    setSelectedExperience(experience);
    setIsClosing(false);
    setIsModalOpen(true);
  };

  const closeModal = useCallback(() => {
    if (isClosing) return;

    setIsClosing(true);
    closeTimerRef.current = window.setTimeout(() => {
      setIsModalOpen(false);
      setSelectedExperience(null);
      setIsClosing(false);
      triggerRef.current?.focus();
    }, 300);
  }, [isClosing]);

  useEffect(() => {
    if (!isModalOpen) return;

    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeModal();
        return;
      }

      if (event.key !== 'Tab' || !modalContentRef.current) return;

      const focusableElements = Array.from(
        modalContentRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement?.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [closeModal, isModalOpen]);

  useEffect(() => () => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
    }
  }, []);

  return (
    <div className="app about-page">
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
              <NavLink to="/" end className="nav-button">Home</NavLink>
              <NavLink to="/about" className="nav-button">About</NavLink>
              <NavLink to="/projects" className="nav-button">Projects</NavLink>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
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
              I am an undergraduate honours student studying machine learning at the University of Waterloo. I enjoy tackling challenging problems, and strive to learn new things everyday.<br></br><br></br>My unique background in the arts & design allows me to bring a creative perspective to software development, focusing on the big picture and intentional design in the things I build.
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
                    <button
                      type="button"
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
                    </button>
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
      </main>

      {/* Experience Modal */}
      {isModalOpen && selectedExperience && (
        <div className={`modal-overlay ${isClosing ? 'closing' : ''}`} onClick={closeModal}>
          <div
            ref={modalContentRef}
            className={`modal-content ${isClosing ? 'closing' : ''}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="experience-dialog-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              ref={closeButtonRef}
              type="button"
              className="modal-close"
              onClick={closeModal}
              aria-label="Close experience details"
            >×</button>
            
            <div className="modal-body">
              {/* Left Side - Text Content */}
              <div className="modal-text">
                <h2 id="experience-dialog-title">{selectedExperience.title}</h2>
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
