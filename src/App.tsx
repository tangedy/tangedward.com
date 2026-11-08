import React, { Suspense, lazy, useEffect } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import Home from './Home';

// Secondary pages load as separate chunks so the home page ships less JavaScript.
const loadAbout = () => import('./About');
const loadProjects = () => import('./Projects');
const loadArt = () => import('./Art');
const loadEasterEgg = () => import('./EasterEgg');
const About = lazy(loadAbout);
const Projects = lazy(loadProjects);
const Art = lazy(loadArt);
const EasterEgg = lazy(loadEasterEgg);

const projectImageUrls = [
  '/project assets/MinimalFinance.webp',
  '/project assets/MOTI.webp',
  '/project assets/Recipe Radar.webp',
  '/project assets/Pixelize.webp',
];

function App() {
  const navigate = useNavigate();

  // Fetch the other pages' chunks once the browser is idle, so navigating never waits on the network.
  useEffect(() => {
    const prefetch = () => {
      loadAbout().catch(() => undefined);
      loadProjects().catch(() => undefined);
      loadArt().catch(() => undefined);
    };

    if (typeof window.requestIdleCallback === 'function') {
      const idleId = window.requestIdleCallback(prefetch);
      return () => window.cancelIdleCallback(idleId);
    }

    const timeoutId = window.setTimeout(prefetch, 1000);
    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    const images = projectImageUrls.map((url) => {
      const image = new Image();
      image.src = url;

      if (typeof image.decode === 'function') {
        image.decode().catch(() => undefined);
      }

      return image;
    });

    return () => {
      images.forEach((image) => {
        image.src = '';
      });
    };
  }, []);

  useEffect(() => {
    const phrases = ['easter egg', 'easteregg'];
    const longestPhraseLength = Math.max(...phrases.map((phrase) => phrase.length));
    let typedCharacters = '';

    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isEditing = target?.isContentEditable
        || target?.tagName === 'INPUT'
        || target?.tagName === 'TEXTAREA'
        || target?.tagName === 'SELECT';

      if (isEditing || event.ctrlKey || event.metaKey || event.altKey || event.key.length !== 1) {
        return;
      }

      typedCharacters = `${typedCharacters}${event.key.toLowerCase()}`.slice(-longestPhraseLength);
      if (phrases.some((phrase) => typedCharacters.endsWith(phrase))) {
        typedCharacters = '';
        navigate('/easteregg');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  return (
    <Suspense fallback={null}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/art" element={<Art />} />
        <Route path="/easteregg" element={<EasterEgg />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;
