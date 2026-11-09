import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import './Art.css';
import './Modal.css';
import './Skeleton.css';
import SiteHeader from './SiteHeader';
import { Artwork, GalleryUnit, artImage, artstationUrl, artworks, galleryRows } from './artworks';
import { useImageLoaded } from './hooks/useImageLoaded';
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
          {galleryRows.map((row, rowIndex) => {
            const rowRatio = row.reduce((sum, unit) => sum + unitRatio(unit), 0);

            return (
            <div className="art-row" key={rowIndex}>
              {row.map((unit) => {
                const style = { '--ratio': unitRatio(unit) } as React.CSSProperties;
                const priority: TilePriority = rowIndex === 0 ? 'high' : rowIndex === 1 ? 'eager' : 'lazy';
                const widthShare = unitRatio(unit) / rowRatio;

                return Array.isArray(unit) ? (
                  <div className="art-stack" key={unit.join('+')} style={style}>
                    {unit.map((slug) => (
                      <ArtTile
                        key={slug}
                        artwork={getArtwork(slug)}
                        priority={priority}
                        widthShare={widthShare}
                        onOpen={openPiece}
                      />
                    ))}
                  </div>
                ) : (
                  <ArtTile
                    key={unit}
                    artwork={getArtwork(unit)}
                    priority={priority}
                    widthShare={widthShare}
                    onOpen={openPiece}
                    style={style}
                  />
                );
              })}
            </div>
            );
          })}
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

type TilePriority = 'high' | 'eager' | 'lazy';

const gridWidths = [400, 800, 1200, 1600] as const;
const gridSrcSet = (artwork: Artwork) => gridWidths
  .map((width) => `${artImage(artwork, width)} ${width}w`)
  .join(', ');

/**
 * Tells the browser how wide a tile really renders (its share of the row), so a small
 * tile on a 2x screen fetches the 400px or 800px file instead of the 1600px original.
 * Above 1144px the gallery stops growing at its 1080px max width.
 */
const tileSizes = (widthShare: number) => {
  const percent = Math.ceil(widthShare * 100);
  return `(min-width: 1144px) ${Math.ceil(widthShare * 1080)}px, ${percent}vw`;
};

interface ArtTileProps {
  artwork: Artwork;
  priority: TilePriority;
  widthShare: number;
  onOpen: (artwork: Artwork) => void;
  style?: React.CSSProperties;
}

function ArtTile({ artwork, priority, widthShare, onOpen, style }: ArtTileProps) {
  const image = useImageLoaded();

  return (
    <button
      type="button"
      className={`art-tile skeleton ${image.loaded ? 'is-loaded' : ''}`}
      style={{ ...style, '--inverse-ratio': 1 / ratioOf(artwork) } as React.CSSProperties}
      onClick={() => onOpen(artwork)}
      aria-label={`${artwork.title}, ${artwork.year}`}
    >
      <img
        ref={image.ref}
        src={artImage(artwork, 800)}
        srcSet={gridSrcSet(artwork)}
        sizes={tileSizes(widthShare)}
        width={artwork.width}
        height={artwork.height}
        alt=""
        loading={priority === 'lazy' ? 'lazy' : 'eager'}
        fetchPriority={priority === 'high' ? 'high' : 'auto'}
        decoding="async"
        onLoad={image.onLoad}
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
            <ArtModalImage key={artwork.slug} artwork={artwork} />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Shows the grid-sized image straight away (it is almost always cached already), then
 * fades the full-size image in over it once it arrives. A shimmer covers the rare case
 * where neither is ready yet, such as opening a shared link.
 */
function ArtModalImage({ artwork }: { artwork: Artwork }) {
  const preview = useImageLoaded();
  const full = useImageLoaded();

  return (
    <span
      className={`art-modal-frame skeleton ${preview.loaded || full.loaded ? 'is-loaded' : ''} ${full.loaded ? 'is-sharp' : ''}`}
    >
      <img
        ref={preview.ref}
        className="art-modal-preview"
        src={artImage(artwork, 800)}
        width={artwork.width}
        height={artwork.height}
        alt=""
        onLoad={preview.onLoad}
      />
      <img
        ref={full.ref}
        className="art-modal-full"
        src={artImage(artwork, 1600)}
        width={artwork.width}
        height={artwork.height}
        alt={artwork.title}
        onLoad={full.onLoad}
      />
    </span>
  );
}

export default Art;
