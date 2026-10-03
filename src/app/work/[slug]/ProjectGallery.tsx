'use client';

import Image from 'next/image';
import type { GalleryItem } from '../projects';
import Lightbox, { useLightbox, type LightboxItem } from './Lightbox';
import styles from './centerpointProject.module.css';

/** Gallery entries that can open in the lightbox; placeholders stay inert. */
export function viewableItems(gallery: GalleryItem[]): LightboxItem[] {
  return gallery.flatMap((g) => (g.src ? [{ src: g.src, label: g.label }] : []));
}

function Thumb({ img, className, onOpen }: { img: GalleryItem; className: string; onOpen?: () => void }) {
  if (!img.src) {
    return (
      <div className={className} style={{ background: img.bg }}>
        <div className={styles.gStripe} /><div className={styles.gLabel}>{img.label}</div>
      </div>
    );
  }
  return (
    <button type="button" className={`${className} ${styles.galleryButton}`} style={{ background: img.bg }}
      onClick={onOpen} aria-label={`View larger: ${img.label}`}>
      <Image src={img.src} alt={img.label} fill sizes="(max-width: 960px) 100vw, 50vw"
        style={{ objectFit: 'cover', objectPosition: 'top center', transition: 'transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94)' }} />
    </button>
  );
}

export default function ProjectGallery({ gallery }: { gallery: GalleryItem[] }) {
  const items = viewableItems(gallery);
  const lb = useLightbox(items);

  return (
    <>
      <div className={styles.galleryGrid}>
        {gallery.map((img, i) => (
          <Thumb key={i} img={img} onOpen={() => lb.open(items.findIndex((it) => it.src === img.src))}
            // Odd count: the first screen spans the row so the grid ends even.
            className={`${styles.galleryImg} ${i === 0 && gallery.length % 2 === 1 ? styles.galleryImgSpan : ''}`} />
        ))}
      </div>
      <Lightbox items={items} index={lb.index} onClose={lb.close} onStep={lb.step} />
    </>
  );
}
