import Link from 'next/link';
import MobileMenu, { type Current } from '@/components/MobileMenu/MobileMenu';
import LogoIcon from './LogoIcon';
import styles from './SiteNav.module.css';

// Hash links stay plain <a> so a click on the home page just scrolls to the section.
const LINKS: { label: string; href: string; hash?: boolean; activeFor: Current[] }[] = [
  { label: 'Home', href: '/', activeFor: ['home'] },
  { label: 'Services', href: '/#services', hash: true, activeFor: ['service'] },
  { label: 'Work', href: '/work', activeFor: ['work', 'project'] },
  { label: 'About', href: '/about', activeFor: ['about'] },
];

/** Sticky top bar shared by every page; links collapse into MobileMenu at ≤960px. */
export default function SiteNav({ current, slug }: { current: Current; slug?: string }) {
  return (
    <nav className={styles.nav}>
      <Link href="/" className={styles.logo}>
        <div className={styles.mark}><LogoIcon /></div>
        CenterPoint<span style={{ color: 'var(--amber)' }}>.</span>
      </Link>
      <ul className={styles.links}>
        {LINKS.map(({ label, href, hash, activeFor }) => {
          const className = activeFor.includes(current) ? styles.active : undefined;
          return (
            <li key={href}>
              {hash
                ? <a href={href} className={className}>{label}</a>
                : <Link href={href} className={className}>{label}</Link>}
            </li>
          );
        })}
      </ul>
      <a href="/#consult" className={styles.cta}>Free Consultation</a>
      <MobileMenu current={current} slug={slug} />
    </nav>
  );
}
