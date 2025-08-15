import React, { useState } from 'react';
import './App.css';
import About from './About';
import Home from './Home';

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'about'>('home');

  // Handle page navigation
  const handleNavigateToAbout = () => {
    setCurrentPage('about');
  };

  const handleNavigateToHome = () => {
    setCurrentPage('home');
  };

  // Render About page if current page is about
  if (currentPage === 'about') {
    return <About onNavigateHome={handleNavigateToHome} />;
  }

  // Render Home page (default)
  return <Home onNavigateToAbout={handleNavigateToAbout} />;
}

export default App;
