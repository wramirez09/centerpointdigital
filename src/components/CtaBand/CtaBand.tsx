import type { ReactNode } from 'react';
import styles from './CtaBand.module.css';

/** Closing "book a call" band on every subpage. Wrap the accent words of `title` in <em>. */
export default function CtaBand({ title, text }: { title: ReactNode; text: ReactNode }) {
  return (
    <div className={styles.section}>
      <div className={styles.inner}>
        <div>
          <h2 className={styles.h2}>{title}</h2>
          <p className={styles.p}>{text}</p>
        </div>
        <a href="/#consult" className={styles.btn}>Book a free call →</a>
      </div>
    </div>
  );
}
