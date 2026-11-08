import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import './Art.css';
import './Modal.css';
import SiteHeader from './SiteHeader';
import { Artwork, GalleryUnit, artImage, artstationUrl, artworks, galleryRows } from './artworks';
import { useStaggeredFadeIn } from './hooks/useStaggeredFadeIn';
import { usePageMetadata } from './hooks/usePageMetadata';

const bySlug = new Map(artworks.map((artwork) => [artwork.slug, artwork]));
const getArtwork = (slug: string) => bySlug.get(slug) as Artwork;
const ratioOf = (artwork: Artwork) => artwork.width / artwork.height;

// Reading order of the gallery (row by row, top to bottom within a stack) drives prev/next.
const orderedArtworks = galleryRows.flat(2).map(getArtwork);

// A stacked pair fills one column: its combined shape is narrower than either piece alone.
const unitRatio = (unit: GalleryUnit) => (
  Array.isArray(unit)
    ? 1 / unit.reduce((sum, slug) => sum + 1 / ratioOf(getArtwork(slug)), 0)
    : ratioOf(getArtwork(unit))
);

function Art() {
  usePageMetadata(
    'Art | Edward Tang',
    'Selected drawings, paintings, and digital illustrations by Edward Tang.',
    '/art'
  );

  // The open piece lives in the URL (?piece=symphony) so a single artwork can be shared.
  const [searchParams, setSearchParams] = useSearchParams();
  const openArtwork = artworks.find((artwork) => artwork.slug === searchParams.get('piece')) ?? null;

  const [isClosing, setIsClosing] = useState(false);
  const triggerRef = useRef<HTMLElement | null>(null);
  const closeTimerRef = useRef<number | null>(null);

  const gallery = useStaggeredFadeIn<HTMLDivElement>(2, { delay: 200 });

  const openPiece = (artwork: Artwork) => {
    triggerRef.current = document.activeElement as HTMLElement;
    setIsClosing(false);
    setSearchParams({ piece: artwork.slug }, { replace: true });
  };

  // Same close sequence as the About experience modal: play the exit animation, then unmount.
  const closePiece = useCallback(() => {
    if (isClosing) return;

    setIsClosing(true);
    closeTimerRef.current = window.setTimeout(() => {
      setSearchParams({}, { replace: true });
      setIsClosing(false);
      triggerRef.current?.focus();
    }, 300);
  }, [isClosing, setSearchParams]);

  const stepPiece = useCallback((direction: 1 | -1) => {
    if (!openArtwork) return;
    const index = orderedArtworks.indexOf(openArtwork);
    const next = orderedArtworks[(index + direction + orderedArtworks.length) % orderedArtworks.length];
    setSearchParams({ piece: next.slug }, { replace: true });
  }, [openArtwork, setSearchParams]);

  useEffect(() => () => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
    }
  }, []);

  return (
    <div className="app art-page">
      <SiteHeader title="Art" />

      <main className="main-content">
        <div
          ref={gallery.ref}
          className={`art-gallery fade-in-element ${gallery.isVisible ? 'visible' : ''}`}
        >
          {galleryRows.map((row, rowIndex) => (
            <div className="art-row" key={rowIndex}>
              {row.map((unit) => {
                const style = { '--ratio': unitRatio(unit) } as React.CSSProperties;
                const eager = rowIndex < 2;

                return Array.isArray(unit) ? (
                  <div className="art-stack" key={unit.join('+')} style={style}>
                    {unit.map((slug) => (
                      <ArtTile
                        key={slug}
                        artwork={getArtwork(slug)}
                        eager={eager}
                        onOpen={openPiece}
                      />
                    ))}
                  </div>
                ) : (
                  <ArtTile
                    key={unit}
                    artwork={getArtwork(unit)}
                    eager={eager}
                    onOpen={openPiece}
                    style={style}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </main>

      {openArtwork && (
        <ArtModal
          artwork={openArtwork}
          isClosing={isClosing}
          onClose={closePiece}
          onStep={stepPiece}
        />
      )}
    </div>
  );
}

interface ArtTileProps {
  artwork: Artwork;
  eager: boolean;
  onOpen: (artwork: Artwork) => void;
  style?: React.CSSProperties;
}

function ArtTile({ artwork, eager, onOpen, style }: ArtTileProps) {
  return (
    <button
      type="button"
      className="art-tile"
      style={{ ...style, '--inverse-ratio': 1 / ratioOf(artwork) } as React.CSSProperties}
      onClick={() => onOpen(artwork)}
      aria-label={`${artwork.title}, ${artwork.year}`}
    >
      <img
        src={artImage(artwork, 800)}
        srcSet={`${artImage(artwork, 800)} 800w, ${artImage(artwork, 1600)} 1600w`}
        sizes="(max-width: 820px) 60vw, 45vw"
        width={artwork.width}
        height={artwork.height}
        alt=""
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
      />
    </button>
  );
}

interface ArtModalProps {
  artwork: Artwork;
  isClosing: boolean;
  onClose: () => void;
  onStep: (direction: 1 | -1) => void;
}

function ArtModal({ artwork, isClosing, onClose, onStep }: ArtModalProps) {
  const modalContentRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeButtonRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        onStep(1);
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        onStep(-1);
      } else if (event.key === 'Tab' && modalContentRef.current) {
        const focusable = Array.from(
          modalContentRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onStep]);

  return (
    <div className={`modal-overlay ${isClosing ? 'closing' : ''}`} onClick={onClose}>
      <div
        ref={modalContentRef}
        className={`modal-content art-modal ${isClosing ? 'closing' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="art-dialog-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          ref={closeButtonRef}
          type="button"
          className="modal-close"
          onClick={onClose}
          aria-label="Close artwork"
        >×</button>

        <div className="modal-body">
          <div className="modal-text">
            <h2 id="art-dialog-title">{artwork.title}</h2>
            <h3>{artwork.year}</h3>
            <a
              className="art-modal-link"
              href={artstationUrl(artwork)}
              target="_blank"
              rel="noopener noreferrer"
            >
              View on ArtStation ↗︎
            </a>
          </div>

          <div className="modal-image">
            <img
              key={artwork.slug}
              src={artImage(artwork, 1600)}
              width={artwork.width}
              height={artwork.height}
              alt={artwork.title}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Art;
