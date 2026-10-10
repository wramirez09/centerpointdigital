'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import styles from './centerpointProject.module.css';

export interface LightboxItem {
  src: string
  label: string
  /** Set for a full-page capture: shown at full width and scrolled, not shrunk to fit. */
  fullPage?: { width: number; height: number }
}

/** Open/close/step state for a lightbox over `items`. */
export function useLightbox(items: LightboxItem[]) {
  const [index, setIndex] = useState<number | null>(null);
  const close = useCallback(() => setIndex(null), []);
  const step = useCallback(
    (d: number) => setIndex((i) => (i === null ? i : (i + d + items.length) % items.length)),
    [items.length],
  );
  return { index, open: setIndex, close, step };
}

export default function Lightbox({ items, index, onClose, onStep }: {
  items: LightboxItem[];
  index: number | null;
  onClose: () => void;
  onStep: (d: number) => void;
}) {
  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') onStep(1);
      else if (e.key === 'ArrowLeft') onStep(-1);
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [index, onClose, onStep]);

  const current = index === null ? null : items[index];
  if (!current) return null;

  return (
    <div className={styles.lightbox} role="dialog" aria-modal="true" aria-label={current.label} onClick={onClose}>
      <button type="button" className={styles.lightboxClose} onClick={onClose} aria-label="Close" autoFocus>×</button>
      {items.length > 1 && (
        <>
          <button type="button" className={`${styles.lightboxNav} ${styles.lightboxPrev}`}
            onClick={(e) => { e.stopPropagation(); onStep(-1); }} aria-label="Previous image">‹</button>
          <button type="button" className={`${styles.lightboxNav} ${styles.lightboxNext}`}
            onClick={(e) => { e.stopPropagation(); onStep(1); }} aria-label="Next image">›</button>
        </>
      )}
      <figure className={styles.lightboxFigure} onClick={(e) => e.stopPropagation()}>
        {current.fullPage
          ? (
            // Keyed so each page opens scrolled to its top.
            <div key={current.src} className={styles.lightboxScroll} tabIndex={0}>
              <Image src={current.src} alt={current.label} width={current.fullPage.width} height={current.fullPage.height}
                sizes="(max-width: 1280px) 100vw, 1280px" style={{ width: '100%', height: 'auto', display: 'block' }} priority />
            </div>
          )
          : (
            <div className={styles.lightboxImg}>
              <Image src={current.src} alt={current.label} fill sizes="100vw" style={{ objectFit: 'contain' }} priority />
            </div>
          )}
        <figcaption className={styles.lightboxCaption}>
          {current.label}
          {items.length > 1 && <span>{index! + 1} / {items.length}</span>}
        </figcaption>
      </figure>
    </div>
  );
}
