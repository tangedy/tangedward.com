import React from 'react';
import './Projects.css';
import { useStaggeredFadeIn } from './hooks/useStaggeredFadeIn';

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

interface ProjectsProps {
  onNavigateHome: () => void;
  onNavigateToAbout: () => void;
}

const Projects: React.FC<ProjectsProps> = ({ onNavigateHome, onNavigateToAbout }) => {
  // Use staggered fade-in for each section
  const projectsTitle = useStaggeredFadeIn<HTMLDivElement>(2, { delay: 200 });
  const projectsList = useStaggeredFadeIn<HTMLDivElement>(3, { delay: 200 });

  return (
    <div className="app">
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
              <button onClick={onNavigateHome} className="nav-button">Home</button>
              <button onClick={onNavigateToAbout} className="nav-button">About</button>
              <button className="nav-button active">Projects</button>
              {/* <button className="nav-button">Contact</button> */}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="main-content">
        <div className="projects-wrapper">
          {/* Page Title */}
          <div 
            ref={projectsTitle.ref}
            className={`projects-title fade-in-element ${projectsTitle.isVisible ? 'visible' : ''}`}
          >
            <h1>selected work</h1>
          </div>

          {/* Projects Introduction */}
       
          {/* Projects List */}
          <div 
            ref={projectsList.ref}
            className={`projects-list fade-in-element ${projectsList.isVisible ? 'visible' : ''}`}
          >
            {projects.map((project) => (
              <div key={project.id} className="project-item">
                {/* Project Image */}
                <div className="project-image">
                  {project.imageUrl ? (
                    <img src={project.imageUrl} alt={project.title} />
                  ) : (
                    <span>Project Image</span>
                  )}
                </div>
                
                {/* Project Content */}
                <div className="project-content">
                  {/* Project Header */}
                  <div className="project-header">
                    <div className="project-title-section">
                      <h2>{project.title}</h2>
                      <span className="project-year">{project.year}</span>
                    </div>
                    
                    <div className="project-links">
                      {project.liveUrl && (
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="project-link">
                          View Live
                        </a>
                      )}
                      {project.githubUrl && (
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="project-link">
                          View Code
                        </a>
                      )}
                    </div>
                  </div>
                  
                  {/* Project Description */}
                  <div className="project-description">
                    <p>{project.description}</p>
                  </div>
                  
                  {/* Project Technologies */}
                  <div className="project-technologies">
                    {project.technologies.map((tech, techIndex) => (
                      <span key={techIndex} className="tech-tag">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projects;
