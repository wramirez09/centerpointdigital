// CenterpointAboutPage.jsx
// Drop into your Next.js app — e.g. app/about/page.jsx
//
// 1. Copy this file + centerpointAbout.module.css into the same folder.
// 2. Uses the same Syne + Outfit fonts — already set up if you added the other pages.
// 3. Replace <a href> with Next.js <Link href> and swap placeholder photos with <Image />.

import styles from './centerpointAbout.module.css';
import Link from 'next/link';
import SiteNav from '@/components/SiteNav/SiteNav';
import CtaBand from '@/components/CtaBand/CtaBand';
import SiteFooter from '@/components/SiteFooter/SiteFooter';
import { Reveal, Stagger, StaggerItem } from '@/components/Reveal/Reveal';

export const metadata = {
  title: 'About — CenterPoint Digital',
  description: 'A small digital agency for startups and small businesses. Founded 2018, based in New York, remote-first.',
};

/* ─── DATA ─────────────────────────────────────────────── */
const STATS = [
  { num: '2',   suffix: 'wk', lbl: 'average time from brief to launch' },
  { num: '5.0', suffix: '★',  lbl: 'average client rating' },
];

const VALUES = [
  { num: '01', title: 'Clarity over complexity', body: "We keep projects lean and purposeful. No unnecessary scope, no hidden fees, no surprises. If something doesn't make the product better, we don't build it." },
  { num: '02', title: 'Speed to value',          body: 'We move fast without cutting corners. Most projects ship in weeks, not months. We believe the best way to validate an idea is to get it in front of real users — fast.' },
  { num: '03', title: 'Long-term partnership',   body: "We grow with our clients. The relationship doesn't end at launch — it starts there. We stay close, iterate, and invest in the long-term success of what we ship." },
];

const CLIENTS = [
  'Flowbase','Pulse Labs','Nordvik','Stackr','Vaultly',
  'Acme Co.','Fenwick','Trailr','Cellar & Grain','Meridian',
];

const PROCESS = [
  { num: '01', title: 'Discovery',      sub: 'Week 1',     body: 'We start with a deep-dive into your business, your users, and your goals. Analytics, interviews, competitor audits — we leave nothing to assumption before a single pixel is designed.' },
  { num: '02', title: 'Design',         sub: 'Week 1–2',   body: 'Wireframes, visual design, and an interactive prototype. One structured round of feedback, then sign-off. We move fast here because we did the hard thinking upfront.' },
  { num: '03', title: 'Build',          sub: 'Week 2–5',   body: 'Clean, performant code on modern frameworks. CMS integration, SEO implementation, accessibility compliance. You review on staging before anything goes live.' },
  { num: '04', title: 'Launch & grow',  sub: 'Week 5–6+',  body: "QA, launch, and monitoring. We don't disappear at go-live — we stay close, track what matters, and iterate. Most of our clients stay with us long after the first project ships." },
];

/* ─── COMPONENT ────────────────────────────────────────── */
export default function CenterpointAboutPage() {
  return (
    <div className={styles.root}>

      {/* ── NAV ── */}
      <SiteNav current="about" />

      {/* ── HERO ── */}
      <header className={styles.hero}>
        <div className={styles.heroBgText}>AB</div>
        <div className={styles.heroInner}>
          <Reveal>
            <div className={styles.heroEyebrow}>Who we are</div>
            <h1 className={styles.heroH1}>
              We build things<br />people are<br /><em>proud of.</em>
            </h1>
          </Reveal>
          <Reveal delay={0.25} className={styles.heroRight}>
            <p className={styles.heroSub}>
              CenterPoint is a digital agency for small businesses and startups.
              We partner closely with founders to ship websites, apps, and brands
              that drive real growth — built fast, built right.
            </p>
            <div className={styles.heroFounded}>
              <span className={styles.heroFoundedDot} />
              Founded <strong>2018</strong> &nbsp;·&nbsp;
              Based in <strong>New York</strong> &nbsp;·&nbsp;
              Remote-first
            </div>
          </Reveal>
        </div>
      </header>

      {/* ── STORY ── */}
      <section className={styles.story}>
        <div className={styles.max}>
          <div className={styles.storyGrid}>
            <Reveal>
              <div className={styles.tag}>Our story</div>
              <h2 className={styles.h2} style={{ marginBottom: 32 }}>
                Started by founders,<br />for founders.
              </h2>
              <p className={styles.storyP}>CenterPoint started in 2018 when our founders got tired of watching great products fail because of bad digital execution. Too many startups were being sold overpriced, underdelivered agency work — or settling for templates that made them look like everyone else.</p>
              <p className={styles.storyP}>We set out to do the opposite: a small, focused team that works directly with founders, moves fast, and takes quality personally. No account managers, no hand-offs, no wasted weeks. Just sharp people doing the work.</p>
              <p className={styles.storyP}>That's still what we are today.</p>
              <p className={styles.storyP}>More recently, that same approach has shaped how we build AI — designing and shipping production RAG applications and LLM-powered features for clients who want real results, not demos.</p>
            </Reveal>
            <Reveal delay={0.25}>
              <p className={styles.storyPull}>
                We believe <em>great digital products</em> shouldn't be out of reach for small businesses.
              </p>
              <p className={styles.storyP}>That belief shapes everything about how we work — from pricing that doesn't punish early-stage companies, to processes designed to ship in weeks instead of quarters, to relationships that don't end at launch.</p>
              <p className={styles.storyP}>We've worked with solo founders on their first product and with established brands reinventing their digital presence. What every client has in common is that they care deeply about what they're building — and so do we.</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── NUMBERS ── */}
      <div className={styles.numbers}>
        <Stagger className={styles.numbersGrid}>
          {STATS.map(s => (
            <StaggerItem key={s.lbl} className={styles.numCell}>
              <div className={styles.numBig}>{s.num}<span>{s.suffix}</span></div>
              <div className={styles.numLbl}>{s.lbl}</div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>

      {/* ── VALUES ── */}
      <section className={styles.values}>
        <div className={styles.max}>
          <Reveal className={styles.valuesHead}>
            <div>
              <div className={styles.tag}>What we stand for</div>
              <h2 className={styles.h2}>Three things we<br />never compromise on.</h2>
            </div>
            <p className={styles.valuesSub}>
              These aren't aspirations. They're how we actually work, on every project, with every client.
            </p>
          </Reveal>
          <Stagger className={styles.valuesGrid}>
            {VALUES.map(v => (
              <StaggerItem key={v.num} className={styles.valueCard}>
                <div className={styles.valueNum}>{v.num}</div>
                <div className={styles.valueTitle}>{v.title}</div>
                <div className={styles.valueBody}>{v.body}</div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ── CLIENTS ── */}
      <section className={styles.clients}>
        <div className={styles.max}>
          <Reveal className={styles.clientsHead}>
            <div className={styles.tag}>Who we've worked with</div>
            <h2 className={styles.h2} style={{ fontSize: 'clamp(28px,3vw,44px)' }}>
              Trusted by builders<br />at every stage.
            </h2>
          </Reveal>
          <Stagger className={styles.clientsLogos}>
            {CLIENTS.map(c => (
              <StaggerItem key={c} className={styles.clientCell}>
                <div className={styles.clientName}>{c}</div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ── PROCESS ── */}
      <section className={styles.process}>
        <div className={styles.max}>
          <Reveal className={styles.processHead}>
            <div className={styles.tag}>How we work</div>
            <h2 className={styles.h2}>Every project.<br />Same four steps.</h2>
          </Reveal>
          <Stagger className={styles.processRows}>
            {PROCESS.map(p => (
              <StaggerItem key={p.num} className={styles.processRow}>
                <div className={styles.prNum}>{p.num}</div>
                <div>
                  <div className={styles.prTitle}>{p.title}</div>
                  <div className={styles.prSub}>{p.sub}</div>
                </div>
                <p className={styles.prBody}>{p.body}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ── CTA ── */}
      <CtaBand
        title={<>Let's build something<br /><em>together.</em></>}
        text="Book a free 30-minute discovery call. No commitment — just an honest conversation about what you're building and how we can help."
      />

      {/* ── FOOTER ── */}
      <SiteFooter />

    </div>
  );
}
