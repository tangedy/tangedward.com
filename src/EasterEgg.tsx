import React from 'react';
import { Link } from 'react-router-dom';
import './EasterEgg.css';
import { usePageMetadata } from './hooks/usePageMetadata';

const EasterEgg: React.FC = () => {
  usePageMetadata(
    'A Secret Has Hatched | Edward Tang',
    'A hidden corner of Edward Tang\'s portfolio.',
    '/easteregg'
  );

  return (
    <main className="easter-egg-page">
      <Link className="easter-back-link" to="/">Back home</Link>

      <section className="easter-egg-content" aria-labelledby="easter-egg-title">
        <h1 id="easter-egg-title">A crow has hatched!</h1>

        <div className="crow-stage" role="img" aria-label="An 8-bit crow dancing">
          <span className="music-note note-one" aria-hidden="true">♪</span>
          <span className="music-note note-two" aria-hidden="true">♫</span>
          <span className="crow-shadow" aria-hidden="true" />

          <div className="pixel-crow" aria-hidden="true">
            <span className="crow-head"><span className="crow-eye" /></span>
            <span className="crow-beak" />
            <span className="crow-body" />
            <span className="crow-wing" />
            <span className="crow-tail tail-one" />
            <span className="crow-tail tail-two" />
            <span className="crow-leg leg-left"><span className="crow-foot" /></span>
            <span className="crow-leg leg-right"><span className="crow-foot" /></span>
          </div>
        </div>
      </section>
    </main>
  );
};

export default EasterEgg;