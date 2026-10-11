'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { motion, type Variants } from 'framer-motion';

/**
 * Scroll-in animations. Each renders the element itself (no wrapper div), so className
 * and grid/flex layouts keep working:
 *   <Reveal as="section" className={...}>        fades, slides up and scales in when it scrolls into view
 *   <Reveal delay={0.25}>                         same, a beat later
 *   <Stagger className={grid}>                    reveals its <StaggerItem> children one after another
 *     <StaggerItem as="link" href="/x">…</StaggerItem>
 *   </Stagger>
 * Reduced-motion users get a plain fade (MotionConfig reducedMotion="user" in providers).
 */

// Ease-in-out so elements drift into place instead of snapping.
const EASE = [0.45, 0, 0.25, 1];
const VIEWPORT = { once: true, margin: '0px 0px -8% 0px' } as const;

const TAGS = {
  div: motion.div,
  section: motion.section,
  header: motion.header,
  figure: motion.figure,
  p: motion.p,
  h1: motion.h1,
  h2: motion.h2,
  link: motion(Link),
};

type Props = {
  as?: keyof typeof TAGS;
  children?: ReactNode;
  className?: string;
  [prop: string]: any;
};

const item: Variants = {
  hidden: { opacity: 0, y: 80, scale: 0.95 },
  // An explicit delay would override the parent's stagger delay, so only set it when given.
  visible: (delay?: number) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 1.6, ease: EASE, ...(delay ? { delay } : {}) },
  }),
};

const group: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.2 } },
};

export function Reveal({ as = 'div', delay, ...props }: Props & { delay?: number }) {
  const Comp: any = TAGS[as];
  return <Comp initial="hidden" whileInView="visible" viewport={VIEWPORT} variants={item} custom={delay} {...props} />;
}

export function Stagger({ as = 'div', ...props }: Props) {
  const Comp: any = TAGS[as];
  return <Comp initial="hidden" whileInView="visible" viewport={VIEWPORT} variants={group} {...props} />;
}

export function StaggerItem({ as = 'div', ...props }: Props) {
  const Comp: any = TAGS[as];
  return <Comp variants={item} {...props} />;
}
