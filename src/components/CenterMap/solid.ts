/**
 * Turns the solids recorded while the scene was drawn (boxes, gabled and
 * sawtooth roofs, tapered shafts, cylinders and lofted stadium decks) into one
 * flat-shaded mesh for the "Solid" view.
 */
import type * as ThreeModule from 'three';
import type { RGB } from './scene';

type V = readonly [number, number, number];

export type Solid =
  | { kind: 'box'; x0: number; x1: number; z0: number; z1: number; y0: number; y1: number; color: RGB }
  /** Roof with its ridge along z at x = rx; rx at an edge makes one sawtooth. */
  | { kind: 'gable'; x0: number; x1: number; z0: number; z1: number; y0: number; y1: number; rx: number; color: RGB }
  /** Tapered rectangular shaft: half-sizes at the base (bx, bz) and the top (tx, tz). */
  | { kind: 'frustum'; cx: number; cz: number; bx: number; bz: number; tx: number; tz: number; y0: number; y1: number; color: RGB }
  | { kind: 'cyl'; cx: number; cz: number; r0: number; r1: number; y0: number; y1: number; seg: number; color: RGB }
  /** A surface through rows of points; every row has the same number of points. */
  | { kind: 'loft'; rows: V[][]; color: RGB };

// Tones are picked by eye in sRGB; the renderer expects linear vertex colors.
const linear = (c: RGB): RGB => [c[0] ** 2.2, c[1] ** 2.2, c[2] ** 2.2];

export function buildSolidGeometry(THREE: typeof ThreeModule, solids: Solid[]) {
  const pos: number[] = [];
  const col: number[] = [];
  let color: RGB = [0, 0, 0];
  const tri = (a: V, b: V, c: V) => {
    pos.push(...a, ...b, ...c);
    col.push(...color, ...color, ...color);
  };
  const quad = (a: V, b: V, c: V, d: V) => {
    tri(a, b, c);
    tri(a, c, d);
  };

  for (const s of solids) {
    color = linear(s.color);
    switch (s.kind) {
      case 'box': {
        const { x0, x1, z0, z1, y0, y1 } = s;
        quad([x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]);
        quad([x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0]);
        quad([x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]);
        quad([x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [x0, y1, z0]);
        quad([x1, y0, z0], [x1, y0, z1], [x1, y1, z1], [x1, y1, z0]);
        break;
      }
      case 'gable': {
        const { x0, x1, z0, z1, y0, y1, rx } = s;
        tri([x0, y0, z0], [x1, y0, z0], [rx, y1, z0]);
        tri([x0, y0, z1], [x1, y0, z1], [rx, y1, z1]);
        if (rx > x0) quad([x0, y0, z0], [rx, y1, z0], [rx, y1, z1], [x0, y0, z1]);
        if (rx < x1) quad([rx, y1, z0], [x1, y0, z0], [x1, y0, z1], [rx, y1, z1]);
        break;
      }
      case 'frustum': {
        const { cx, cz, bx, bz, tx, tz, y0, y1 } = s;
        const lo: V[] = [[cx - bx, y0, cz - bz], [cx + bx, y0, cz - bz], [cx + bx, y0, cz + bz], [cx - bx, y0, cz + bz]];
        const hi: V[] = [[cx - tx, y1, cz - tz], [cx + tx, y1, cz - tz], [cx + tx, y1, cz + tz], [cx - tx, y1, cz + tz]];
        for (let k = 0; k < 4; k++) quad(lo[k], lo[(k + 1) % 4], hi[(k + 1) % 4], hi[k]);
        quad(hi[0], hi[1], hi[2], hi[3]);
        break;
      }
      case 'cyl': {
        const { cx, cz, r0, r1, y0, y1, seg } = s;
        for (let k = 0; k < seg; k++) {
          const a = (k / seg) * Math.PI * 2;
          const b = ((k + 1) / seg) * Math.PI * 2;
          const p = (r: number, ang: number, y: number): V => [cx + Math.cos(ang) * r, y, cz + Math.sin(ang) * r];
          quad(p(r0, a, y0), p(r0, b, y0), p(r1, b, y1), p(r1, a, y1));
          if (r1 > 0) tri([cx, y1, cz], p(r1, a, y1), p(r1, b, y1));
        }
        break;
      }
      case 'loft': {
        for (let i = 0; i < s.rows.length - 1; i++) {
          const a = s.rows[i];
          const b = s.rows[i + 1];
          for (let j = 0; j < a.length - 1; j++) quad(a[j], a[j + 1], b[j + 1], b[j]);
        }
        break;
      }
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  // Unindexed, so this gives every face its own flat normal.
  geometry.computeVertexNormals();
  return geometry;
}
