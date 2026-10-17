import projectStyles from '../work/[slug]/centerpointProject.module.css';
import serviceStyles from '../services/[slug]/centerpointService.module.css';
import styles from './forAgencies.module.css';
import Link from 'next/link';
import SiteNav from '@/components/SiteNav/SiteNav';
import CtaBand from '@/components/CtaBand/CtaBand';
import SiteFooter from '@/components/SiteFooter/SiteFooter';
import { Reveal, Stagger, StaggerItem } from '@/components/Reveal/Reveal';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'White-Label Development for Agencies | Center Point Digital',
  description:
    'White-label AI features, front-end overflow, and project rescue for agencies. Fixed fees, NDA-first, built in React and TypeScript.',
};

const OFFERS = [
  {
    title: 'White-label AI features',
    body: 'Copilots, AI search, and interactive apps inside ChatGPT, Claude, and Microsoft 365 Copilot, delivered inside your client’s product under your brand.',
    detail: 'Fixed price per package, so you can mark it up with confidence.',
  },
  {
    title: 'Front-end overflow',
    body: 'React and TypeScript developers when your team is at capacity, by project or by monthly block.',
    detail: 'Senior-level work at wholesale rates.',
  },
  {
    title: 'Project rescue',
    body: 'Slow, broken, or stalled front end? We start with a paid one-day assessment, then fix it on a fixed fee.',
    detail: 'Built for deadlines that can’t move.',
  },
];

const TERMS = [
  'NDA and mutual non-solicit before we see anything. We never contact your clients.',
  'Your client owns what we deliver.',
  'Fixed fees wherever possible; 30–50% deposit to start.',
  'Anonymized case studies only, with your approval.',
];

export default function ForAgenciesPage() {
  const s = { ...projectStyles, ...serviceStyles, ...styles };

  return (
    <div className={s.root}>

      {/* ── NAV ── */}
      <SiteNav current="agencies" />

      {/* ── BREADCRUMB ── */}
      <div className={s.breadcrumb}>
        <Link href="/">Home</Link>
        <span className={s.breadcrumbSep}>/</span>
        <span className={s.breadcrumbCurrent}>For agencies</span>
      </div>

      {/* ── HERO ── */}
      <div className={s.serviceHero}>
        <Reveal className={s.heroTag}>For agencies · White-label development</Reveal>
        <Reveal delay={0.15}>
          <h1 className={s.projectTitle}>
            Your clients want AI.<br />
            <em>We build it under your name.</em>
          </h1>
          <p className={s.heroIntro}>
            Center Point Digital is the white-label development partner for agencies: AI features, extra
            front-end capacity, and rescue for projects in trouble. Your brand, your client, our engineering.
          </p>
          <div className={s.heroCtas}>
            <a href="/#consult" className={s.btnAmber}>Book a 20-minute partner call →</a>
          </div>
        </Reveal>
      </div>

      {/* ── THREE WAYS ── */}
      <div className={s.offeringsSection}>
        <div className={s.offeringsInner}>
          <Reveal>
            <div className={s.heroTag}>Services</div>
            <h2 className={s.contentH2} style={{ maxWidth: 640 }}>Three ways we work with agencies</h2>
          </Reveal>
          <Stagger className={s.offeringsGrid}>
            {OFFERS.map((o, i) => (
              <StaggerItem key={o.title} className={s.offering}>
                <div className={s.stepNum}>{String(i + 1).padStart(2, '0')}</div>
                <div className={s.stepTitle}>{o.title}</div>
                <div className={s.stepBody}>{o.body}</div>
                <div className={s.cardDetail}>{o.detail}</div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>

      {/* ── HOW PARTNERING WORKS ── */}
      <div className={s.contentBody}>
        <Reveal className={s.contentGrid} style={{ marginBottom: 0 }}>
          <div>
            <div className={s.sidebarHeading}>Terms</div>
          </div>
          <div>
            <h2 className={s.contentH2}>How partnering works</h2>
            <ul className={`${s.bestFor} ${s.terms}`}>
              {TERMS.map(t => <li key={t}>{t}</li>)}
            </ul>
          </div>
        </Reveal>
      </div>

      {/* ── CTA ── */}
      <CtaBand
        title={<>Have a project that<br /><em>needs hands now?</em></>}
        text="Tell us what’s on your plate. We’ll reply within one business day with a scope and a fixed price."
        buttonLabel="Book a partner call →"
      />

      {/* ── FOOTER ── */}
      <SiteFooter />

    </div>
  );
}
