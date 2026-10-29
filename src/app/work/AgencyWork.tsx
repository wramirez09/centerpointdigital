'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Reveal } from '@/components/Reveal/Reveal';
import Lightbox, { useLightbox, type LightboxItem } from './[slug]/Lightbox';
import { AGENCY_WORK, BEHANCE_PROFILE, type AgencyWork as Work } from './agencyWork';
import styles from './centerpointWork.module.css';

/** Cover first, then the project's own images. */
const itemsFor = (w: Work): LightboxItem[] => [
  { src: w.src, label: `${w.name} · ${w.year}` },
  ...(w.gallery ?? []).map((g) => ({ src: g.src, label: `${w.name} · ${w.year}` })),
];

/** Masonry wall of earlier agency work; each tile opens that project's images in the lightbox. */
export default function AgencyWork() {
  const [items, setItems] = useState<LightboxItem[]>([]);
  const { index, open, close, step } = useLightbox(items);

  return (
    <section className={styles.agencySection} aria-labelledby="agency-heading">
      <Reveal as="h2" id="agency-heading" className={styles.gridHeading}>
        Previous agency work
      </Reveal>

      <div className={styles.agencyMasonry}>
        {AGENCY_WORK.map((w) => (
          <button key={w.slug} type="button" className={styles.agencyTile}
            onClick={() => { setItems(itemsFor(w)); open(0); }}
            aria-label={`View ${w.name} (${w.year})`}>
            <Image src={w.src} alt={w.name} width={w.width} height={w.height}
              sizes="(max-width: 640px) 100vw, (max-width: 960px) 50vw, 33vw"
              style={{ width: '100%', height: 'auto', display: 'block' }} />
            <span className={styles.agencyOverlay}>
              <span className={styles.hoverName}>{w.name}</span>
              <span className={styles.agencyYear}>{w.year}</span>
            </span>
          </button>
        ))}
      </div>

      <a href={BEHANCE_PROFILE} target="_blank" rel="noopener noreferrer" className={styles.agencyMore}>
        More on Behance ↗
      </a>

      <Lightbox items={items} index={index} onClose={close} onStep={step} />
    </section>
  );
}
