import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { NavLink, useLocation } from 'react-router-dom';
import { useIsMobile } from './hooks/useIsMobile';
import { useStaggeredFadeIn } from './hooks/useStaggeredFadeIn';
import { externalLinkProps, siteLinks } from './siteLinks';

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
  const isMobile = useIsMobile();

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
          {isMobile ? (
            <MobileMenu />
          ) : (
            <nav className="nav-links">
              {navItems.map(({ to, label, end }) => (
                <NavLink key={to} to={to} end={end} className="nav-button">{label}</NavLink>
              ))}
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}

/**
 * Phones get a single "Menu" button instead of four squeezed links. It opens a full-screen
 * index of the pages in the home page's large type, with the contact links underneath.
 */
function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();

  // Navigating (including tapping the current page) closes the menu.
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const { body } = document;
    const previousOverflow = body.style.overflow;
    body.style.overflow = 'hidden';
    panelRef.current?.querySelector<HTMLElement>('a')?.focus({ preventScroll: true });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        toggleRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <>
      <button
        ref={toggleRef}
        type="button"
        className="menu-toggle"
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
        onClick={() => setIsOpen((open) => !open)}
      >
        {isOpen ? 'Close' : 'Menu'}
      </button>

      {createPortal(
      <div
        ref={panelRef}
        id="mobile-menu"
        className={`mobile-menu ${isOpen ? 'is-open' : ''}`}
        hidden={!isOpen}
      >
        {/* Sits under the fixed header, so the page title and the Close button stay in place. */}
        <nav className="mobile-menu-nav" aria-label="Pages">
          {navItems.map(({ to, label, end }, index) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className="mobile-menu-link"
              style={{ '--i': index } as React.CSSProperties}
              onClick={() => setIsOpen(false)}
            >
              <span className="mobile-menu-index">({String(index + 1).padStart(2, '0')})</span>
              <span className="mobile-menu-label">{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mobile-menu-footer" style={{ '--i': navItems.length } as React.CSSProperties}>
          <span className="mobile-menu-heading">My links</span>
          {siteLinks.map((link) => (
            <a key={link.href} href={link.href} {...externalLinkProps(link)}>
              {`${link.label} ↗︎`}
            </a>
          ))}
        </div>
      </div>,
      document.body,
      )}
    </>
  );
}

export default SiteHeader;
