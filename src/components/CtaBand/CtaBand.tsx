import type { ReactNode } from 'react';
import styles from './CtaBand.module.css';
import { Reveal } from '@/components/Reveal/Reveal';

/** Closing "book a call" band on every subpage. Wrap the accent words of `title` in <em>. */
export default function CtaBand({ title, text, buttonLabel = 'Book a free call →' }: {
  title: ReactNode; text: ReactNode; buttonLabel?: string;
}) {
  return (
    <div className={styles.section}>
      <Reveal className={styles.inner}>
        <div>
          <h2 className={styles.h2}>{title}</h2>
          <p className={styles.p}>{text}</p>
        </div>
        <a href="/#consult" className={styles.btn}>{buttonLabel}</a>
      </Reveal>
    </div>
  );
}
