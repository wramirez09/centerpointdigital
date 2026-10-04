import styles from './centerpointProject.module.css';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import MobileMenu from '@/components/MobileMenu/MobileMenu';
import Image from 'next/image';
import PROJECTS from '../projects';
import ProjectGallery from './ProjectGallery';
import HeroImage from './HeroImage';
import BeforeAfter from './BeforeAfter';
import Highlights from './Highlights';
import type { Metadata } from 'next';

export async function generateStaticParams() {
  return PROJECTS.map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const project = PROJECTS.find(p => p.slug === params.slug);
  if (!project) return {};
  return {
    title: `${project.title.join(' ')} — CenterPoint Digital`,
    description: project.overview.sidebar,
  };
}

function LogoIcon() {
  return (
    <svg viewBox="0 0 12 12" width="12" height="12">
      <circle cx="6" cy="6" r="2.5" fill="currentColor" />
      <circle cx="6" cy="6" r="5" fill="none" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const project = PROJECTS.find(p => p.slug === params.slug);
  if (!project) notFound();

  const {
    title, tag, client, year, timeline, services,
    imgBg, heroImgSrc, heroImgAlt, heroPages, status, comparisons, highlights, results,
    overview, challenge, gallery,
    process, testimonial, nextProject,
  } = project;
  // The next card borrows the target project's card image.
  const nextImgSrc = nextProject && PROJECTS.find(p => p.slug === nextProject.slug)?.imgSrc;

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
          <li><Link href="/work">Work</Link></li>
          <li><a href="/#about">About</a></li>
        </ul>
        <Link href="/#consult" className={styles.navCta}>Free Consultation</Link>
        <MobileMenu current="project" slug={params.slug} />
      </nav>

      {/* ── BREADCRUMB ── */}
      <div className={styles.breadcrumb}>
        <Link href="/">Home</Link>
        <span className={styles.breadcrumbSep}>/</span>
        <Link href="/work">Work</Link>
        <span className={styles.breadcrumbSep}>/</span>
        <span className={styles.breadcrumbCurrent}>{title[0]}</span>
      </div>

      {/* ── HERO ── */}
      <div className={styles.projectHero}>
        <div className={styles.heroTag}>{tag}</div>
        <div className={styles.heroTop}>
          <h1 className={styles.projectTitle}>
            {title.map((line, i) => (
              <span key={i}>
                {i === title.length - 1 ? <em>{line}</em> : <>{line}<br /></>}
              </span>
            ))}
          </h1>
          <div className={styles.heroMeta}>
            {([['Client', client], ['Status', status], ['Year', year], ['Timeline', timeline]] as const).filter(([, val]) => val).map(([lbl, val]) => (
              <div key={lbl}>
                <div className={styles.metaItemLabel}>{lbl}</div>
                <div className={styles.metaItemVal}>{val}</div>
              </div>
            ))}
            <div>
              <div className={styles.metaItemLabel}>Services</div>
              <div className={styles.metaTags}>
                {services.map(s => <span key={s} className={styles.metaTag}>{s}</span>)}
              </div>
            </div>
          </div>
        </div>
        <div className={styles.heroImage} style={{ background: imgBg }}>
          {heroImgSrc
            ? <HeroImage src={heroImgSrc} alt={heroImgAlt} gallery={gallery} pages={heroPages} highlights={highlights?.items} />
            : <><div className={styles.heroStripe} /><div className={styles.heroPlaceholder}>{heroImgAlt}</div></>
          }
        </div>
      </div>

      {/* ── RESULTS BAR ── */}
      {results && results.length > 0 && (
        <div className={styles.resultsBar}>
          <div className={styles.resultsInner}>
            {results.map(r => (
              <div key={r.lbl} className={styles.resultCell}>
                <div className={styles.resultNum}>{r.num}</div>
                <div className={styles.resultLbl}>{r.lbl}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── OVERVIEW ── */}
      <div className={styles.contentBody}>
        <div className={styles.contentGrid}>
          <div>
            <div className={styles.sidebarHeading}>Overview</div>
            <p className={styles.sidebarText}>{overview.sidebar}</p>
          </div>
          <div>
            <h2 className={styles.contentH2}>{overview.heading}</h2>
            {overview.body.map((p, i) => <p key={i} className={styles.contentP}>{p}</p>)}
          </div>
        </div>
      </div>

      <hr className={styles.divider} />

      {/* ── HIGHLIGHTS ── */}
      {highlights && highlights.items.length > 0 && (
        <>
          <div className={styles.gallerySection} style={{ paddingTop: 96 }}>
            <div className={styles.galleryLabel}>{highlights.label}</div>
            <h2 className={styles.contentH2} style={{ maxWidth: 760, marginBottom: 48 }}>{highlights.heading}</h2>
            <Highlights highlights={highlights.items} />
          </div>
          <hr className={styles.divider} />
        </>
      )}

      {/* ── BEFORE / AFTER ── */}
      {comparisons && comparisons.length > 0 && (
        <>
          <div className={styles.gallerySection} style={{ paddingTop: 96 }}>
            <div className={styles.galleryLabel}>Before &amp; after</div>
            <BeforeAfter comparisons={comparisons} />
          </div>
          <hr className={styles.divider} />
        </>
      )}

      {/* ── GALLERY ── */}
      <div className={styles.gallerySection} style={{ paddingTop: 96 }}>
        <div className={styles.galleryLabel}>Screens</div>
        <ProjectGallery gallery={gallery} />
      </div>

      {/* ── CHALLENGE ── */}
      {challenge && (
        <>
          <div className={styles.contentBody} style={{ paddingTop: 0 }}>
            <div className={styles.contentGrid}>
              <div>
                <div className={styles.sidebarHeading}>The challenge</div>
                <p className={styles.sidebarText}>{challenge.sidebar}</p>
              </div>
              <div>
                <h2 className={styles.contentH2}>{challenge.heading}</h2>
                {challenge.body.map((p, i) => <p key={i} className={styles.contentP}>{p}</p>)}
              </div>
            </div>
          </div>

          <hr className={styles.divider} />
        </>
      )}

      {/* ── PROCESS ── */}
      {process && process.length > 0 && (
        <div className={styles.processSection}>
          <div className={styles.heroTag}>How we worked</div>
          <h2 className={styles.contentH2} style={{ maxWidth: 600 }}>
            {timeline ? `A ${timeline} process built for speed and quality.` : 'A process built for speed and quality.'}
          </h2>
          <div className={styles.processSteps}>
            {process.map(step => (
              <div key={step.period} className={styles.processStep}>
                <div className={styles.stepNum}>{step.period}</div>
                <div className={styles.stepTitle}>{step.title}</div>
                <div className={styles.stepBody}>{step.body}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TESTIMONIAL ── */}
      {testimonial && (
        <div className={styles.testimonialSection}>
          <div className={styles.testimonialInner}>
            <div>
              <div className={styles.tWho}>{testimonial.name}</div>
              <div className={styles.tRole}>{testimonial.role}</div>
              <div className={styles.tCompany}>{testimonial.company}</div>
              <div className={styles.tStars}>★★★★★</div>
            </div>
            <div className={styles.testimonialQuote}>{testimonial.quote}</div>
          </div>
        </div>
      )}

      {/* ── NEXT PROJECT ── */}
      {nextProject && (
        <div className={styles.nextProject}>
          <div className={styles.nextLabel}>Next project</div>
          <Link href={`/work/${nextProject.slug}`} className={styles.nextCard}>
            <div className={styles.nextImg} style={{ background: nextProject.imgBg }}>
              {nextImgSrc
                ? <Image src={nextImgSrc} alt={nextProject.title} fill sizes="(max-width: 960px) 100vw, 50vw" style={{ objectFit: 'cover', objectPosition: 'top center' }} />
                : <><div className={styles.nextImgStripe} /><div className={styles.nextImgLabel}>Project preview</div></>
              }
            </div>
            <div className={styles.nextInfo}>
              <div>
                <div className={styles.nextTag}>{nextProject.tag}</div>
                <div className={styles.nextTitle}>{nextProject.title}</div>
                <div className={styles.nextDesc}>{nextProject.desc}</div>
              </div>
              <div className={styles.nextArrow}>
                View project
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
                  stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <path d="M2 8h12M10 4l4 4-4 4" />
                </svg>
              </div>
            </div>
          </Link>
        </div>
      )}

      {/* ── CTA ── */}
      <div className={styles.ctaSection}>
        <div className={styles.ctaInner}>
          <div>
            <h2 className={styles.ctaH2}>
              Want results<br />like <em>these?</em>
            </h2>
            <p className={styles.ctaP}>
              Book a free 30-minute call and let's talk about what you're building.
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
