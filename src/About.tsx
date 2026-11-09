import React, { useCallback, useEffect, useRef, useState } from 'react';
import './About.css';
import './Modal.css';
import './Skeleton.css';
import SiteHeader from './SiteHeader';
import { useImageLoaded } from './hooks/useImageLoaded';
import { useStaggeredFadeIn } from './hooks/useStaggeredFadeIn';
import { usePageMetadata } from './hooks/usePageMetadata';

interface ExperienceImage {
  /** Files live in /public/experience as `<slug>-600.webp` and `<slug>-<width>.webp`. */
  slug: string;
  width: number;
  height: number;
  caption?: string;
}

interface Experience {
  id: number;
  title: string;
  company: string;
  year: string;
  description?: string;
  image?: ExperienceImage;
}

const experiences: Experience[] = [
  {
    id: 4,
    title: 'Software Engineer Intern',
    company: 'TD Bank',
    year: '2027',
  },
  {
    id: 6,
    title: 'AI/ML Developer',
    company: 'University of Waterloo Reality Labs',
    year: '2026',
    description: 'Trained a Siamese neural network for few-shot VR hand-gesture recognition, reaching 97% F1 on unseen gestures from just one example, contributing to the Universal Gestures Unity plugin for mixed-reality developers.',
    image: { slug: 'reality-labs', width: 1200, height: 704, caption: 'Our gesture recognition in action!' },
  },
  {
    id: 5,
    title: 'Software Developer Co-op',
    company: 'Government of Ontario',
    year: '2026',
    description: 'Used agentic AI tooling to automate end-to-end testing with Playwright and Azure DevOps pipelines, cutting a 10-minute manual QA workflow down to 1 minute, and built a Next.js dashboard so QA teams could run test suites without a terminal.',
    image: { slug: 'ops-pho', width: 1200, height: 1370, caption: 'Pho with all the interns on the last day!' },
  },
  {
    id: 1,
    title: 'Software Analyst Co-op',
    company: 'Government of Ontario',
    year: '2025',
    description: 'Developed and maintained backend services for government applications, working with Java, Spring Boot, Maven, and React for error handling, security development, and frontend features.',
    image: { slug: 'ops', width: 1161, height: 909, caption: "All the intern's first day! & Lunch at the office" },
  },
  {
    id: 3,
    title: 'Frontend Developer',
    company: 'University of Waterloo Boxing Club',
    year: '2024',
    description: "Helped build the onboarding portal with React and Tailwind CSS that grew our club's membership from 0 to 60+ members in two weeks!",
    image: { slug: 'uw-boxing', width: 1161, height: 909, caption: 'Morning after deploying the site & landing page!' },
  },
];

const testimonials = [
  {
    quote: 'Edward has consistently delivered outstanding results while working with our teams and business clients. Both our client and our own teams are very happy working with him.',
    source: 'Senior Manager, Government of Ontario',
  },
  {
    quote: "Edward delivered an outstanding performance throughout his co-op term, making significant contributions to LTC's mission-critical technology modernization initiatives under tight timelines and a demanding delivery schedule.",
    source: 'Manager, Solutions Delivery',
  },
];

// Each testimonial stays up this long (the active bar fills over it) before cross-fading to the next.
const TESTIMONIAL_INTERVAL_MS = 7000;

// Roles later than this year are drawn with a hollow dot on the timeline.
const currentYear = new Date().getFullYear();

const experienceSrc = (image: ExperienceImage) => `/experience/${image.slug}-600.webp`;
const experienceSrcSet = (image: ExperienceImage) => (
  `/experience/${image.slug}-600.webp 600w, /experience/${image.slug}-${image.width}.webp ${image.width}w`
);
// Matches the rendered width in the modal: ~480px on desktop, nearly full width on phones.
const experienceSizes = '(max-width: 820px) 90vw, 480px';

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

  // Use staggered fade-in for each section (0 and 1 are the header)
  const experienceSection = useStaggeredFadeIn<HTMLElement>(2, { delay: 200 });
  const aboutSection = useStaggeredFadeIn<HTMLElement>(3, { delay: 200 });
  const testimonialSection = useStaggeredFadeIn<HTMLElement>(4, { delay: 200 });

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

  // Warm the cache once the page is idle so a pop-up's photo is ready the moment it opens.
  useEffect(() => {
    const preload = () => {
      experiences.forEach(({ image }) => {
        if (!image) return;
        const preloadImage = new Image();
        preloadImage.sizes = experienceSizes;
        preloadImage.srcset = experienceSrcSet(image);
        preloadImage.src = experienceSrc(image);
      });
    };

    if (typeof window.requestIdleCallback === 'function') {
      const idleId = window.requestIdleCallback(preload);
      return () => window.cancelIdleCallback(idleId);
    }

    const timeoutId = window.setTimeout(preload, 1000);
    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => () => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
    }
  }, []);

  return (
    <div className="app about-page">
      <SiteHeader title="About" />

      {/* Main Content */}
      <main className="main-content">
        {/* Experience (narrow, left) beside About me + Testimonials (wide, right) */}
        <div className="about-wrapper">
          <section
            ref={experienceSection.ref}
            className={`about-section about-experience fade-in-element ${experienceSection.isVisible ? 'visible' : ''}`}
          >
            <div className="about-section-heading">
              <h2>Experience</h2>
              <span className="about-section-count">({String(experiences.length).padStart(2, '0')})</span>
            </div>
            <ol className="experience-timeline">
              {experiences.map((experience) => (
                <li key={experience.id}>
                  <button
                    type="button"
                    className={`experience-item clickable ${Number(experience.year) > currentYear ? 'is-upcoming' : ''}`}
                    onClick={() => openModal(experience)}
                  >
                    <span className="experience-year">{experience.year}</span>
                    <h3>{experience.title}</h3>
                    <p>{experience.company}</p>
                  </button>
                </li>
              ))}
            </ol>
          </section>

          <div className="about-main-column">
            <section
              ref={aboutSection.ref}
              className={`about-section about-intro fade-in-element ${aboutSection.isVisible ? 'visible' : ''}`}
            >
              <h2>About me</h2>
              <p>I am an undergraduate honours student studying machine learning at the University of Waterloo. I enjoy tackling challenging problems, and strive to learn new things everyday.</p>
              <p>My unique background in the arts & design allows me to bring a creative perspective to software development, focusing on the big picture and intentional design in the things I build.</p>
            </section>

            <section
              ref={testimonialSection.ref}
              className={`about-section about-testimonials fade-in-element ${testimonialSection.isVisible ? 'visible' : ''}`}
            >
              <TestimonialRotator />
            </section>
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
            
            <div className={`modal-body ${selectedExperience.image ? '' : 'modal-body--text-only'}`}>
              {/* Left Side - Text Content */}
              <div className="modal-text">
                <h2 id="experience-dialog-title">{selectedExperience.title}</h2>
                <h3>{selectedExperience.company}</h3>
                {selectedExperience.description ? (
                  <p>{selectedExperience.description}</p>
                ) : (
                  <p>{selectedExperience.year}</p>
                )}
              </div>

              {/* Right Side - Image */}
              {selectedExperience.image && (
                <div className="modal-image">
                  <ExperiencePhoto
                    key={selectedExperience.id}
                    image={selectedExperience.image}
                    alt={selectedExperience.title}
                  />
                  {selectedExperience.image.caption && (
                    <p className="modal-image-caption">{selectedExperience.image.caption}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Shows one testimonial at a time. The active bar fills up over TESTIMONIAL_INTERVAL_MS;
 * when the fill finishes, the current testimonial fades out and the next one rises in
 * with the same fadeInUp animation the page uses on load. Because the fill animation
 * itself drives the rotation, hovering (or focusing) pauses the fill and the timer together,
 * and it resumes from the same point. Clicking a bar jumps straight to that testimonial.
 * All testimonials share one grid cell, so the block keeps the longest one's height.
 */
function TestimonialRotator() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  // The first testimonial arrives with the section's own fade-in, so the switch
  // animation only kicks in once the reader has seen a change.
  const [hasSwitched, setHasSwitched] = useState(false);

  const showTestimonial = (index: number) => {
    setHasSwitched(true);
    setActiveIndex(index);
  };
  const showNext = () => showTestimonial((activeIndex + 1) % testimonials.length);

  return (
    <div
      className={`testimonials ${isPaused ? 'is-paused' : ''}`}
      style={{ '--testimonial-duration': `${TESTIMONIAL_INTERVAL_MS}ms` } as React.CSSProperties}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      <div className="about-section-heading">
        <h2>Testimonials</h2>
        <div className="testimonial-indicator">
          {testimonials.map((testimonial, index) => (
            <button
              key={testimonial.source}
              type="button"
              className={`testimonial-bar ${index < activeIndex ? 'is-done' : ''} ${index === activeIndex ? 'is-active' : ''}`}
              aria-label={`Show testimonial ${index + 1}`}
              aria-pressed={index === activeIndex}
              onClick={() => showTestimonial(index)}
            >
              {index === activeIndex && (
                // Keyed by index so the fill restarts from empty each time a bar becomes active.
                <span
                  key={activeIndex}
                  className="testimonial-bar-fill"
                  data-testid="testimonial-progress"
                  onAnimationEnd={showNext}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className={`testimonial-rotator ${hasSwitched ? 'has-switched' : ''}`}>
        {testimonials.map((testimonial, index) => (
          <figure
            key={testimonial.source}
            className={`testimonial ${index === activeIndex ? 'is-active' : ''}`}
            aria-hidden={index !== activeIndex}
          >
            <blockquote>“{testimonial.quote}”</blockquote>
            <figcaption>— {testimonial.source}</figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}

function ExperiencePhoto({ image, alt }: { image: ExperienceImage; alt: string }) {
  const photo = useImageLoaded();

  return (
    <span
      className={`experience-image-frame skeleton ${photo.loaded ? 'is-loaded' : ''}`}
      style={{ '--ratio': image.width / image.height } as React.CSSProperties}
    >
      <img
        ref={photo.ref}
        src={experienceSrc(image)}
        srcSet={experienceSrcSet(image)}
        sizes={experienceSizes}
        width={image.width}
        height={image.height}
        alt={alt}
        decoding="async"
        onLoad={photo.onLoad}
      />
    </span>
  );
}

export default About;
