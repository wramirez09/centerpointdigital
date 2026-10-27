'use client';

import Image from 'next/image';
import { Reveal } from '@/components/Reveal/Reveal';
import Lightbox, { useLightbox, type LightboxItem } from './[slug]/Lightbox';
import { AGENCY_WORK, BEHANCE_PROFILE } from './agencyWork';
import styles from './centerpointWork.module.css';

const ITEMS: LightboxItem[] = AGENCY_WORK.map((w) => ({ src: w.src, label: `${w.name} · ${w.year}` }));

/** Masonry wall of earlier agency work; each tile opens in the lightbox. */
export default function AgencyWork() {
  const { index, open, close, step } = useLightbox(ITEMS);

  return (
    <section className={styles.agencySection} aria-labelledby="agency-heading">
      <Reveal as="h2" id="agency-heading" className={styles.gridHeading}>
        Previous agency work
      </Reveal>

      <div className={styles.agencyMasonry}>
        {AGENCY_WORK.map((w, i) => (
          <button key={w.slug} type="button" className={styles.agencyTile} onClick={() => open(i)}
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

      <Lightbox items={ITEMS} index={index} onClose={close} onStep={step} />
    </section>
  );
}
