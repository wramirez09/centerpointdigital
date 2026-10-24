'use client';

import { Fragment, useState } from 'react';
import Link from 'next/link';
import SiteNav from '@/components/SiteNav/SiteNav';
import LogoIcon from '@/components/SiteNav/LogoIcon';
import Image from 'next/image';
import emailjs from '@emailjs/browser';
import { motion } from 'framer-motion';
import styles from './centerpoint.module.css';
import { Reveal } from '@/components/Reveal/Reveal';
import ChromaType from '@/components/ChromaType/ChromaType';
import CenterMap from '@/components/CenterMap/CenterMap';
import PROJECTS from './work/projects';
import SERVICES from './services/services';

/* ─── DATA ─────────────────────────────────────────────── */

// Hero headline endings, typed in one after another. The first is what search engines see.
const HERO_WORDS = ['digital reality.', 'websites that sell.', 'apps people love.', 'AI that delivers.'];

const TICKER_ITEMS = [
  'Web Design', 'Mobile Apps', 'AI Applications', 'Branding', 'SEO & Marketing', 'UI/UX Design', 'RAG Pipelines', 'Social Media',
  'Web Design', 'Mobile Apps', 'AI Applications', 'Branding', 'SEO & Marketing', 'UI/UX Design', 'RAG Pipelines', 'Social Media',
];

const VALUES = [
  { title: 'Clarity over complexity', body: 'We keep projects lean and purposeful — no unnecessary scope, no hidden fees, no surprises.' },
  { title: 'Speed to value', body: 'We move fast without cutting corners. Most projects ship in weeks, not months.' },
  { title: 'Long-term partnership', body: "We grow with our clients. The relationship doesn't end at launch — it starts there." },
];

// Home page "Selected work": the first slug is the large card, the next two the small cards.
// Second and third picks are still to be decided; until then they show the other real projects.
const HOME_WORK_SLUGS = ['notedoctor-prior-auth', 'notedoctor-ai', 'one-stop'];
const WORK = HOME_WORK_SLUGS.map((slug) => PROJECTS.find((p) => p.slug === slug)).filter(Boolean);

// Every project quote from /work, so a new testimonial shows up here too.
const TESTIMONIALS = PROJECTS.filter((p) => p.testimonial).map((p) => ({ ...p.testimonial, slug: p.slug, project: p.name }));

const STATS = [
  { num: '5.0★', lbl: 'average rating' },
];

// Same EmailJS account and template as the /contact form. The template reads name, email and message.
const EMAILJS = { publicKey: '1Y7wGEfTmPGt-GE90', serviceId: 'default_service', templateId: 'template_teh6b2b' };

/* ─── FRAME ANIMATION ──────────────────────────────────── */
// Bordered boxes (the about section, testimonial cards) draw their border in amber, clockwise
// from the top-left corner; then their content fades in and the amber settles back to the
// normal border colour. `offset` (seconds) shifts a whole sequence later.
const FRAME_LINES = [
  // [class, delay, duration] — linear and back to back so the trace never pauses at a corner.
  ['frameTop', 0, 0.7],
  ['frameRight', 0.7, 0.4],
  ['frameBottom', 1.1, 0.7],
  ['frameLeft', 1.8, 0.4],
];
const FRAME_DONE = 2.2;

const drawLine = {
  // Scaling both axes from the line's origin grows it along its length, whichever way it runs.
  hidden: { scaleX: 0, scaleY: 0 },
  visible: ({ delay, duration }) => ({ scaleX: 1, scaleY: 1, transition: { delay, duration, ease: 'linear' } }),
};
const lineGlow = {
  hidden: { opacity: 1 },
  visible: (offset) => ({ opacity: 0, transition: { delay: offset + FRAME_DONE + 0.2, duration: 1.2 } }),
};
// Tabler's rocket, traced stroke by stroke once the about frame has drawn.
const ROCKET_PATHS = [
  'M4 13a8 8 0 0 1 7 7a6 6 0 0 0 3 -5a9 9 0 0 0 6 -8a3 3 0 0 0 -3 -3a9 9 0 0 0 -8 6a6 6 0 0 0 -5 3',
  'M7 14a6 6 0 0 0 -3 6a6 6 0 0 0 6 -3',
  'M15 9m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0',
];
const traceRocket = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (i) => ({
    pathLength: 1, opacity: 1,
    transition: {
      pathLength: { delay: FRAME_DONE + 0.4 + i * 0.6, duration: i ? 0.8 : 1.6, ease: [0.45, 0, 0.25, 1] },
      opacity: { delay: FRAME_DONE + 0.4 + i * 0.6, duration: 0.01 },
    },
  }),
};
// Once traced, the rocket rumbles once like it's about to lift off.
const ROCKET_DRAWN = FRAME_DONE + 0.4 + 2 * 0.6 + 0.8;
const rumbleRocket = {
  hidden: { x: 0, y: 0, rotate: 0 },
  visible: {
    x: [0, -1.5, 1.5, -2, 2, -2.5, 2.5, -1.5, 1.5, 0],
    y: [0, 1, -1, 1, -1.5, 1, -2, 1, -1, 0],
    rotate: [0, -3, 3, -4, 4, -5, 5, -3, 3, 0],
    transition: { delay: ROCKET_DRAWN, duration: 0.9, ease: 'linear' },
  },
};

const fadeIn = {
  hidden: { opacity: 0, y: 16 },
  visible: (delay) => ({ opacity: 1, y: 0, transition: { delay, duration: 1, ease: [0.45, 0, 0.25, 1] } }),
};

// Selected-work cards slide in from off screen, from the side of the grid they sit on. The grid
// triggers them: a card parked off screen never counts as in view, so it can't trigger itself.
const MotionLink = motion(Link);
const slideIn = {
  hidden: ({ from }) => ({ x: from === 'left' ? '-100vw' : '100vw' }),
  visible: ({ delay = 0 }) => ({ x: 0, transition: { delay, duration: 1.6, ease: [0.45, 0, 0.25, 1] } }),
};

function FrameLine({ className, delay, duration, offset = 0 }) {
  return (
    <motion.span aria-hidden="true" className={`${styles.frameLine} ${className}`}
      variants={drawLine} custom={{ delay: offset + delay, duration }}>
      <motion.span className={styles.frameGlow} variants={lineGlow} custom={offset} />
    </motion.span>
  );
}

// The four border lines. Its parent needs position: relative and no CSS border of its own.
function Frame({ offset = 0 }) {
  return FRAME_LINES.map(([cls, delay, duration]) => (
    <FrameLine key={cls} className={styles[cls]} delay={delay} duration={duration} offset={offset} />
  ));
}

/* ─── SVG ICONS ────────────────────────────────────────── */
const ArrowRight = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M2 7h10M8 3l4 4-4 4" />
  </svg>
);

const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.259 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

/* ─── COMPONENT ────────────────────────────────────────── */
export default function CenterpointPage() {
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', service: '', timeline: '', message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setError('');
    try {
      await emailjs.send(EMAILJS.serviceId, EMAILJS.templateId, {
        name: `${form.firstName} ${form.lastName}`.trim(),
        email: form.email,
        message: [
          `Service: ${form.service || 'Not specified'}`,
          `Timeline: ${form.timeline || 'Not specified'}`,
          '',
          form.message,
        ].join('\n'),
      }, { publicKey: EMAILJS.publicKey });
      setSubmitted(true);
    } catch (err) {
      console.error('Consultation form failed to send:', err);
      setError('Something went wrong sending your message. Please try again, or call us at (773) 780-0098.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className={styles.root}>

      {/* ── NAV ── */}
      <SiteNav current="home" />

      {/* ── HERO ── */}
      <section className={styles.hero}>
        <div className={styles.heroBgNum}>CP</div>
        <div className={styles.heroLine} />
        <Reveal className={styles.heroLabel}>Digital agency for startups</Reveal>
        <Reveal as="h1" delay={0.15} className={styles.heroH1}
          aria-label="Transforming vision into digital reality.">
          Transforming<br />vision into<br />
          <ChromaType words={HERO_WORDS} />
        </Reveal>
        <Reveal delay={0.4} className={styles.heroFooter}>
          <p className={styles.heroSub}>
            We help startups and growing businesses ship websites, mobile apps, and
            AI-powered products — from brand identity to production RAG pipelines.
          </p>
          <div className={styles.heroCtaGroup}>
            <a href="#consult" className={styles.btnAmber}>Book a free call</a>
            <a href="#services" className={styles.btnOutline}>
              See services <ArrowRight />
            </a>
          </div>
          <div className={styles.heroStats}>
            {STATS.map((s, i) => (
              <Fragment key={s.num}>
                {i > 0 && <div className={styles.heroDivider} />}
                <div>
                  <div className={styles.heroStatNum}>
                    {s.num.replace(/(★|yr|\+)$/, '')}
                    <span style={{ color: 'var(--amber)' }}>
                      {s.num.match(/(★|yr|\+)$/)?.[0] ?? ''}
                    </span>
                  </div>
                  <div className={styles.heroStatLbl}>{s.lbl}</div>
                </div>
              </Fragment>
            ))}
          </div>
        </Reveal>
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
          <Reveal className={styles.servicesHead}>
            <div>
              <div className={styles.tag}>What we do</div>
              <h2 className={`${styles.h2} ${styles.h2Sans}`}>Six ways we<br />grow your business.</h2>
            </div>
            <p className={styles.sub}>
              Every service is built around one goal: shipping work that drives real growth.
            </p>
          </Reveal>
          {/* Each row reveals on its own as it scrolls into view. */}
          <div className={styles.svcList}>
            {SERVICES.map((s) => (
              <Reveal as="link" key={s.num} href={`/services/${s.slug}`} className={styles.svcRow}>
                <div className={styles.svcNum}>{s.num}</div>
                <div className={styles.svcName}>
                  {s.name}
                  <span className={styles.svcNameSub}>{s.sub}</span>
                </div>
                <div className={styles.svcArrow}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
                    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                    <path d="M2 7h10M8 3l4 4-4 4" />
                  </svg>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal className={styles.agencyTeaser}>
            <p>
              <strong>Agencies: we&apos;re your white-label dev team.</strong>{' '}
              AI features, extra front-end capacity, and project rescue, delivered under your brand.
            </p>
            <Link href="/for-agencies" className={styles.agencyLink}>For agencies →</Link>
          </Reveal>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section className={styles.sectionAlt} id="about">
        <div className={styles.max}>
          <motion.div className={styles.aboutGrid} initial="hidden" whileInView="visible"
            viewport={{ once: true, margin: '0px 0px -15% 0px' }}>
            <Frame />
            {/* Left */}
            <div className={styles.aboutLeft}>
              <FrameLine className={styles.aboutDivider} delay={0.35} duration={0.9} />
              <motion.div variants={fadeIn} custom={FRAME_DONE} className={styles.tag}>Our mission</motion.div>
              <motion.h2 variants={fadeIn} custom={FRAME_DONE} className={`${styles.h2} ${styles.h2Sans}`}>Built for<br />builders.</motion.h2>
              <motion.p variants={fadeIn} custom={FRAME_DONE + 0.6} className={styles.sub} style={{ marginTop: 20 }}>
                We started CenterPoint because great digital products shouldn't be out of reach
                for small businesses. We partner closely with founders to ship work that
                actually moves the needle.
              </motion.p>
              <motion.div variants={fadeIn} custom={FRAME_DONE + 0.8} className={styles.aboutNumRow}>
                {[['4wk', 'avg time to launch']].map(([big, lbl]) => (
                  <div key={lbl} className={styles.aboutNumCell}>
                    <div className={styles.aboutNumBig}>
                      {big.replace(/[+%yr wk]/g, '')}
                      <span>{big.match(/[+%yr wk]+/)?.[0] ?? ''}</span>
                    </div>
                    <div className={styles.aboutNumLbl}>{lbl}</div>
                  </div>
                ))}
                <div className={`${styles.aboutNumCell} ${styles.aboutNumIcon}`} aria-hidden="true">
                  <motion.svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" variants={rumbleRocket}>
                    {ROCKET_PATHS.map((d, i) => (
                      <motion.path key={d} d={d} variants={traceRocket} custom={i} />
                    ))}
                  </motion.svg>
                </div>
              </motion.div>
              <motion.div variants={fadeIn} custom={FRAME_DONE + 1} className={styles.aboutCta}>
                <a href="#consult" className={styles.btnAmber}>Contact us</a>
              </motion.div>
            </div>
            {/* Right */}
            <div className={styles.aboutRight}>
              <motion.div variants={fadeIn} custom={FRAME_DONE + 0.2} className={styles.tag}>How we work</motion.div>
              <motion.h2 variants={fadeIn} custom={FRAME_DONE + 0.2} className={`${styles.h2} ${styles.h2Sans}`} style={{ fontSize: 'clamp(34px,3.6vw,54px)' }}>
                Three things<br />we never<br />compromise on.
              </motion.h2>
              <motion.div variants={fadeIn} custom={FRAME_DONE + 0.8} className={styles.valList}>
                {VALUES.map((v) => (
                  <div key={v.title} className={styles.valRow}>
                    <div className={styles.valIcon}>→</div>
                    <div>
                      <div className={styles.valTitle}>{v.title}</div>
                      <div className={styles.valBody}>{v.body}</div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      {TESTIMONIALS.length > 0 && (
        <section className={styles.sectionTestimonials} id="testimonials">
          <div className={styles.max}>
            <Reveal>
              <div className={styles.tag}>Testimonials</div>
              <h2 className={styles.h2}>What our<br />clients say.</h2>
            </Reveal>
            <div className={styles.tGrid}>
              {TESTIMONIALS.map((t, i) => {
                // Side-by-side cards trace one after another, left to right.
                const offset = i * 0.3;
                return (
                  <motion.figure key={t.slug} className={styles.tCard} initial="hidden" whileInView="visible"
                    viewport={{ once: true, margin: '0px 0px -15% 0px' }}>
                    <Frame offset={offset} />
                    <motion.div variants={fadeIn} custom={offset + FRAME_DONE} className={styles.tStars} aria-label="5 out of 5 stars">★★★★★</motion.div>
                    <motion.blockquote variants={fadeIn} custom={offset + FRAME_DONE} className={styles.tQuote}>{t.quote}</motion.blockquote>
                    <motion.figcaption variants={fadeIn} custom={offset + FRAME_DONE + 0.4} className={styles.tFoot}>
                      <div>
                        <div className={styles.tName}>{t.name}</div>
                        <div className={styles.tRole}>{t.role} · {t.company}</div>
                      </div>
                      <Link href={`/work/${t.slug}`} className={styles.tLink}>
                        {t.project} <ArrowRight />
                      </Link>
                    </motion.figcaption>
                  </motion.figure>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── WORK ── */}
      <section className={styles.sectionWork} id="work">
        <div className={styles.max}>
          <Reveal className={styles.workHead}>
            <div>
              <div className={styles.tag}>Selected work</div>
              <h2 className={styles.h2}>Projects we're<br />proud of.</h2>
            </div>
            <Link href="/work" className={styles.btnOutline}>
              View all work <ArrowRight />
            </Link>
          </Reveal>
          <motion.div className={styles.workGrid} initial="hidden" whileInView="visible"
            viewport={{ once: true, margin: '0px 0px -10% 0px' }}>
            {/* Featured card */}
            <MotionLink href={`/work/${WORK[0].slug}`}
              variants={slideIn} custom={{ from: 'left' }}
              className={`${styles.workCard} ${styles.workCardTall}`}
              style={{ background: WORK[0].imgBg, '--card-bg': WORK[0].imgBg }}>
              {WORK[0].imgSrc
                ? <Image src={WORK[0].imgSrc} alt={WORK[0].name} fill style={{ objectFit: WORK[0].imgObjectFit ?? 'cover' }} />
                : <><div className={styles.workStripe} /><div className={styles.workPlaceholder}>{WORK[0].imgLabel}</div></>
              }
              <div className={styles.workOverlay}>
                <div className={styles.workTag}>{WORK[0].tag}</div>
                <div className={styles.workTitle}>{WORK[0].name}</div>
                <div className={styles.workDesc}>{WORK[0].desc}</div>
              </div>
            </MotionLink>
            {/* Stacked cards */}
            <div className={styles.workGridRight}>
              {WORK.slice(1).map((w, i) => (
                <MotionLink key={w.slug} href={`/work/${w.slug}`}
                  variants={slideIn} custom={{ from: 'right', delay: 0.2 + i * 0.2 }}
                  className={`${styles.workCard} ${styles.workCardShort}`}
                  style={{ background: w.imgBg, '--card-bg': w.imgBg }}>
                  {w.imgSrc
                    ? <Image src={w.imgSrc} alt={w.name} fill style={{ objectFit: w.imgObjectFit ?? 'cover' }} />
                    : <><div className={styles.workStripe} /><div className={styles.workPlaceholder}>{w.imgLabel}</div></>
                  }
                  <div className={styles.workOverlay}>
                    <div className={styles.workTag}>{w.tag}</div>
                    <div className={styles.workTitle}>{w.name}</div>
                    <div className={styles.workDesc}>{w.desc}</div>
                  </div>
                </MotionLink>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CENTER POINT MAP ── */}
      <CenterMap />

      {/* ── CONSULTATION FORM ── */}
      <section className={styles.sectionConsult} id="consult">
        <div className={styles.max}>
          <Reveal className={styles.captureOuter}>
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
                    fontFamily: 'var(--font-outfit,"Outfit",sans-serif)',
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
                      <input id="firstName" type="text" placeholder="Jane" required
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
                      <input id="email" type="email" placeholder="jane@startup.com" required
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
                        <option>AI &amp; RAG Application</option>
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
                    <button type="submit" className={styles.btnSubmit} disabled={sending}>
                      {sending ? 'Sending…' : 'Book My Free Consultation →'}
                    </button>
                    <p className={styles.submitNote}>
                      No credit card needed. 30-min call, zero commitment.
                    </p>
                  </div>
                  {error && (
                    <p role="alert" style={{ marginTop: 16, color: 'var(--amber)', fontSize: 14 }}>{error}</p>
                  )}
                </form>
              )}
            </div>
          </Reveal>
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
            <a className={styles.fPhone} href="tel:+17737800098">(773) 780-0098</a>
            <div className={styles.socialRow}>
              <a className={styles.soc} href="#" aria-label="Twitter"><TwitterIcon /></a>
              <a className={styles.soc} href="#" aria-label="LinkedIn"><LinkedInIcon /></a>
              <a className={styles.soc} href="#" aria-label="Instagram"><InstagramIcon /></a>
            </div>
          </div>
          <div className={styles.fCol}>
            <h4>Services</h4>
            <ul>
              {SERVICES.map((s) => (
                <li key={s.slug}><Link href={`/services/${s.slug}`}>{s.name}</Link></li>
              ))}
            </ul>
          </div>
          <div className={styles.fCol}>
            <h4>Company</h4>
            <ul>
              <li><a href="#about">About us</a></li>
              <li><Link href="/for-agencies">For agencies</Link></li>
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
