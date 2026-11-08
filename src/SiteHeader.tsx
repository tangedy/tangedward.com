import React from 'react';
import { NavLink } from 'react-router-dom';
import { useStaggeredFadeIn } from './hooks/useStaggeredFadeIn';

interface SiteHeaderProps {
  title: string;
  /** Fade the title and nav in on load (used on the home page). */
  animate?: boolean;
}

const navItems = [
  { to: '/', label: 'Home', end: true },
  { to: '/about', label: 'About' },
  { to: '/projects', label: 'Projects' },
  { to: '/art', label: 'Art' },
];

function SiteHeader({ title, animate = false }: SiteHeaderProps) {
  const left = useStaggeredFadeIn<HTMLDivElement>(0, { delay: 200 });
  const right = useStaggeredFadeIn<HTMLDivElement>(1, { delay: 200 });

  const fadeClass = (isVisible: boolean) => (
    animate ? ` fade-in-element ${isVisible ? 'visible' : ''}` : ''
  );

  return (
    <header className="header">
      <div className="header-content">
        <div ref={left.ref} className={`header-left${fadeClass(left.isVisible)}`}>
          <h2 className="welcome-text">{title}</h2>
        </div>

        <div ref={right.ref} className={`header-right${fadeClass(right.isVisible)}`}>
          <nav className="nav-links">
            {navItems.map(({ to, label, end }) => (
              <NavLink key={to} to={to} end={end} className="nav-button">{label}</NavLink>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}

export default SiteHeader;
