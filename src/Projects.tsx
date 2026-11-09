import React, { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import './Projects.css';
import SiteHeader from './SiteHeader';
import { useStaggeredFadeIn } from './hooks/useStaggeredFadeIn';
import { usePageMetadata } from './hooks/usePageMetadata';

interface Project {
  id: number;
  slug: string;
  title: string;
  description: string;
  technologies: string[];
  year: string;
  imageUrl?: string;
  videoUrl?: string;
  liveUrl?: string;
  githubUrl?: string;
  /** Tall phone mockups sit beside their text instead of above it. */
  portrait?: boolean;
}

const mleePosterUrl = "/project assets/matthewproject2-poster.webp";
const mleeVideoUrl = "/project assets/matthewproject2-fast.mp4";

const projects: Project[] = [
  {
    id: 4,
    slug: "minimalfinance",
    title: "MinimalFinance",
    description: "A privacy-focused iOS 17 personal-finance application supporting bank statement imports, spending analytics, recurring expense detection, and transaction categorization.",
    technologies: ["Swift", "SwiftUI", "SwiftData", "Swift Charts", "XCTest", "GitHub Actions"],
    year: "2026",
    imageUrl: "/project assets/MinimalFinance.webp",
    portrait: true
  },
  {
    id: 7,
    slug: "fitstealer",
    title: "FitStealer",
    description: "Shazam for clothes. A floating overlay captures any outfit on your screen, then computer vision breaks it into individual pieces and finds where to buy each one online.",
    technologies: ["Python", "TypeScript", "Kotlin", "Swift", "Baseten", "Shopify Catalog"],
    year: "2026",
    imageUrl: "/project assets/FitStealer.webp",
    githubUrl: "https://github.com/Hack-the-North-2026/HacktheNorth2026",
    portrait: true
  },
  {
    id: 5,
    slug: "mlee-portfolio",
    title: "MLee Portfolio Site",
    description: "A responsive portfolio website with a design that allows the client's personality to shine through.",
    technologies: ["React", "Vite", "TypeScript", "Tailwind"],
    year: "2026",
    imageUrl: mleePosterUrl,
    videoUrl: mleeVideoUrl,
    liveUrl: "https://jmatthewlee.com",

  },
  {
    id: 1,
    slug: "moti",
    title: "Moti",
    description: "A web app that takes you from vague goal to concrete plan. You input what you want to achieve, and it guides you through a consultation process to clarify exactly what you want, the logistics involved, and creates a time-bound action plan with phases and specific tasks.",
    technologies: ["Tailwind css", "Typescript", "React", "Next.js", "Groq API"],
    year: "2025",
    imageUrl: "/project assets/MOTI.webp",
    liveUrl: "https://motiapp.dev",
    githubUrl: "https://github.com/tangedy/MOTI"
  }, 
  {
    id: 2,
    slug: "recipe-radar",
    title: "Recipe Radar",
    description: "A full stack web application for college students with dietary restrictions to easily search for accessible recipes tailored to their needs.",
    technologies: ["React", "Javascript", "Python", "CSS"],
    year: "2024",
    imageUrl: "/project assets/Recipe Radar.webp",
    githubUrl: "https://github.com/tangedy/Recipe-Radar-HackTheNorth2024"
  },
  {
    id: 3,
    slug: "pixelize",
    title: "Pixelize",
    description: "A pixel art software made in Python with Object Oriented Programming that enables users to create detailed pixel art with tools like paint bucket, undo, and layers. Supports exporting artwork as transparent PNG files for seamless integration into other projects.",
    technologies: ["Python"],
    year: "2023",
    imageUrl: "/project assets/Pixelize.webp",
    githubUrl: "https://github.com/HD-Brody/Pixelize"
  }
];

const Projects: React.FC = () => {
  // The selected project lives in the URL (?project=moti) so it can be shared and survives reloads.
  const [searchParams, setSearchParams] = useSearchParams();
  const mleeVideoRef = useRef<HTMLVideoElement>(null);
  const selectedProject = projects.find((project) => project.slug === searchParams.get('project')) ?? projects[0];
  const selectProject = (project: Project) => {
    setSearchParams(project.id === projects[0].id ? {} : { project: project.slug }, { replace: true });
  };
  const isMleeSelected = selectedProject.videoUrl === mleeVideoUrl;
  const selectorRefs = useRef<Array<HTMLButtonElement | null>>([]);

  // Arrow keys (and Home/End) move through the project list, selecting as they go.
  const handleSelectorKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const currentIndex = projects.findIndex((project) => project.id === selectedProject.id);
    const nextIndexByKey: Record<string, number> = {
      ArrowDown: (currentIndex + 1) % projects.length,
      ArrowRight: (currentIndex + 1) % projects.length,
      ArrowUp: (currentIndex - 1 + projects.length) % projects.length,
      ArrowLeft: (currentIndex - 1 + projects.length) % projects.length,
      Home: 0,
      End: projects.length - 1,
    };
    const nextIndex = nextIndexByKey[event.key];
    if (nextIndex === undefined) return;

    event.preventDefault();
    selectProject(projects[nextIndex]);
    selectorRefs.current[nextIndex]?.focus();
  };

  useEffect(() => {
    mleeVideoRef.current?.load();
  }, []);

  useEffect(() => {
    const video = mleeVideoRef.current;
    if (!video) return;

    video.currentTime = 0;
    if (isMleeSelected) {
      const playback = video.play();
      playback?.catch(() => undefined);
    } else {
      video.pause();
    }
  }, [isMleeSelected]);

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
      <SiteHeader title="Projects" />

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
              className={`project-detail ${selectedProject.portrait ? 'portrait-project' : ''} fade-in-element ${projectDetail.isVisible ? 'visible' : ''}`}
              aria-live="polite"
            >
              <div className={`project-image ${isMleeSelected ? 'video-project' : ''}`}>
                <video
                  ref={mleeVideoRef}
                  src={mleeVideoUrl}
                  poster={mleePosterUrl}
                  aria-label="MLee Portfolio Site project preview"
                  autoPlay={isMleeSelected}
                  muted
                  loop
                  playsInline
                  preload="auto"
                  hidden={!isMleeSelected}
                />
                {!isMleeSelected && selectedProject.imageUrl ? (
                  <img
                    key={`${selectedProject.id}-image`}
                    src={selectedProject.imageUrl}
                    alt={`${selectedProject.title} project preview`}
                    loading="eager"
                    decoding="async"
                    fetchPriority="high"
                  />
                ) : !isMleeSelected ? <span key={`${selectedProject.id}-image`}>Project Image</span> : null}
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
                        View Live ↗︎
                      </a>
                    )}
                    {selectedProject.githubUrl && (
                      <a href={selectedProject.githubUrl} target="_blank" rel="noopener noreferrer" className="project-link">
                        View Code ↗︎
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
              <div className="projects-list" onKeyDown={handleSelectorKeyDown}>
                {projects.map((project, index) => (
                  <React.Fragment key={project.id}>
                    <button
                      ref={(element) => { selectorRefs.current[index] = element; }}
                      type="button"
                      className={`project-selector-item ${project.id === selectedProject.id ? 'active' : ''}`}
                      onClick={() => selectProject(project)}
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
