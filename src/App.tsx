import React, { useEffect } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import About from './About';
import EasterEgg from './EasterEgg';
import Home from './Home';
import Projects from './Projects';

const projectImageUrls = [
  '/project assets/MinimalFinance.png',
  '/project assets/MOTI.png',
  '/project assets/Recipe Radar.png',
  '/project assets/Pixelize.png',
];

function App() {
  const navigate = useNavigate();

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
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/easteregg" element={<EasterEgg />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
