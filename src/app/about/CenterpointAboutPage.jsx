// CenterpointAboutPage.jsx
// Drop into your Next.js app — e.g. app/about/page.jsx
//
// 1. Copy this file + centerpointAbout.module.css into the same folder.
// 2. Uses the same Syne + Outfit fonts — already set up if you added the other pages.
// 3. Replace <a href> with Next.js <Link href> and swap placeholder photos with <Image />.

import styles from './centerpointAbout.module.css';
import Link from 'next/link';

export const metadata = {
  title: 'About — CenterPoint Digital',
  description: 'A small digital agency for startups and small businesses. Founded 2018, based in New York, remote-first.',
};

/* ─── DATA ─────────────────────────────────────────────── */
const STATS = [
  { num: '120', suffix: '+', lbl: 'projects shipped since 2018' },
  { num: '8',   suffix: 'yr', lbl: 'in business, still growing' },
  { num: '96',  suffix: '%',  lbl: 'client satisfaction rate' },
  { num: '2',   suffix: 'wk', lbl: 'average time from brief to launch' },
  { num: '5.0', suffix: '★',  lbl: 'average client rating' },
];

const VALUES = [
  { num: '01', title: 'Clarity over complexity', body: "We keep projects lean and purposeful. No unnecessary scope, no hidden fees, no surprises. If something doesn't make the product better, we don't build it." },
  { num: '02', title: 'Speed to value',          body: 'We move fast without cutting corners. Most projects ship in weeks, not months. We believe the best way to validate an idea is to get it in front of real users — fast.' },
  { num: '03', title: 'Long-term partnership',   body: "We grow with our clients. The relationship doesn't end at launch — it starts there. We stay close, iterate, and invest in the long-term success of what we ship." },
];

const TEAM = [
  { name: 'Alex Rivera', role: 'Founder & Creative Director', bg: '#131009',
    bio: '10 years designing for startups and Fortune 500s. Cares deeply about craft and believes design is problem-solving.',
    socials: ['linkedin', 'twitter'] },
  { name: 'Jordan Lee', role: 'Co-founder & Tech Lead', bg: '#0d0e13',
    bio: "Full-stack engineer who's shipped products used by millions. Obsessed with performance, accessibility, and clean code.",
    socials: ['linkedin', 'github'] },
  { name: 'Sam Chen', role: 'Head of Strategy & Growth', bg: '#11100d',
    bio: 'Former growth lead at two acquired startups. Bridges the gap between business goals and digital execution with a data-first mindset.',
    socials: ['linkedin', 'twitter'] },
  { name: 'Maya Patel', role: 'Senior UX Designer', bg: '#0e0d0a',
    bio: 'UX specialist with a background in cognitive psychology. Runs user research and turns complex flows into intuitive, delightful experiences.',
    socials: ['linkedin', 'dribbble'] },
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

/* ─── SVG ICONS ────────────────────────────────────────── */
const LogoIcon = () => (
  <svg viewBox="0 0 12 12" width="12" height="12">
    <circle cx="6" cy="6" r="2.5" fill="currentColor" />
    <circle cx="6" cy="6" r="5" fill="none" stroke="currentColor" strokeWidth="1.2" />
  </svg>
);
const SOCIAL_SVGS = {
  linkedin: <svg viewBox="0 0 24 24"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>,
  twitter:  <svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.259 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
  github:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>,
  dribbble: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32"/></svg>,
};

/* ─── COMPONENT ────────────────────────────────────────── */
export default function CenterpointAboutPage() {
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
          <li><Link href="/#services">Services</Link></li>
          <li><Link href="/work">Work</Link></li>
          <li><Link href="/about" className={styles.navLinkActive}>About</Link></li>
        </ul>
        <Link href="/#consult" className={styles.navCta}>Free Consultation</Link>
      </nav>

      {/* ── HERO ── */}
      <header className={styles.hero}>
        <div className={styles.heroBgText}>AB</div>
        <div className={styles.heroInner}>
          <div>
            <div className={styles.heroEyebrow}>Who we are</div>
            <h1 className={styles.heroH1}>
              We build things<br />people are<br /><em>proud of.</em>
            </h1>
          </div>
          <div className={styles.heroRight}>
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
          </div>
        </div>
      </header>

      {/* ── STORY ── */}
      <section className={styles.story}>
        <div className={styles.max}>
          <div className={styles.storyGrid}>
            <div>
              <div className={styles.tag}>Our story</div>
              <h2 className={styles.h2} style={{ marginBottom: 32 }}>
                Started by founders,<br />for founders.
              </h2>
              <p className={styles.storyP}>CenterPoint started in 2018 when our founders got tired of watching great products fail because of bad digital execution. Too many startups were being sold overpriced, underdelivered agency work — or settling for templates that made them look like everyone else.</p>
              <p className={styles.storyP}>We set out to do the opposite: a small, focused team that works directly with founders, moves fast, and takes quality personally. No account managers, no hand-offs, no wasted weeks. Just sharp people doing the work.</p>
              <p className={styles.storyP}>Six years and 120+ projects later, that's still what we are.</p>
              <p className={styles.storyP}>More recently, that same approach has shaped how we build AI — designing and shipping production RAG applications and LLM-powered features for clients who want real results, not demos.</p>
            </div>
            <div>
              <p className={styles.storyPull}>
                We believe <em>great digital products</em> shouldn't be out of reach for small businesses.
              </p>
              <p className={styles.storyP}>That belief shapes everything about how we work — from pricing that doesn't punish early-stage companies, to processes designed to ship in weeks instead of quarters, to relationships that don't end at launch.</p>
              <p className={styles.storyP}>We've worked with solo founders on their first product and with established brands reinventing their digital presence. What every client has in common is that they care deeply about what they're building — and so do we.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── NUMBERS ── */}
      <div className={styles.numbers}>
        <div className={styles.numbersGrid}>
          {STATS.map(s => (
            <div key={s.lbl} className={styles.numCell}>
              <div className={styles.numBig}>{s.num}<span>{s.suffix}</span></div>
              <div className={styles.numLbl}>{s.lbl}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── VALUES ── */}
      <section className={styles.values}>
        <div className={styles.max}>
          <div className={styles.valuesHead}>
            <div>
              <div className={styles.tag}>What we stand for</div>
              <h2 className={styles.h2}>Three things we<br />never compromise on.</h2>
            </div>
            <p className={styles.valuesSub}>
              These aren't aspirations. They're how we actually work, on every project, with every client.
            </p>
          </div>
          <div className={styles.valuesGrid}>
            {VALUES.map(v => (
              <div key={v.num} className={styles.valueCard}>
                <div className={styles.valueNum}>{v.num}</div>
                <div className={styles.valueTitle}>{v.title}</div>
                <div className={styles.valueBody}>{v.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section className={styles.team}>
        <div className={styles.max}>
          <div className={styles.teamHead}>
            <div className={styles.tag}>The team</div>
            <h2 className={styles.h2}>Small by design.<br />Senior by default.</h2>
          </div>
          <div className={styles.teamGrid}>
            {TEAM.map(m => (
              <div key={m.name} className={styles.teamCard}>
                {/* Swap this div for <Image> when you have real photos */}
                <div className={styles.teamPhoto} style={{ background: m.bg }}>
                  <div className={styles.teamStripe} />
                  <div className={styles.teamPhotoLabel}>Headshot</div>
                </div>
                <div className={styles.teamInfo}>
                  <div className={styles.teamName}>{m.name}</div>
                  <div className={styles.teamRole}>{m.role}</div>
                  <div className={styles.teamBio}>{m.bio}</div>
                  <div className={styles.teamSocial}>
                    {m.socials.map(s => (
                      <a key={s} href="#" aria-label={s} className={styles.teamSoc}>
                        {SOCIAL_SVGS[s]}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CLIENTS ── */}
      <section className={styles.clients}>
        <div className={styles.max}>
          <div className={styles.clientsHead}>
            <div className={styles.tag}>Who we've worked with</div>
            <h2 className={styles.h2} style={{ fontSize: 'clamp(28px,3vw,44px)' }}>
              Trusted by builders<br />at every stage.
            </h2>
          </div>
          <div className={styles.clientsLogos}>
            {CLIENTS.map(c => (
              <div key={c} className={styles.clientCell}>
                <div className={styles.clientName}>{c}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROCESS ── */}
      <section className={styles.process}>
        <div className={styles.max}>
          <div className={styles.processHead}>
            <div className={styles.tag}>How we work</div>
            <h2 className={styles.h2}>Every project.<br />Same four steps.</h2>
          </div>
          <div className={styles.processRows}>
            {PROCESS.map(p => (
              <div key={p.num} className={styles.processRow}>
                <div className={styles.prNum}>{p.num}</div>
                <div>
                  <div className={styles.prTitle}>{p.title}</div>
                  <div className={styles.prSub}>{p.sub}</div>
                </div>
                <p className={styles.prBody}>{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <div className={styles.ctaSection}>
        <div className={styles.ctaInner}>
          <div>
            <h2 className={styles.ctaH2}>
              Let's build something<br /><em>together.</em>
            </h2>
            <p className={styles.ctaP}>
              Book a free 30-minute discovery call. No commitment — just an honest
              conversation about what you're building and how we can help.
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
          <Link href="#">Privacy</Link>
          <Link href="/#consult">Contact</Link>
        </div>
      </footer>

    </div>
  );
}
