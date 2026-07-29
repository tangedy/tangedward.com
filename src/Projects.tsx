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
  liveUrl?: string;
  githubUrl?: string;
}

const projects: Project[] = [
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
          {/* Page Title */}
          <div 
            ref={projectsTitle.ref}
            className={`projects-title fade-in-element ${projectsTitle.isVisible ? 'visible' : ''}`}
          >
            <h1>selected work</h1>
          </div>

          <div className="projects-layout">
            <article
              ref={projectDetail.ref}
              className={`project-detail fade-in-element ${projectDetail.isVisible ? 'visible' : ''}`}
              aria-live="polite"
            >
              <div className="project-image" key={`${selectedProject.id}-image`}>
                {selectedProject.imageUrl ? (
                  <img src={selectedProject.imageUrl} alt={`${selectedProject.title} project preview`} />
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
                        View Live ↗
                      </a>
                    )}
                    {selectedProject.githubUrl && (
                      <a href={selectedProject.githubUrl} target="_blank" rel="noopener noreferrer" className="project-link">
                        View Code ↗
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
