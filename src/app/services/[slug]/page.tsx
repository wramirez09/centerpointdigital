import projectStyles from '../../work/[slug]/centerpointProject.module.css';
import styles from './centerpointService.module.css';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import SiteNav from '@/components/SiteNav/SiteNav';
import CtaBand from '@/components/CtaBand/CtaBand';
import SiteFooter from '@/components/SiteFooter/SiteFooter';
import { Reveal, Stagger, StaggerItem } from '@/components/Reveal/Reveal';
import SERVICES from '../services';
import PROJECTS from '../../work/projects';
import type { Metadata } from 'next';

export async function generateStaticParams() {
  return SERVICES.map(s => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const service = SERVICES.find(s => s.slug === params.slug);
  if (!service) return {};
  return {
    title: `${service.name} — CenterPoint Digital`,
    description: service.intro,
  };
}

function ArrowRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M2 7h10M8 3l4 4-4 4" />
    </svg>
  );
}

export default function ServicePage({ params }: { params: { slug: string } }) {
  const service = SERVICES.find(s => s.slug === params.slug);
  if (!service) notFound();

  const { num, name, title, intro, bestFor, overview, offerings, process, stack, workSlugs, faqs } = service;
  const work = workSlugs.map(slug => PROJECTS.find(p => p.slug === slug)).filter(p => p !== undefined);
  const others = SERVICES.filter(s => s.slug !== service.slug);
  // Merged so the shared project-page classes and this page's own classes read the same.
  const s = { ...projectStyles, ...styles };

  return (
    <div className={s.root}>

      {/* ── NAV ── */}
      <SiteNav current="service" slug={params.slug} />

      {/* ── BREADCRUMB ── */}
      <div className={s.breadcrumb}>
        <Link href="/">Home</Link>
        <span className={s.breadcrumbSep}>/</span>
        <a href="/#services">Services</a>
        <span className={s.breadcrumbSep}>/</span>
        <span className={s.breadcrumbCurrent}>{name}</span>
      </div>

      {/* ── HERO ── */}
      <div className={s.serviceHero}>
        <Reveal className={s.heroTag}>Service {num} · {name}</Reveal>
        <div className={`${s.heroTop} ${s.serviceHeroTop}`}>
          <Reveal delay={0.15}>
            <h1 className={s.projectTitle}>
              {title.map((line, i) => (
                <span key={i}>
                  {i === title.length - 1 ? <em>{line}</em> : <>{line}<br /></>}
                </span>
              ))}
            </h1>
            <p className={s.heroIntro}>{intro}</p>
            <div className={s.heroCtas}>
              <a href="/#consult" className={s.btnAmber}>Book a free call →</a>
              {work.length > 0 && (
                <a href="#work" className={s.btnOutline}>See the work <ArrowRight /></a>
              )}
            </div>
          </Reveal>
          <Reveal delay={0.3} className={`${s.heroMeta} ${s.serviceHeroMeta}`}>
            <div>
              <div className={s.metaItemLabel}>Best for</div>
              <ul className={s.bestFor}>
                {bestFor.map(b => <li key={b}>{b}</li>)}
              </ul>
            </div>
            <div>
              <div className={s.metaItemLabel}>Tools &amp; stack</div>
              <div className={s.metaTags}>
                {stack.map(t => <span key={t} className={s.metaTag}>{t}</span>)}
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* ── OVERVIEW ── */}
      <div className={s.contentBody}>
        <Reveal className={s.contentGrid} style={{ marginBottom: 0 }}>
          <div>
            <div className={s.sidebarHeading}>Overview</div>
            <p className={s.sidebarText}>{overview.sidebar}</p>
          </div>
          <div>
            <h2 className={s.contentH2}>{overview.heading}</h2>
            {overview.body.map((p, i) => <p key={i} className={s.contentP}>{p}</p>)}
          </div>
        </Reveal>
      </div>

      {/* ── WHAT'S INCLUDED ── */}
      <div className={s.offeringsSection}>
        <div className={s.offeringsInner}>
          <Reveal>
            <div className={s.heroTag}>What&apos;s included</div>
            <h2 className={s.contentH2} style={{ maxWidth: 640 }}>Everything you need, handled by one team.</h2>
          </Reveal>
          <Stagger className={s.offeringsGrid}>
            {offerings.map((o, i) => (
              <StaggerItem key={o.title} className={s.offering}>
                <div className={s.stepNum}>{String(i + 1).padStart(2, '0')}</div>
                <div className={s.stepTitle}>{o.title}</div>
                <div className={s.stepBody}>{o.body}</div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>

      {/* ── PROCESS ── */}
      <div className={s.processSection}>
        <Reveal>
          <div className={s.heroTag}>How it works</div>
          <h2 className={s.contentH2} style={{ maxWidth: 600 }}>A clear process, from first call to launch.</h2>
        </Reveal>
        <Stagger className={s.processSteps}>
          {process.map(step => (
            <StaggerItem key={step.title} className={s.processStep}>
              <div className={s.stepNum}>{step.period}</div>
              <div className={s.stepTitle}>{step.title}</div>
              <div className={s.stepBody}>{step.body}</div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>

      {/* ── RELATED WORK ── */}
      {work.length > 0 && (
        <>
          <hr className={s.divider} />
          <div className={s.processSection} id="work">
            <Reveal>
              <div className={s.heroTag}>Related work</div>
              <h2 className={s.contentH2} style={{ maxWidth: 600 }}>
                {name} we&apos;ve shipped.
              </h2>
            </Reveal>
            <Stagger className={s.workGrid}>
              {work.map(p => (
                <StaggerItem as="link" key={p.slug} href={`/work/${p.slug}`} className={s.workCard}>
                  <div className={s.workImg} style={{ background: p.imgBg }}>
                    {p.imgSrc
                      ? <Image src={p.imgSrc} alt={p.name} fill sizes="(max-width: 960px) 100vw, 33vw"
                          style={{ objectFit: p.imgObjectFit ?? 'cover', objectPosition: 'top center' }} />
                      : <><div className={s.nextImgStripe} /><div className={s.nextImgLabel}>{p.imgLabel}</div></>
                    }
                    {p.comingSoon && <span className={s.workBadge}>Coming soon</span>}
                  </div>
                  <div className={s.workInfo}>
                    <div className={s.nextTag}>{p.tag}</div>
                    <div className={s.workTitle}>{p.name}</div>
                    <div className={s.workDesc}>{p.desc}</div>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </>
      )}

      {/* ── FAQ ── */}
      <div className={s.testimonialSection}>
        <Reveal className={s.testimonialInner}>
          <div>
            <div className={s.sidebarHeading}>FAQ</div>
            <h2 className={s.contentH2}>Common questions.</h2>
          </div>
          <div className={s.faqList}>
            {faqs.map(f => (
              <details key={f.q} className={s.faq}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </Reveal>
      </div>

      {/* ── OTHER SERVICES ── */}
      <div className={s.processSection}>
        <Reveal className={s.nextLabel}>Other services</Reveal>
        <Stagger className={s.otherList}>
          {others.map(o => (
            <StaggerItem as="link" key={o.slug} href={`/services/${o.slug}`} className={s.otherRow}>
              <span className={s.otherNum}>{o.num}</span>
              <span className={s.otherName}>
                {o.name}
                <span className={s.otherSub}>{o.sub}</span>
              </span>
              <span className={s.otherArrow}><ArrowRight /></span>
            </StaggerItem>
          ))}
        </Stagger>
      </div>

      {/* ── CTA ── */}
      <CtaBand
        title={<>Ready to get<br /><em>started?</em></>}
        text="Book a free 30-minute call and let's talk about what you're building."
      />

      {/* ── FOOTER ── */}
      <SiteFooter />

    </div>
  );
}
