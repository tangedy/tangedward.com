import React, { useState } from 'react';
import './App.css';
import About from './About';
import Home from './Home';
import Projects from './Projects';
import Contact from './Contact';


function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'about' | 'projects' | 'contact'>('home');

  // Handle page navigation
  const handleNavigateToAbout = () => {
    setCurrentPage('about');
  };

  const handleNavigateToHome = () => {
    setCurrentPage('home');
  };

  const handleNavigateToProjects = () => {
    setCurrentPage('projects');
  };

  const handleNavigateToContact = () => {
    setCurrentPage('contact');
  };

  // Render About page if current page is about
  if (currentPage === 'about') {
    return <About onNavigateHome={handleNavigateToHome} onNavigateToProjects={handleNavigateToProjects} />;
  }

  // Render Projects page if current page is projects
  if (currentPage === 'projects') {
    return <Projects onNavigateHome={handleNavigateToHome} onNavigateToAbout={handleNavigateToAbout} />;
  }

  // Render Contact page if current page is contact
  if (currentPage === 'contact') {
    return <Contact onNavigateHome={handleNavigateToHome} onNavigateToAbout={handleNavigateToAbout} onNavigateToProjects={handleNavigateToProjects} />;
  }

  // Render Home page (default)
  return <Home onNavigateToAbout={handleNavigateToAbout} onNavigateToProjects={handleNavigateToProjects} onNavigateToContact={handleNavigateToContact} />;
}

export default App;
