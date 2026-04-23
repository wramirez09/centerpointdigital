'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './centerpointWork.module.css';
import { FEATURED_PROJECT, GRID_PROJECTS } from './projects';

/* ─── STATIC DATA ───────────────────────────────────────── */
const FILTERS = [
  { id: 'all',      label: 'All Work' },
  { id: 'web',      label: 'Web Design' },
  { id: 'mobile',   label: 'Mobile Apps' },
  { id: 'branding', label: 'Branding' },
  { id: 'seo',      label: 'SEO & Marketing' },
  { id: 'uiux',     label: 'UI/UX' },
  { id: 'social',   label: 'Social Media' },
];

const STATS = [
  { num: '120', suffix: '+',  lbl: 'projects shipped' },
  { num: '8',   suffix: 'yr', lbl: 'in business' },
  { num: '96',  suffix: '%',  lbl: 'client satisfaction' },
];

/* ─── SVG ───────────────────────────────────────────────── */
const LogoIcon = () => (
  <svg viewBox="0 0 12 12" width="12" height="12">
    <circle cx="6" cy="6" r="2.5" fill="currentColor"/>
    <circle cx="6" cy="6" r="5" fill="none" stroke="currentColor" strokeWidth="1.2"/>
  </svg>
);
const ArrowSmall = () => (
  <svg viewBox="0 0 12 12" width="12" height="12" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M2 6h8M7 3l3 3-3 3"/>
  </svg>
);

/* ─── COMPONENT ─────────────────────────────────────────── */
export default function CenterpointWorkPage() {
  const [activeFilter, setActiveFilter] = useState('all');

  const showFeatured = activeFilter === 'all' || activeFilter === FEATURED_PROJECT.category;
  const visibleProjects = activeFilter === 'all'
    ? GRID_PROJECTS
    : GRID_PROJECTS.filter(p => p.category === activeFilter);

  const F = FEATURED_PROJECT;

  return (
    <div className={styles.root}>

      {/* ── NAV ── */}
      <nav className={styles.nav}>
        <Link href="/" className={styles.navLogo}>
          <div className={styles.navMark}><LogoIcon /></div>
          CenterPoint<span style={{ color: 'var(--amber)' }}>.</span>
        </Link>
        <ul className={styles.navLinks}>
          <li><Link href="/">Home</Link></li>
          <li><a href="/#services">Services</a></li>
          <li><Link href="/work" className={styles.navLinkActive}>Work</Link></li>
          <li><a href="/#about">About</a></li>
        </ul>
        <a href="/#consult" className={styles.navCta}>Free Consultation</a>
      </nav>

      {/* ── PAGE HEADER ── */}
      <header className={styles.pageHeader}>
        <div className={styles.pageHeaderBg}>WK</div>
        <div className={styles.pageHeaderInner}>
          <div>
            <div className={styles.eyebrow}>Selected projects</div>
            <h1 className={styles.pageH1}>
              Work we're<br /><em>proud of.</em>
            </h1>
            <p className={styles.pageSub}>
              Every project starts with a real problem and ends with measurable
              results. Here's a selection of what we've shipped.
            </p>
          </div>
          <div className={styles.headerStats}>
            {STATS.map(s => (
              <div key={s.lbl}>
                <div className={styles.hstatNum}>{s.num}<span>{s.suffix}</span></div>
                <div className={styles.hstatLbl}>{s.lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* ── FILTER BAR ── */}
      <div className={styles.filterBar}>
        <div className={styles.filterInner}>
          {FILTERS.map(f => (
            <button
              key={f.id}
              className={`${styles.filterBtn} ${activeFilter === f.id ? styles.filterBtnActive : ''}`}
              onClick={() => setActiveFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── FEATURED ── */}
      {showFeatured && (
        <div className={styles.featured}>
          <div className={styles.featuredLabel}>Featured project</div>
          <Link href={`/work/${F.slug}`} className={styles.featuredCard}>
            <div className={styles.featuredImg} style={{ background: F.imgBg }}>
              <div className={styles.featuredStripe} />
              <div className={styles.featuredImgPlaceholder}>Full-site screenshot</div>
            </div>
            <div className={styles.featuredInfo}>
              <div>
                <div className={styles.fTag}>{F.tag}</div>
                <div className={styles.fTitle}>
                  {(F.featuredTitle ?? F.name).split('\n').map((line, i, arr) => (
                    <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
                  ))}
                </div>
                <p className={styles.fDesc}>{F.featuredDesc ?? F.desc}</p>
                <div className={styles.fMeta}>
                  {[['Client', F.client], ['Year', F.year], ['Timeline', F.timeline]].map(([lbl, val]) => (
                    <div key={lbl}>
                      <div className={styles.fMetaLabel}>{lbl}</div>
                      <div className={styles.fMetaVal}>{val}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className={styles.fResults}>
                {(F.featuredResults ?? F.results.slice(0, 3)).map(r => (
                  <div key={r.lbl} className={styles.fResultCell}>
                    <div className={styles.fResultNum}>{r.num}</div>
                    <div className={styles.fResultLbl}>{r.lbl}</div>
                  </div>
                ))}
              </div>
            </div>
          </Link>
        </div>
      )}

      {/* ── PROJECT GRID ── */}
      <div className={styles.gridSection}>
        <h2 className={styles.gridHeading}>
          {activeFilter === 'all' ? 'All projects' : FILTERS.find(f => f.id === activeFilter)?.label}
        </h2>

        {visibleProjects.length === 0 ? (
          <p style={{ color: 'var(--muted)', fontWeight: 300, fontSize: 15 }}>
            No projects in this category yet — check back soon.
          </p>
        ) : (
          <div
            className={styles.projectGrid}
            style={{
              gridTemplateColumns: visibleProjects.length <= 2 ? '1fr 1fr' : 'repeat(3,1fr)',
            }}
          >
            {visibleProjects.map(p => (
              <Link key={p.slug} href={`/work/${p.slug}`} className={styles.projectCard}>
                <div
                  className={`${styles.cardImg} ${p.tall ? styles.cardImgTall : ''}`}
                  style={{ background: p.imgBg }}
                >
                  <div className={styles.cardStripe} />
                  <div className={styles.cardPlaceholder}>{p.imgLabel}</div>
                  <div className={styles.cardHoverOverlay}>
                    <div className={styles.hoverTag}>{p.tag}</div>
                    <div className={styles.hoverName}>{p.hoverName}</div>
                  </div>
                </div>
                <div className={styles.cardInfo}>
                  <div>
                    <div className={styles.cardTag}>{p.tag}</div>
                    <div className={styles.cardName}>{p.name}</div>
                    <div className={styles.cardDesc}>{p.desc}</div>
                  </div>
                  <div className={styles.cardFooter}>
                    <span className={styles.cardYear}>{p.year}</span>
                    <div className={styles.cardArrow}><ArrowSmall /></div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* ── CTA ── */}
      <div className={styles.ctaSection}>
        <div className={styles.ctaInner}>
          <div>
            <h2 className={styles.ctaH2}>
              Ready to be our<br /><em>next project?</em>
            </h2>
            <p className={styles.ctaP}>
              Book a free 30-minute discovery call and let's talk about what
              you're building. No commitment, just a conversation.
            </p>
          </div>
          <Link href="/#consult" className={styles.btnAmber}>Book a free call →</Link>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer className={styles.footer}>
        <span>© {new Date().getFullYear()} CenterPoint Digital. All rights reserved.</span>
        <div className={styles.footerLinks}>
          <Link href="/">Home</Link>
          <Link href="/work">Work</Link>
          <a href="#">Privacy</a>
          <a href="/#consult">Contact</a>
        </div>
      </footer>

    </div>
  );
}
