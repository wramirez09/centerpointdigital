'use client';

import Image from 'next/image';
import type { Highlight } from '../projects';
import Lightbox, { useLightbox, type LightboxItem } from './Lightbox';
import styles from './centerpointProject.module.css';

/**
 * Callout blocks for the parts of a project worth singling out (e.g. a public
 * API or MCP server): copy on one side, a screen on the other, alternating.
 * A screen opens its full page in the lightbox when one is given.
 */
export default function Highlights({ highlights }: { highlights: Highlight[] }) {
  const items: LightboxItem[] = highlights.map((h) =>
    h.image.fullPage
      ? { src: h.image.fullPage.src, label: `${h.image.label} — full page`, fullPage: h.image.fullPage }
      : { src: h.image.src, label: h.image.label },
  );
  const lb = useLightbox(items);

  return (
    <>
      <div className={styles.highlightList}>
        {highlights.map((h, i) => (
          <article key={h.heading} className={`${styles.highlight} ${i % 2 ? styles.highlightFlip : ''}`}>
            <div className={styles.highlightCopy}>
              <div className={styles.highlightEyebrow}>{h.eyebrow}</div>
              <h3 className={styles.highlightHeading}>{h.heading}</h3>
              <p className={styles.highlightBody}>{h.body}</p>
              <ul className={styles.highlightPoints}>
                {h.points.map((p) => <li key={p}>{p}</li>)}
              </ul>
              {h.tags && (
                <div className={styles.metaTags}>
                  {h.tags.map((t) => <span key={t} className={styles.metaTag}>{t}</span>)}
                </div>
              )}
            </div>
            <button type="button" className={styles.highlightImg} onClick={() => lb.open(i)}
              style={h.image.width && h.image.height ? { aspectRatio: `${h.image.width} / ${h.image.height}` } : undefined}
              aria-label={`View ${h.image.fullPage ? 'full page' : 'larger'}: ${h.image.label}`}>
              <Image src={h.image.src} alt={h.image.label} fill sizes="(max-width: 960px) 100vw, 55vw"
                style={{ objectFit: 'cover', objectPosition: 'top center' }} />
            </button>
          </article>
        ))}
      </div>
      <Lightbox items={items} index={lb.index} onClose={lb.close} onStep={lb.step} />
    </>
  );
}
