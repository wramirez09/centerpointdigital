'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './centerpoint.module.css';

/* ─── DATA ─────────────────────────────────────────────── */
const SERVICES = [
  { num: '01', name: 'Web Design & Development', sub: 'Fast, beautiful sites that convert visitors into customers' },
  { num: '02', name: 'Mobile Apps',              sub: 'Native-quality iOS & Android from MVP to full product' },
  { num: '03', name: 'Branding & Identity',      sub: 'Logos, visual systems, and guidelines built to last' },
  { num: '04', name: 'SEO & Digital Marketing',  sub: 'Organic growth strategies that compound over time' },
  { num: '05', name: 'UI/UX Design',             sub: 'Research-led design that reduces friction and lifts retention' },
  { num: '06', name: 'Social Media Management',  sub: 'On-brand content that builds community and drives leads' },
];

const TICKER_ITEMS = [
  'Web Design', 'Mobile Apps', 'Branding', 'SEO & Marketing', 'UI/UX Design', 'Social Media',
  'Web Design', 'Mobile Apps', 'Branding', 'SEO & Marketing', 'UI/UX Design', 'Social Media',
];

const VALUES = [
  { title: 'Clarity over complexity', body: 'We keep projects lean and purposeful — no unnecessary scope, no hidden fees, no surprises.' },
  { title: 'Speed to value',          body: 'We move fast without cutting corners. Most projects ship in weeks, not months.' },
  { title: 'Long-term partnership',   body: "We grow with our clients. The relationship doesn't end at launch — it starts there." },
];

const WORK = [
  { label: 'Website redesign', tag: 'Web Design',  title: 'Flowbase Rebrand',  desc: 'Full website redesign and brand refresh for a SaaS startup', bg: '#111009', size: 'tall' },
  { label: 'Mobile app',       tag: 'Mobile App',  title: 'Pulse Tracker',     desc: 'iOS health app from MVP to App Store',                         bg: '#0d0e12', size: 'short' },
  { label: 'Brand identity',   tag: 'Branding',    title: 'Nordvik Identity',   desc: 'End-to-end brand system for a Scandinavian brand',             bg: '#120d09', size: 'short' },
];

const STATS = [
  { num: '120+', lbl: 'projects shipped' },
  { num: '5.0★', lbl: 'average rating' },
  { num: '8yr',  lbl: 'in business' },
];

/* ─── SVG ICONS ────────────────────────────────────────── */
const ArrowRight = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M2 7h10M8 3l4 4-4 4"/>
  </svg>
);

const LogoIcon = () => (
  <svg viewBox="0 0 12 12" width="12" height="12">
    <circle cx="6" cy="6" r="2.5" fill="currentColor"/>
    <circle cx="6" cy="6" r="5" fill="none" stroke="currentColor" strokeWidth="1.2"/>
  </svg>
);

const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.259 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <rect x="2" y="2" width="20" height="20" rx="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

/* ─── COMPONENT ────────────────────────────────────────── */
export default function CenterpointPage() {
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', service: '', timeline: '', message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: wire up to your API / form handler here
    console.log('Form submitted:', form);
    setSubmitted(true);
  };

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
          <li><a href="#services">Services</a></li>
          <li><a href="#work">Work</a></li>
          <li><a href="#about">About</a></li>
        </ul>
        <a href="#consult" className={styles.navCta}>Free Consultation</a>
      </nav>

      {/* ── HERO ── */}
      <section className={styles.hero}>
        <div className={styles.heroBgNum}>CP</div>
        <div className={styles.heroLine} />
        <div className={styles.heroLabel}>Digital agency for startups</div>
        <h1 className={styles.heroH1}>
          Transforming<br />vision into<br />
          <em>digital</em><br />reality.
        </h1>
        <div className={styles.heroFooter}>
          <p className={styles.heroSub}>
            We help small businesses and startups ship beautiful, high-performing
            digital products — from brand identity to launch and beyond.
          </p>
          <div className={styles.heroCtaGroup}>
            <a href="#consult" className={styles.btnAmber}>Book a free call</a>
            <a href="#services" className={styles.btnOutline}>
              See services <ArrowRight />
            </a>
          </div>
          <div className={styles.heroStats}>
            {STATS.map((s, i) => (
              <>
                {i > 0 && <div key={`d${i}`} className={styles.heroDivider} />}
                <div key={s.num}>
                  <div className={styles.heroStatNum}>
                    {s.num.replace(/[★yr+]/, '')}
                    <span style={{ color: 'var(--amber)' }}>
                      {s.num.match(/[★yr+]/)?.[0] ?? ''}
                    </span>
                  </div>
                  <div className={styles.heroStatLbl}>{s.lbl}</div>
                </div>
              </>
            ))}
          </div>
        </div>
      </section>

      {/* ── TICKER ── */}
      <div className={styles.tickerOuter}>
        <div className={styles.tickerTrack}>
          {TICKER_ITEMS.map((item, i) => (
            <span key={i} className={styles.tickerItem}>
              {item} <span className={styles.tickerDot} />
            </span>
          ))}
        </div>
      </div>

      {/* ── SERVICES ── */}
      <section className={styles.section} id="services">
        <div className={styles.max}>
          <div className={styles.servicesHead}>
            <div>
              <div className={styles.tag}>What we do</div>
              <h2 className={styles.h2}>Six ways we<br />grow your business.</h2>
            </div>
            <p className={styles.sub}>
              Every service is built around one goal: shipping work that drives real growth.
            </p>
          </div>
          <div className={styles.svcList}>
            {SERVICES.map((s) => (
              <div key={s.num} className={styles.svcRow}>
                <div className={styles.svcNum}>{s.num}</div>
                <div className={styles.svcName}>
                  {s.name}
                  <span className={styles.svcNameSub}>{s.sub}</span>
                </div>
                <div className={styles.svcArrow}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
                    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                    <path d="M2 7h10M8 3l4 4-4 4"/>
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section className={styles.sectionAlt} id="about">
        <div className={styles.max}>
          <div className={styles.aboutGrid}>
            {/* Left */}
            <div className={styles.aboutLeft}>
              <div className={styles.tag}>Our mission</div>
              <h2 className={styles.h2}>Built for<br />builders.</h2>
              <p className={styles.sub} style={{ marginTop: 20 }}>
                We started CenterPoint because great digital products shouldn't be out of reach
                for small businesses. We partner closely with founders to ship work that
                actually moves the needle.
              </p>
              <div className={styles.aboutNumRow}>
                {[['120+','happy clients'],['8yr','in business'],['96%','repeat clients'],['2wk','avg time to launch']].map(([big, lbl]) => (
                  <div key={lbl} className={styles.aboutNumCell}>
                    <div className={styles.aboutNumBig}>
                      {big.replace(/[+%yr wk]/g, '')}
                      <span>{big.match(/[+%yr wk]+/)?.[0] ?? ''}</span>
                    </div>
                    <div className={styles.aboutNumLbl}>{lbl}</div>
                  </div>
                ))}
              </div>
            </div>
            {/* Right */}
            <div className={styles.aboutRight}>
              <div className={styles.tag}>How we work</div>
              <h2 className={styles.h2} style={{ fontSize: 'clamp(28px,3vw,44px)' }}>
                Three things<br />we never<br />compromise on.
              </h2>
              <div className={styles.valList}>
                {VALUES.map((v) => (
                  <div key={v.title} className={styles.valRow}>
                    <div className={styles.valIcon}>→</div>
                    <div>
                      <div className={styles.valTitle}>{v.title}</div>
                      <div className={styles.valBody}>{v.body}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WORK ── */}
      <section className={styles.sectionWork} id="work">
        <div className={styles.max}>
          <div className={styles.workHead}>
            <div>
              <div className={styles.tag}>Selected work</div>
              <h2 className={styles.h2}>Projects we're<br />proud of.</h2>
            </div>
            <Link href="/work" className={styles.btnOutline}>
              View all work <ArrowRight />
            </Link>
          </div>
          <div className={styles.workGrid}>
            {/* Featured card */}
            <div
              className={`${styles.workCard} ${styles.workCardTall}`}
              style={{ background: WORK[0].bg }}>
              <div className={styles.workStripe} />
              <div className={styles.workPlaceholder}>{WORK[0].label}</div>
              <div className={styles.workOverlay}>
                <div className={styles.workTag}>{WORK[0].tag}</div>
                <div className={styles.workTitle}>{WORK[0].title}</div>
                <div className={styles.workDesc}>{WORK[0].desc}</div>
              </div>
            </div>
            {/* Stacked cards */}
            <div className={styles.workGridRight}>
              {WORK.slice(1).map((w) => (
                <div key={w.title}
                  className={`${styles.workCard} ${styles.workCardShort}`}
                  style={{ background: w.bg }}>
                  <div className={styles.workStripe} />
                  <div className={styles.workPlaceholder}>{w.label}</div>
                  <div className={styles.workOverlay}>
                    <div className={styles.workTag}>{w.tag}</div>
                    <div className={styles.workTitle}>{w.title}</div>
                    <div className={styles.workDesc}>{w.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CONSULTATION FORM ── */}
      <section className={styles.sectionConsult} id="consult">
        <div className={styles.max}>
          <div className={styles.captureOuter}>
            {/* Top amber band */}
            <div className={styles.captureTop}>
              <div>
                <h2 className={styles.captureH2}>Let's build<br />something great.</h2>
                <p className={styles.captureTopP}>
                  Book a free 30-minute discovery call. We'll learn about your business
                  and show you exactly how we can help — no commitment, no pressure.
                </p>
              </div>
              <div className={styles.offerBadge}>
                <div className={styles.offerPct}>20%</div>
                <div className={styles.offerOff}>off</div>
                <div className={styles.offerNew}>new clients</div>
              </div>
            </div>

            {/* Form */}
            <div className={styles.captureBottom}>
              {submitted ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <div style={{
                    fontFamily: 'var(--font-syne,"Syne",sans-serif)',
                    fontSize: 32, fontWeight: 800, letterSpacing: '-.03em',
                    color: 'var(--amber)', marginBottom: 12,
                  }}>We'll be in touch.</div>
                  <p style={{ color: 'var(--muted)', fontWeight: 300 }}>
                    Expect a reply within one business day.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className={styles.formGrid}>
                    <div className={styles.fg}>
                      <label htmlFor="firstName">First name</label>
                      <input id="firstName" type="text" placeholder="Jane"
                        value={form.firstName}
                        onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} />
                    </div>
                    <div className={styles.fg}>
                      <label htmlFor="lastName">Last name</label>
                      <input id="lastName" type="text" placeholder="Smith"
                        value={form.lastName}
                        onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} />
                    </div>
                    <div className={styles.fg}>
                      <label htmlFor="email">Email</label>
                      <input id="email" type="email" placeholder="jane@startup.com"
                        value={form.email}
                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                    </div>
                  </div>
                  <div className={styles.formGrid2}>
                    <div className={styles.fg}>
                      <label htmlFor="service">I need help with…</label>
                      <select id="service" value={form.service}
                        onChange={e => setForm(f => ({ ...f, service: e.target.value }))}>
                        <option value="">Select a service</option>
                        <option>Web Design &amp; Development</option>
                        <option>Mobile App</option>
                        <option>Branding &amp; Identity</option>
                        <option>SEO &amp; Digital Marketing</option>
                        <option>UI/UX Design</option>
                        <option>Social Media Management</option>
                        <option>Not sure yet</option>
                      </select>
                    </div>
                    <div className={styles.fg}>
                      <label htmlFor="timeline">Timeline</label>
                      <select id="timeline" value={form.timeline}
                        onChange={e => setForm(f => ({ ...f, timeline: e.target.value }))}>
                        <option value="">When do you need it?</option>
                        <option>ASAP</option>
                        <option>Within 1 month</option>
                        <option>1–3 months</option>
                        <option>Flexible</option>
                      </select>
                    </div>
                  </div>
                  <div className={`${styles.fg} ${styles.fgFull}`}>
                    <label htmlFor="message">Tell us about your project</label>
                    <textarea id="message" rows={3}
                      placeholder="What are you building? What's the goal?"
                      value={form.message}
                      onChange={e => setForm(f => ({ ...f, message: e.target.value }))} />
                  </div>
                  <div className={styles.submitRow}>
                    <button type="submit" className={styles.btnSubmit}>
                      Book My Free Consultation →
                    </button>
                    <p className={styles.submitNote}>
                      No credit card needed. 30-min call, zero commitment.
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className={styles.footer}>
        <div className={styles.footerGrid}>
          <div>
            <div className={styles.fLogo}>
              <div className={styles.fLogoMark}><LogoIcon /></div>
              CenterPoint<span style={{ color: 'var(--amber)' }}>.</span>
            </div>
            <p className={styles.fDesc}>
              A digital agency helping small businesses and startups build
              products they're proud of.
            </p>
            <div className={styles.socialRow}>
              <a className={styles.soc} href="#" aria-label="Twitter"><TwitterIcon /></a>
              <a className={styles.soc} href="#" aria-label="LinkedIn"><LinkedInIcon /></a>
              <a className={styles.soc} href="#" aria-label="Instagram"><InstagramIcon /></a>
            </div>
          </div>
          <div className={styles.fCol}>
            <h4>Services</h4>
            <ul>
              <li><a href="#services">Web Development</a></li>
              <li><a href="#services">Mobile Apps</a></li>
              <li><a href="#services">Branding</a></li>
              <li><a href="#services">SEO &amp; Marketing</a></li>
              <li><a href="#services">UI/UX Design</a></li>
            </ul>
          </div>
          <div className={styles.fCol}>
            <h4>Company</h4>
            <ul>
              <li><a href="#about">About us</a></li>
              <li><a href="#work">Our work</a></li>
              <li><a href="#consult">Contact</a></li>
            </ul>
          </div>
          <div className={styles.fCol}>
            <h4>Legal</h4>
            <ul>
              <li><a href="#">Privacy policy</a></li>
              <li><a href="#">Terms of service</a></li>
            </ul>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <span>© {new Date().getFullYear()} CenterPoint Digital. All rights reserved.</span>
        </div>
      </footer>

    </div>
  );
}
