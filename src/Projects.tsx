import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Projects.css';
import { useStaggeredFadeIn } from './hooks/useStaggeredFadeIn';
import { usePageMetadata } from './hooks/usePageMetadata';

interface Project {
  id: number;
  title: string;
  description: string;
  technologies: string[];
  year: string;
  imageUrl?: string;
  videoUrl?: string;
  liveUrl?: string;
  githubUrl?: string;
}

const projects: Project[] = [
  {
    id: 4,
    title: "MinimalFinance",
    description: "A privacy-focused iOS 17 personal-finance application supporting bank statement imports, spending analytics, recurring expense detection, and transaction categorization.",
    technologies: ["Swift", "SwiftUI", "SwiftData", "Swift Charts", "XCTest", "GitHub Actions"],
    year: "2026",
    imageUrl: "/project assets/MinimalFinance.png"
  },
  {
    id: 5,
    title: "MLee Portfolio Site",
    description: "A responsive portfolio website with a design that allows the client's personality to shine through.",
    technologies: ["React", "Vite", "TypeScript", "Tailwind"],
    year: "2026",
    imageUrl: "/project assets/matthewproject2-poster.webp",
    videoUrl: "/project assets/matthewproject2.mp4",
    liveUrl: "https://jmatthewlee.com",

  },
  {
    id: 1,
    title: "Moti",
    description: "A web app that takes you from vague goal to concrete plan. You input what you want to achieve, and it guides you through a consultation process to clarify exactly what you want, the logistics involved, and creates a time-bound action plan with phases and specific tasks.",
    technologies: ["Tailwind css", "Typescript", "React", "Next.js", "Groq API"],
    year: "2025",
    imageUrl: "/project assets/MOTI.png",
    liveUrl: "https://motiapp.dev",
    githubUrl: "https://github.com/tangedy/MOTI"
  }, 
  {
    id: 2,
    title: "Recipe Radar",
    description: "A full stack web application for college students with dietary restrictions to easily search for accessible recipes tailored to their needs.",
    technologies: ["React", "Javascript", "Python", "CSS"],
    year: "2024",
    imageUrl: "/project assets/Recipe Radar.png",
    githubUrl: "https://github.com/tangedy/Recipe-Radar-HackTheNorth2024"
  },
  {
    id: 3,
    title: "Pixelize",
    description: "A pixel art software made in Python with Object Oriented Programming that enables users to create detailed pixel art with tools like paint bucket, undo, and layers. Supports exporting artwork as transparent PNG files for seamless integration into other projects.",
    technologies: ["Python"],
    year: "2023",
    imageUrl: "/project assets/Pixelize.png",
    githubUrl: "https://github.com/HD-Brody/Pixelize"
  }
];

const Projects: React.FC = () => {
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0].id);
  const selectedProject = projects.find((project) => project.id === selectedProjectId) ?? projects[0];

  usePageMetadata(
    'Projects | Edward Tang',
    'Selected software, product design, and AI projects by Edward Tang.',
    '/projects'
  );

  const projectsTitle = useStaggeredFadeIn<HTMLDivElement>(2, { delay: 200 });
  const projectDetail = useStaggeredFadeIn<HTMLElement>(3, { delay: 200 });
  const projectsList = useStaggeredFadeIn<HTMLElement>(4, { delay: 200 });

  return (
    <div className="app projects-page">
      {/* Header with Navigation */}
      <header className="header">
        <div className="header-content">
          {/* Left Side - Page Title */}
          <div className="header-left">
            <h2 className="welcome-text">Projects</h2>
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
        <div className="projects-wrapper">
          <div className="projects-layout">
            {/* Page Title */}
            <div 
              ref={projectsTitle.ref}
              className={`projects-title fade-in-element ${projectsTitle.isVisible ? 'visible' : ''}`}
            >
              <h1>selected work</h1>
            </div>

            <article
              ref={projectDetail.ref}
              className={`project-detail ${selectedProject.id === 4 ? 'portrait-project' : ''} fade-in-element ${projectDetail.isVisible ? 'visible' : ''}`}
              aria-live="polite"
            >
              <div className="project-image" key={`${selectedProject.id}-image`}>
                {selectedProject.videoUrl ? (
                  <video
                    src={selectedProject.videoUrl}
                    poster={selectedProject.imageUrl}
                    aria-label={`${selectedProject.title} project preview`}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    onLoadedMetadata={(event) => {
                      event.currentTarget.currentTime = 0;
                    }}
                  />
                ) : selectedProject.imageUrl ? (
                  <img
                    src={selectedProject.imageUrl}
                    alt={`${selectedProject.title} project preview`}
                    loading="eager"
                    decoding="async"
                    fetchPriority="high"
                  />
                ) : (
                  <span>Project Image</span>
                )}
              </div>

              <div className="project-content" key={`${selectedProject.id}-content`}>
                <div className="project-heading">
                  <div>
                    <span className="project-year">{selectedProject.year}</span>
                    <h2>{selectedProject.title}</h2>
                  </div>

                  <div className="project-links">
                    {selectedProject.liveUrl && (
                      <a href={selectedProject.liveUrl} target="_blank" rel="noopener noreferrer" className="project-link">
                        <span>View Live</span>
                        <span className="external-arrow" aria-hidden="true" />
                      </a>
                    )}
                    {selectedProject.githubUrl && (
                      <a href={selectedProject.githubUrl} target="_blank" rel="noopener noreferrer" className="project-link">
                        <span>View Code</span>
                        <span className="external-arrow" aria-hidden="true" />
                      </a>
                    )}
                  </div>
                </div>

                <p className="project-description">{selectedProject.description}</p>

                <div className="project-technologies" aria-label="Technologies used">
                  {selectedProject.technologies.map((technology) => (
                    <span key={technology} className="tech-tag">{technology}</span>
                  ))}
                </div>
              </div>
            </article>

            <aside
              ref={projectsList.ref}
              className={`projects-selector fade-in-element ${projectsList.isVisible ? 'visible' : ''}`}
              aria-label="Select a project"
            >
              <h2>Projects</h2>
              <div className="projects-list">
                {projects.map((project, index) => (
                  <React.Fragment key={project.id}>
                    <button
                      type="button"
                      className={`project-selector-item ${project.id === selectedProject.id ? 'active' : ''}`}
                      onClick={() => setSelectedProjectId(project.id)}
                      aria-pressed={project.id === selectedProject.id}
                    >
                      <span className="project-selector-content">
                        <span className="project-selector-title">{project.title}</span>
                        <span className="project-selector-summary">{project.technologies.join(', ')}</span>
                      </span>
                      <span className="project-selector-date">{project.year}</span>
                    </button>
                    {index < projects.length - 1 && <div className="project-divider" />}
                  </React.Fragment>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Projects;
