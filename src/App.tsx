import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import About from './About';
import Home from './Home';
import Projects from './Projects';
import Contact from './Contact';


function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
