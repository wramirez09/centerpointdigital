/**
 * Shape records and the code that turns them into meshes. The scene modules
 * push plain records (boxes, roofs, tubes, ribbons...) into one list; this file
 * turns that list into two flat-shaded geometries: one lit by the scene lights
 * and one that glows (lit windows, lamps, signs).
 */
import type * as ThreeModule from 'three';

export type RGB = readonly [number, number, number];
export type V = readonly [number, number, number];
type P2 = readonly [number, number];

type Common = { color: RGB; glow?: boolean };

export type Solid = Common & (
  | { kind: 'box'; x0: number; x1: number; z0: number; z1: number; y0: number; y1: number }
  /** Roof with its ridge along z at x = rx; rx at an edge makes one sawtooth. */
  | { kind: 'gable'; x0: number; x1: number; z0: number; z1: number; y0: number; y1: number; rx: number }
  /** Tapered rectangular shaft: half-sizes at the base (bx, bz) and the top (tx, tz). */
  | { kind: 'frustum'; cx: number; cz: number; bx: number; bz: number; tx: number; tz: number; y0: number; y1: number }
  /** Cylinder or cone; `sz` stretches it along z into an ellipse. */
  | { kind: 'cyl'; cx: number; cz: number; r0: number; r1: number; y0: number; y1: number; seg: number; sz?: number }
  /** A surface through rows of points; every row has the same number of points. */
  | { kind: 'loft'; rows: V[][] }
  /** Flat strip along a path in plan (x, z); with `thick` it becomes a slab, for elevated decks. */
  | { kind: 'ribbon'; pts: P2[]; width: number; y: number; thick?: number }
  /** Flat polygon in plan at height y. */
  | { kind: 'poly'; pts: P2[]; y: number }
  /** Square-section tube along a 3D path: poles, rails, antennas, wheels. */
  | { kind: 'tube'; pts: V[]; r: number }
  /** Low-poly ellipsoid: tree crowns, domes, the Bean. */
  | { kind: 'ball'; cx: number; cy: number; cz: number; rx: number; ry: number; rz: number }
  /** Upright rectangle facing along x or z: windows, signs, clock faces. */
  | { kind: 'quad'; cx: number; cy: number; cz: number; axis: 'x' | 'z'; w: number; h: number }
);

// Tones are picked by eye in sRGB; the renderer expects linear vertex colors.
const linear = (c: RGB): RGB => [c[0] ** 2.2, c[1] ** 2.2, c[2] ** 2.2];

const sub = (a: V, b: V): V => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const cross = (a: V, b: V): V => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = (a: V, len = 1): V => {
  const l = Math.hypot(a[0], a[1], a[2]) || 1;
  return [(a[0] / l) * len, (a[1] / l) * len, (a[2] / l) * len];
};
const add = (...vs: V[]): V => vs.reduce<V>((s, v) => [s[0] + v[0], s[1] + v[1], s[2] + v[2]], [0, 0, 0]);

export function buildSolidGeometry(THREE: typeof ThreeModule, solids: Solid[]) {
  const buckets = { lit: { pos: [] as number[], col: [] as number[] }, glow: { pos: [] as number[], col: [] as number[] } };
  let out = buckets.lit;
  let color: RGB = [0, 0, 0];
  const tri = (a: V, b: V, c: V) => {
    out.pos.push(...a, ...b, ...c);
    out.col.push(...color, ...color, ...color);
  };
  const quad = (a: V, b: V, c: V, d: V) => {
    tri(a, b, c);
    tri(a, c, d);
  };

  for (const s of solids) {
    // Glowing colors are used as-is: they are light sources, not lit surfaces.
    color = s.glow ? s.color : linear(s.color);
    out = s.glow ? buckets.glow : buckets.lit;
    switch (s.kind) {
      case 'box': {
        const { x0, x1, z0, z1, y0, y1 } = s;
        quad([x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]);
        quad([x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0]);
        quad([x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]);
        quad([x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [x0, y1, z0]);
        quad([x1, y0, z0], [x1, y0, z1], [x1, y1, z1], [x1, y1, z0]);
        if (y0 > 0.01) quad([x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1]);
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
        const sz = s.sz ?? 1;
        const p = (r: number, ang: number, y: number): V => [cx + Math.cos(ang) * r, y, cz + Math.sin(ang) * r * sz];
        for (let k = 0; k < seg; k++) {
          const a = (k / seg) * Math.PI * 2;
          const b = ((k + 1) / seg) * Math.PI * 2;
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
      case 'ribbon': {
        const { pts, width, y } = s;
        const half = width / 2;
        const edges = pts.map(([x, z], i) => {
          const [px, pz] = pts[Math.max(0, i - 1)];
          const [nx, nz] = pts[Math.min(pts.length - 1, i + 1)];
          const dx = nx - px;
          const dz = nz - pz;
          const l = Math.hypot(dx, dz) || 1;
          const ox = (-dz / l) * half;
          const oz = (dx / l) * half;
          return [[x + ox, z + oz], [x - ox, z - oz]] as const;
        });
        const lo = y - (s.thick ?? 0);
        for (let i = 0; i < edges.length - 1; i++) {
          const [l0, r0] = edges[i];
          const [l1, r1] = edges[i + 1];
          quad([l0[0], y, l0[1]], [l1[0], y, l1[1]], [r1[0], y, r1[1]], [r0[0], y, r0[1]]);
          if (s.thick) {
            quad([l0[0], lo, l0[1]], [l1[0], lo, l1[1]], [l1[0], y, l1[1]], [l0[0], y, l0[1]]);
            quad([r0[0], lo, r0[1]], [r1[0], lo, r1[1]], [r1[0], y, r1[1]], [r0[0], y, r0[1]]);
            quad([l0[0], lo, l0[1]], [l1[0], lo, l1[1]], [r1[0], lo, r1[1]], [r0[0], lo, r0[1]]);
          }
        }
        break;
      }
      case 'poly': {
        const contour = s.pts.map(([x, z]) => new THREE.Vector2(x, z));
        for (const [a, b, c] of THREE.ShapeUtils.triangulateShape(contour, [])) {
          tri([s.pts[a][0], s.y, s.pts[a][1]], [s.pts[b][0], s.y, s.pts[b][1]], [s.pts[c][0], s.y, s.pts[c][1]]);
        }
        break;
      }
      case 'tube': {
        for (let i = 0; i < s.pts.length - 1; i++) {
          const a = s.pts[i];
          const b = s.pts[i + 1];
          const d = norm(sub(b, a));
          const up: V = Math.abs(d[1]) > 0.9 ? [1, 0, 0] : [0, 1, 0];
          const u = norm(cross(d, up), s.r);
          const v = norm(cross(d, u), s.r);
          const ring = (p: V): V[] => [add(p, u, v), add(p, u, [-v[0], -v[1], -v[2]]), sub(sub(p, u), v), add(sub(p, u), v)];
          const ra = ring(a);
          const rb = ring(b);
          for (let k = 0; k < 4; k++) quad(ra[k], ra[(k + 1) % 4], rb[(k + 1) % 4], rb[k]);
        }
        break;
      }
      case 'ball': {
        const { cx, cy, cz, rx, ry, rz } = s;
        const LAT = 5;
        const LON = 8;
        const p = (i: number, j: number): V => {
          const th = (i / LAT) * Math.PI;
          const ph = (j / LON) * Math.PI * 2;
          return [cx + Math.sin(th) * Math.cos(ph) * rx, cy + Math.cos(th) * ry, cz + Math.sin(th) * Math.sin(ph) * rz];
        };
        for (let i = 0; i < LAT; i++) {
          for (let j = 0; j < LON; j++) quad(p(i, j), p(i, j + 1), p(i + 1, j + 1), p(i + 1, j));
        }
        break;
      }
      case 'quad': {
        const { cx, cy, cz, w, h } = s;
        if (s.axis === 'z') quad([cx - w / 2, cy - h / 2, cz], [cx + w / 2, cy - h / 2, cz], [cx + w / 2, cy + h / 2, cz], [cx - w / 2, cy + h / 2, cz]);
        else quad([cx, cy - h / 2, cz - w / 2], [cx, cy - h / 2, cz + w / 2], [cx, cy + h / 2, cz + w / 2], [cx, cy + h / 2, cz - w / 2]);
        break;
      }
    }
  }

  const make = ({ pos, col }: { pos: number[]; col: number[] }) => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
    // Unindexed, so this gives every face its own flat normal.
    g.computeVertexNormals();
    return g;
  };
  return { lit: make(buckets.lit), glow: make(buckets.glow) };
}
