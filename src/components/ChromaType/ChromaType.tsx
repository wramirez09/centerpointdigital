'use client';

import { Fragment, useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * Typewriter that cycles through `words`: each phrase is typed letter by letter with a cream-to-amber
 * shimmer and glow, settles to amber, holds, deletes, and the next one types. Loops forever.
 * Adapted from the Framer "ChromaType" component, recoloured to the site palette; the font is
 * inherited from the heading it sits in.
 *
 * The first phrase is in the server HTML (for SEO / no-JS) and is retyped once mounted.
 * Reduced-motion users just see the first phrase.
 */

type Props = {
  words: string[];
  typeSpeed?: number;    // ms per letter typed
  deleteSpeed?: number;  // ms per letter deleted
  holdMs?: number;       // pause on a finished phrase
  startDelay?: number;   // ms before the first phrase starts typing
  spread?: number;       // shimmer offset between neighbouring letters, in degrees
  lines?: number;        // height reserved so the layout below never jumps
};

type Phase = 'typing' | 'hold' | 'deleting';

export default function ChromaType({
  words,
  typeSpeed = 110,
  deleteSpeed = 45,
  holdMs = 2200,
  startDelay = 700,
  spread = 36,
  lines = 2,
}: Props) {
  const reduceMotion = useReducedMotion();
  const [wordIndex, setWordIndex] = useState(0);
  const [len, setLen] = useState(words[0]?.length ?? 0);
  const [phase, setPhase] = useState<Phase>('hold');
  const [started, setStarted] = useState(false);
  const [shimmer, setShimmer] = useState(0);

  const word = words[wordIndex] ?? '';
  const shown = word.slice(0, Math.min(len, word.length));
  const live = started && !reduceMotion;

  // Clear the server-rendered phrase and type it in once the hero has faded in.
  useEffect(() => {
    if (reduceMotion || words.length === 0) return;
    const t = setTimeout(() => { setLen(0); setPhase('typing'); setStarted(true); }, startDelay);
    return () => clearTimeout(t);
  }, [reduceMotion, startDelay, words.length]);

  // Typing / holding / deleting state machine.
  useEffect(() => {
    if (!live) return;
    let t: ReturnType<typeof setTimeout>;
    if (phase === 'typing') {
      t = len < word.length
        ? setTimeout(() => setLen(l => l + 1), typeSpeed)
        : setTimeout(() => setPhase('hold'), 120);
    } else if (phase === 'hold') {
      t = setTimeout(() => setPhase('deleting'), holdMs);
    } else {
      t = len > 0
        ? setTimeout(() => setLen(l => l - 1), deleteSpeed)
        : setTimeout(() => { setWordIndex(i => (i + 1) % words.length); setPhase('typing'); }, 180);
    }
    return () => clearTimeout(t);
  }, [live, phase, len, word, typeSpeed, deleteSpeed, holdMs, words.length]);

  // Sweep the shimmer across the letters while they're landing.
  const chroma = live && phase === 'typing';
  useEffect(() => {
    if (!chroma) return;
    const id = setInterval(() => setShimmer(d => (d + 4) % 360), 50);
    return () => clearInterval(id);
  }, [chroma]);

  // Letter index across the whole phrase (spaces included) so the shimmer flows across words.
  const parts = shown.split(' ');
  const starts = parts.map((_, ci) => parts.slice(0, ci).reduce((n, w) => n + w.length + 1, 0));

  return (
    <span aria-hidden="true" style={{ display: 'block', minHeight: `${lines * 0.96}em` }}>
      {parts.map((chunk, ci) => (
        <Fragment key={`${wordIndex}-${ci}`}>
          {ci > 0 && ' '}
          {/* Keep each word together so lines never break mid-word. */}
          <span style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
            {Array.from(chunk).map((ch, k) => {
              const i = starts[ci] + k;
              // 0–100% cream mixed into amber, waving across the letters.
              const cream = Math.round(50 + 50 * Math.sin(((i * spread + shimmer) * Math.PI) / 180));
              const style = {
                display: 'inline-block',
                color: chroma ? `color-mix(in oklch, var(--text) ${cream}%, var(--amber))` : 'var(--amber)',
                textShadow: chroma ? '0 0 28px oklch(76% 0.18 72 / 0.45)' : 'none',
                transition: 'color 0.7s ease, text-shadow 0.7s ease',
              };
              return live ? (
                <motion.span
                  key={`${wordIndex}-${i}`}
                  initial={{ opacity: 0, y: '0.35em', filter: 'blur(6px)' }}
                  animate={{ opacity: 1, y: '0em', filter: 'blur(0px)' }}
                  transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                  style={style}
                >
                  {ch}
                </motion.span>
              ) : (
                <span key={`${wordIndex}-${i}`} style={style}>{ch}</span>
              );
            })}
          </span>
        </Fragment>
      ))}
      {live && <Caret />}
    </span>
  );
}

// Zero-width so it never pushes the text around.
function Caret() {
  return (
    <span style={{ position: 'relative', display: 'inline-block', width: 0 }}>
      <motion.span
        style={{
          position: 'absolute', left: '0.06em', bottom: '-0.06em',
          width: '0.07em', height: '0.82em', background: 'var(--amber)',
        }}
        animate={{ opacity: [1, 1, 0, 0] }}
        transition={{ duration: 1.1, repeat: Infinity, times: [0, 0.55, 0.55, 1] }}
      />
    </span>
  );
}
