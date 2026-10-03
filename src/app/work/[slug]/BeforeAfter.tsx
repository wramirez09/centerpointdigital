'use client';

import Image from 'next/image';
import type { Comparison } from '../projects';
import Lightbox, { useLightbox, type LightboxItem } from './Lightbox';
import styles from './centerpointProject.module.css';

/**
 * Side-by-side full-page captures. Each card shows the top of the page; a
 * click opens the whole capture in the scrolling lightbox, and ←/→ walk
 * every before/after in order.
 */
export default function BeforeAfter({ comparisons }: { comparisons: Comparison[] }) {
  const items: LightboxItem[] = comparisons.flatMap((c) => [
    { src: c.before.src, label: `Before · ${c.label}`, fullPage: c.before },
    { src: c.after.src, label: `After · ${c.label}`, fullPage: c.after },
  ]);
  const lb = useLightbox(items);

  return (
    <>
      <div className={styles.compareList}>
        {comparisons.map((c, i) => (
          <div key={c.label}>
            <div className={styles.compareTitle}>{c.label}</div>
            <div className={styles.compareRow}>
              {([['Before', c.before, c.beforeNote, 2 * i], ['After', c.after, c.afterNote, 2 * i + 1]] as const).map(
                ([kind, img, note, idx]) => (
                  <figure key={kind} className={styles.compareFigure}>
                    <button type="button" className={styles.compareImg} onClick={() => lb.open(idx)}
                      aria-label={`View full page: ${kind.toLowerCase()}, ${c.label}`}>
                      <Image src={img.src} alt={`${kind}: ${c.label}`} fill sizes="(max-width: 960px) 100vw, 50vw"
                        style={{ objectFit: 'cover', objectPosition: 'top center' }} />
                      <span className={`${styles.compareBadge} ${kind === 'After' ? styles.compareBadgeAfter : ''}`}>{kind}</span>
                    </button>
                    {note && <figcaption className={styles.compareNote}>{note}</figcaption>}
                  </figure>
                ),
              )}
            </div>
          </div>
        ))}
      </div>
      <Lightbox items={items} index={lb.index} onClose={lb.close} onStep={lb.step} />
    </>
  );
}
