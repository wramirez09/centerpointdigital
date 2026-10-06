'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import PROJECTS from '@/app/work/projects';
import SERVICES from '@/app/services/services';
import styles from './MobileMenu.module.css';

export type Current = 'home' | 'work' | 'about' | 'project' | 'service';

const PAGES: { key: Current; label: string; href: string }[] = [
  { key: 'home', label: 'Home', href: '/' },
  { key: 'work', label: 'Work', href: '/work' },
  { key: 'about', label: 'About', href: '/about' },
];

// Plain <a> so a click on the home page just scrolls to the section.
const SECTIONS = [
  { label: 'Services', href: '/#services' },
  { label: 'Selected work', href: '/#work' },
  { label: 'About us', href: '/#about' },
  { label: 'Free consultation', href: '/#consult' },
];

/**
 * Hamburger + slide-out menu for ≤960px, where every page hides its nav links.
 * The panel is portalled to <body>: the nav bar's backdrop-filter would
 * otherwise make it the containing block for this fixed-position panel.
 */
export default function MobileMenu({ current, slug }: { current: Current; slug?: string }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  useEffect(() => setMounted(true), []);

  const close = useCallback(() => {
    setOpen(false);
    toggleRef.current?.focus();
  }, []);

  // Close when the route changes (e.g. tapping a project link).
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, close]);

  const panel = (
    <div className={`${styles.layer} ${open ? styles.layerOpen : ''}`} aria-hidden={!open}>
      <div className={styles.backdrop} onClick={close} />
      <nav id="mobile-menu" className={styles.panel} aria-label="Site" role="dialog" aria-modal="true">
        <div className={styles.panelHead}>
          <span className={styles.panelTitle}>Menu</span>
          <button ref={closeRef} type="button" className={styles.close} onClick={close} aria-label="Close menu"
            tabIndex={open ? 0 : -1}>
            <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
              <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className={styles.body}>
          <ul className={styles.pages}>
            {PAGES.map((p) => (
              <li key={p.key}>
                <Link href={p.href} tabIndex={open ? 0 : -1} onClick={() => setOpen(false)}
                  className={`${styles.pageLink} ${current === p.key || (p.key === 'work' && current === 'project') ? styles.active : ''}`}
                  aria-current={current === p.key ? 'page' : undefined}>
                  {p.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className={styles.groupLabel}>On the home page</div>
          <ul className={styles.list}>
            {SECTIONS.map((s) => (
              <li key={s.href}>
                <a href={s.href} tabIndex={open ? 0 : -1} onClick={() => setOpen(false)} className={styles.subLink}>
                  {s.label}
                </a>
              </li>
            ))}
          </ul>

          <div className={styles.groupLabel}>Services</div>
          <ul className={styles.list}>
            {SERVICES.map((s) => {
              const active = current === 'service' && slug === s.slug;
              return (
                <li key={s.slug}>
                  <Link href={`/services/${s.slug}`} tabIndex={open ? 0 : -1} onClick={() => setOpen(false)}
                    className={`${styles.subLink} ${active ? styles.active : ''}`}
                    aria-current={active ? 'page' : undefined}>
                    <span>{s.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className={styles.groupLabel}>Work</div>
          <ul className={styles.list}>
            {PROJECTS.map((p) => (
              <li key={p.slug}>
                <Link href={`/work/${p.slug}`} tabIndex={open ? 0 : -1} onClick={() => setOpen(false)}
                  className={`${styles.subLink} ${current === 'project' && slug === p.slug ? styles.active : ''}`}
                  aria-current={current === 'project' && slug === p.slug ? 'page' : undefined}>
                  <span>{p.name}</span>
                  <span className={styles.subTag}>{p.tag}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <a href="/#consult" tabIndex={open ? 0 : -1} onClick={() => setOpen(false)} className={styles.cta}>
          Free consultation
        </a>
      </nav>
    </div>
  );

  return (
    <>
      <button ref={toggleRef} type="button" className={styles.toggle} onClick={() => setOpen(true)}
        aria-label="Open menu" aria-expanded={open} aria-controls="mobile-menu">
        <span /><span /><span />
      </button>
      {mounted && createPortal(panel, document.body)}
    </>
  );
}
