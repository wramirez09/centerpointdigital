import Image from 'next/image';
import { Stagger, StaggerItem } from '@/components/Reveal/Reveal';
import styles from './AgencyLogos.module.css';

// Agencies we've worked with; shown as light monochrome logos. `mono: false` keeps a logo's own colours.
const AGENCIES = [
  { name: 'Ogilvy',           src: '/images/brands/agencies/ogilvy.svg' },
  { name: 'Publicis Sapient', src: '/images/brands/agencies/ps-logo-correct-color.svg' },
  { name: 'Razorfish',        src: '/images/brands/agencies/rf.svg' },
  { name: 'Designory',        src: '/images/brands/agencies/designory-logo-trim.png' },
  { name: 'AbelsonTaylor',    src: '/images/brands/agencies/at.svg' },
  { name: 'Trisect',          src: '/images/brands/agencies/trisect.jpeg', mono: false },
];

/** Grid of agency logos; the page supplies its own heading. */
export default function AgencyLogos() {
  return (
    <Stagger className={styles.grid}>
      {AGENCIES.map(a => (
        <StaggerItem key={a.name} className={styles.cell}>
          <div className={styles.box}>
            <Image src={a.src} alt={a.name} fill sizes="200px"
              className={a.mono === false ? styles.color : styles.mono} style={{ objectFit: 'contain' }} />
          </div>
        </StaggerItem>
      ))}
    </Stagger>
  );
}
