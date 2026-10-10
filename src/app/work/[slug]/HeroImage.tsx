'use client';

import Image from 'next/image';
import type { GalleryItem, Highlight, PageCapture } from '../projects';
import Lightbox, { useLightbox, type LightboxItem } from './Lightbox';
import { viewableItems } from './ProjectGallery';
import { highlightItems } from './Highlights';
import styles from './centerpointProject.module.css';

/**
 * The detail-page hero. Clicking it opens full-page captures of every page of
 * the site when the project has them (←/→ moves between pages); otherwise the
 * uncropped hero screenshot, positioned in the gallery so ←/→ walk the rest.
 */
export default function HeroImage({ src, alt, gallery, pages, highlights }: {
  src: string;
  alt: string;
  gallery: GalleryItem[];
  pages?: PageCapture[];
  /** Highlight screens (e.g. API/MCP) appended after the rest. */
  highlights?: Highlight[];
}) {
  const fromGallery = viewableItems(gallery);
  const hasPages = !!pages && pages.length > 0;
  const at = hasPages ? -1 : fromGallery.findIndex((it) => it.thumb === src);
  const base: LightboxItem[] = hasPages
    ? pages!.map((p) => ({ src: p.src, label: `${p.label} — full page`, fullPage: { width: p.width, height: p.height } }))
    : at >= 0 ? fromGallery : [{ src, label: alt }];
  const items = highlights?.length ? [...base, ...highlightItems(highlights)] : base;
  const lb = useLightbox(items);

  return (
    <>
      <button type="button" className={styles.heroImageButton} onClick={() => lb.open(Math.max(at, 0))}
        aria-label={`View full screenshot: ${alt}`}>
        <Image src={src} alt={alt} fill priority sizes="100vw" style={{ objectFit: 'cover', objectPosition: 'top center' }} />
      </button>
      <Lightbox items={items} index={lb.index} onClose={lb.close} onStep={lb.step} />
    </>
  );
}
