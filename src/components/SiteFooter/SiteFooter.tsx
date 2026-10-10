import Link from 'next/link';
import styles from './SiteFooter.module.css';

/** Slim footer for subpages (the home page has its own full footer). */
export default function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <span>© {new Date().getFullYear()} CenterPoint Digital. All rights reserved.</span>
      <div className={styles.links}>
        <Link href="/">Home</Link>
        <Link href="/work">Work</Link>
        <Link href="/about">About</Link>
        <a href="/#consult">Contact</a>
      </div>
    </footer>
  );
}
