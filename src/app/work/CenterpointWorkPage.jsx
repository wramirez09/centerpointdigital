'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './centerpointWork.module.css';

/* ─── DATA ─────────────────────────────────────────────── */
const FILTERS = [
  { id: 'all',     label: 'All Work' },
  { id: 'web',     label: 'Web Design' },
  { id: 'mobile',  label: 'Mobile Apps' },
  { id: 'branding',label: 'Branding' },
  { id: 'seo',     label: 'SEO & Marketing' },
  { id: 'uiux',    label: 'UI/UX' },
  { id: 'social',  label: 'Social Media' },
];

const FEATURED = {
  category: 'web',
  tag: 'Web Design & Development',
  title: 'Flowbase — Complete\nDigital Overhaul',
  desc: 'A SaaS startup needed to go from a dated WordPress site to a performance-focused Next.js platform. We redesigned every page, rebuilt the CMS, and cut load times by 68%.',
  client: 'Flowbase Inc.',
  year: '2024',
  timeline: '6 weeks',
  imgBg: '#131009',
  results: [
    { num: '68%', lbl: 'faster load time' },
    { num: '3.2×', lbl: 'conversion lift' },
    { num: '41%', lbl: 'bounce rate drop' },
  ],
};

const PROJECTS = [
  {
    id: 1, category: 'web', tag: 'Web Design', name: 'Stackr Landing Page', year: '2024',
    desc: 'High-converting landing page for a developer tool startup with animated demos and a 4.1% sign-up rate.',
    imgBg: '#0e0d0a', imgLabel: 'Website', hoverName: 'Stackr Landing', tall: false,
  },
  {
    id: 2, category: 'mobile', tag: 'Mobile App', name: 'Pulse Health Tracker', year: '2024',
    desc: 'iOS app from zero to App Store in 8 weeks. 4.8★ rating, 12k downloads in first month.',
    imgBg: '#0a0d12', imgLabel: 'App screens', hoverName: 'Pulse Tracker', tall: true,
  },
  {
    id: 3, category: 'branding', tag: 'Branding', name: 'Nordvik Brand Identity', year: '2023',
    desc: 'Full visual identity for a Scandinavian e-commerce brand — logo, type system, packaging, and guidelines.',
    imgBg: '#110d09', imgLabel: 'Brand assets', hoverName: 'Nordvik Identity', tall: false,
  },
  {
    id: 4, category: 'seo', tag: 'SEO & Marketing', name: 'Acme Co. Organic Growth', year: '2023',
    desc: '12-month SEO engagement that grew organic traffic 310% and reduced paid acquisition spend by half.',
    imgBg: '#0b0e0b', imgLabel: 'Analytics dashboard', hoverName: 'Acme Growth', tall: false,
  },
  {
    id: 5, category: 'uiux', tag: 'UI/UX Design', name: 'Vaultly Dashboard', year: '2024',
    desc: 'End-to-end UX redesign of a fintech dashboard. User research, wireframes, prototype, and Figma handoff.',
    imgBg: '#0d0b12', imgLabel: 'UI screens', hoverName: 'Vaultly Dashboard', tall: true,
  },
  {
    id: 6, category: 'social', tag: 'Social Media', name: 'Pulse Labs Social Strategy', year: '2023',
    desc: '6-month retainer that grew LinkedIn following 4× and generated 28 inbound leads per month.',
    imgBg: '#12100a', imgLabel: 'Content samples', hoverName: 'Pulse Labs', tall: false,
  },
  {
    id: 7, category: 'web', tag: 'Web Design & E-commerce', name: 'Fenwick Shop Replatform', year: '2023',
    desc: 'Shopify Plus migration and redesign for a boutique home goods retailer. Revenue up 88% in 90 days.',
    imgBg: '#0f0e0b', imgLabel: 'E-commerce site', hoverName: 'Fenwick Shop', tall: false,
  },
  {
    id: 8, category: 'branding', tag: 'Branding', name: 'Cellar & Grain', year: '2022',
    desc: 'Brand identity for an artisan spirits label — mark, label design, print collateral, and brand book.',
    imgBg: '#100f0c', imgLabel: 'Brand guidelines', hoverName: 'Cellar & Grain', tall: false,
  },
  {
    id: 9, category: 'mobile', tag: 'Mobile App', name: 'Trailr — Hiking Companion', year: '2022',
    desc: 'Cross-platform trail navigation app with offline maps and community features. 50k+ active users.',
    imgBg: '#0a0c10', imgLabel: 'App screens', hoverName: 'Trailr', tall: false,
  },
];

const STATS = [
  { num: '120', suffix: '+', lbl: 'projects shipped' },
  { num: '8',   suffix: 'yr', lbl: 'in business' },
  { num: '96',  suffix: '%', lbl: 'client satisfaction' },
];

/* ─── SVG ──────────────────────────────────────────────── */
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

/* ─── COMPONENT ────────────────────────────────────────── */
export default function CenterpointWorkPage() {
  const [activeFilter, setActiveFilter] = useState('all');

  const showFeatured = activeFilter === 'all' || activeFilter === FEATURED.category;
  const visibleProjects = activeFilter === 'all'
    ? PROJECTS
    : PROJECTS.filter(p => p.category === activeFilter);

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
                <div className={styles.hstatNum}>
                  {s.num}<span>{s.suffix}</span>
                </div>
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
          <div className={styles.featuredCard}>
            {/* Replace with next/image when you have real assets */}
            <div className={styles.featuredImg} style={{ background: FEATURED.imgBg }}>
              <div className={styles.featuredStripe} />
              <div className={styles.featuredImgPlaceholder}>Full-site screenshot</div>
            </div>
            <div className={styles.featuredInfo}>
              <div>
                <div className={styles.fTag}>{FEATURED.tag}</div>
                <div className={styles.fTitle}>
                  {FEATURED.title.split('\n').map((line, i) => (
                    <span key={i}>{line}{i === 0 && <br />}</span>
                  ))}
                </div>
                <p className={styles.fDesc}>{FEATURED.desc}</p>
                <div className={styles.fMeta}>
                  {[['Client', FEATURED.client], ['Year', FEATURED.year], ['Timeline', FEATURED.timeline]].map(([lbl, val]) => (
                    <div key={lbl}>
                      <div className={styles.fMetaLabel}>{lbl}</div>
                      <div className={styles.fMetaVal}>{val}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className={styles.fResults}>
                {FEATURED.results.map(r => (
                  <div key={r.lbl} className={styles.fResultCell}>
                    <div className={styles.fResultNum}>{r.num}</div>
                    <div className={styles.fResultLbl}>{r.lbl}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
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
              gridTemplateColumns: visibleProjects.length === 1
                ? '1fr 1fr'
                : visibleProjects.length === 2
                  ? '1fr 1fr'
                  : 'repeat(3,1fr)',
            }}
          >
            {visibleProjects.map(p => (
              <div key={p.id} className={styles.projectCard}>
                {/* Replace div with next/image when ready */}
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
              </div>
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
          <a href="/#consult" className={styles.btnAmber}>Book a free call →</a>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer className={styles.footer}>
        <span>© {new Date().getFullYear()} CenterPoint Digital. All rights reserved.</span>
        <div className={styles.footerLinks}>
          <a href="/">Home</a>
          <a href="/#services">Services</a>
          <a href="#">Privacy</a>
          <a href="/#consult">Contact</a>
        </div>
      </footer>

    </div>
  );
}
