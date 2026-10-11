import styles from './centerpointProject.module.css';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import SiteNav from '@/components/SiteNav/SiteNav';
import CtaBand from '@/components/CtaBand/CtaBand';
import SiteFooter from '@/components/SiteFooter/SiteFooter';
import Image from 'next/image';
import PROJECTS from '../projects';
import ProjectGallery from './ProjectGallery';
import HeroImage from './HeroImage';
import BeforeAfter from './BeforeAfter';
import Highlights from './Highlights';
import { Reveal, Stagger, StaggerItem } from '@/components/Reveal/Reveal';
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
      <SiteNav current="project" slug={params.slug} />

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
        <Reveal className={styles.heroTag}>{tag}</Reveal>
        <Reveal delay={0.15} className={styles.heroTop}>
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
        </Reveal>
        <Reveal delay={0.3} className={styles.heroImage} style={{ background: imgBg }}>
          {heroImgSrc
            ? <HeroImage src={heroImgSrc} alt={heroImgAlt} gallery={gallery} pages={heroPages} highlights={highlights?.items} />
            : <><div className={styles.heroStripe} /><div className={styles.heroPlaceholder}>{heroImgAlt}</div></>
          }
        </Reveal>
      </div>

      {/* ── RESULTS BAR ── */}
      {results && results.length > 0 && (
        <div className={styles.resultsBar}>
          <Stagger className={styles.resultsInner}>
            {results.map(r => (
              <StaggerItem key={r.lbl} className={styles.resultCell}>
                <div className={styles.resultNum}>{r.num}</div>
                <div className={styles.resultLbl}>{r.lbl}</div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      )}

      {/* ── OVERVIEW ── */}
      <div className={styles.contentBody}>
        <Reveal className={styles.contentGrid}>
          <div>
            <div className={styles.sidebarHeading}>Overview</div>
            <p className={styles.sidebarText}>{overview.sidebar}</p>
          </div>
          <div>
            <h2 className={styles.contentH2}>{overview.heading}</h2>
            {overview.body.map((p, i) => <p key={i} className={styles.contentP}>{p}</p>)}
          </div>
        </Reveal>
      </div>

      <hr className={styles.divider} />

      {/* ── HIGHLIGHTS ── */}
      {highlights && highlights.items.length > 0 && (
        <>
          <Reveal className={styles.gallerySection} style={{ paddingTop: 96 }}>
            <div className={styles.galleryLabel}>{highlights.label}</div>
            <h2 className={styles.contentH2} style={{ maxWidth: 760, marginBottom: 48 }}>{highlights.heading}</h2>
            <Highlights highlights={highlights.items} />
          </Reveal>
          <hr className={styles.divider} />
        </>
      )}

      {/* ── BEFORE / AFTER ── */}
      {comparisons && comparisons.length > 0 && (
        <>
          <Reveal className={styles.gallerySection} style={{ paddingTop: 96 }}>
            <div className={styles.galleryLabel}>Before &amp; after</div>
            <BeforeAfter comparisons={comparisons} />
          </Reveal>
          <hr className={styles.divider} />
        </>
      )}

      {/* ── GALLERY ── */}
      <Reveal className={styles.gallerySection} style={{ paddingTop: 96 }}>
        <div className={styles.galleryLabel}>Screens</div>
        <ProjectGallery gallery={gallery} />
      </Reveal>

      {/* ── CHALLENGE ── */}
      {challenge && (
        <>
          <div className={styles.contentBody} style={{ paddingTop: 0 }}>
            <Reveal className={styles.contentGrid}>
              <div>
                <div className={styles.sidebarHeading}>The challenge</div>
                <p className={styles.sidebarText}>{challenge.sidebar}</p>
              </div>
              <div>
                <h2 className={styles.contentH2}>{challenge.heading}</h2>
                {challenge.body.map((p, i) => <p key={i} className={styles.contentP}>{p}</p>)}
              </div>
            </Reveal>
          </div>

          <hr className={styles.divider} />
        </>
      )}

      {/* ── PROCESS ── */}
      {process && process.length > 0 && (
        <div className={styles.processSection}>
          <Reveal>
            <div className={styles.heroTag}>How we worked</div>
            <h2 className={styles.contentH2} style={{ maxWidth: 600 }}>
              {timeline ? `A ${timeline} process built for speed and quality.` : 'A process built for speed and quality.'}
            </h2>
          </Reveal>
          <Stagger className={styles.processSteps}>
            {process.map(step => (
              <StaggerItem key={step.period} className={styles.processStep}>
                <div className={styles.stepNum}>{step.period}</div>
                <div className={styles.stepTitle}>{step.title}</div>
                <div className={styles.stepBody}>{step.body}</div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      )}

      {/* ── TESTIMONIAL ── */}
      {testimonial && (
        <div className={styles.testimonialSection}>
          <Reveal className={styles.testimonialInner}>
            <div>
              <div className={styles.tWho}>{testimonial.name}</div>
              <div className={styles.tRole}>{testimonial.role}</div>
              <div className={styles.tCompany}>{testimonial.company}</div>
              <div className={styles.tStars}>★★★★★</div>
            </div>
            <div className={styles.testimonialQuote}>{testimonial.quote}</div>
          </Reveal>
        </div>
      )}

      {/* ── NEXT PROJECT ── */}
      {nextProject && (
        <Reveal className={styles.nextProject}>
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
        </Reveal>
      )}

      {/* ── CTA ── */}
      <CtaBand
        title={<>Want results<br />like <em>these?</em></>}
        text="Book a free 30-minute call and let's talk about what you're building."
      />

      {/* ── FOOTER ── */}
      <SiteFooter />

    </div>
  );
}
