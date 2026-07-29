import React, { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import About from './About';
import Home from './Home';
import Projects from './Projects';

const projectImageUrls = [
  '/project assets/MOTI.png',
  '/project assets/Recipe Radar.png',
  '/project assets/Pixelize.png',
];

function App() {
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

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
