/**
 * 3D model of McKinley Park, the community area that holds the geographic
 * center of Chicago. Everything is placed in Chicago address-grid coordinates
 * (800 numbers = 1 mile) and converted to world units here, so the layout reads
 * like the city's own grid. Street and river lines are stylized, not surveyed.
 */
import type { RGB, Solid, V } from './solid';

export type { RGB } from './solid';

/** West address (e.g. 2400 = Western Ave) and South address (e.g. 3900 = Pershing Rd). */
export type GridPoint = { w: number; s: number };
export type World = { x: number; z: number };

export const X = (w: number) => -(w - 2200) / 100;
export const Z = (s: number) => (s - 3600) / 100;

export const BOUNDS = { wEast: 1200, wWest: 3200, sNorth: 2800, sSouth: 4400 };

// Stylized alignments: each runs southwest across the grid.
export const archerS = (w: number) => 3528 + (w - 2200) * 0.55;
export const stevensonS = (w: number) => 3150 + (w - 2200) * 0.35;
export const riverS = (w: number) => stevensonS(w) - 130;
/** The Orange Line runs on its own structure just north of Archer. */
export const orangeS = (w: number) => archerS(w) - 45;

/** The city's geographic-center marker at 37th St and Honore St (placed 1979, renewed 2016). */
export const CENTER: GridPoint = { w: 1832, s: 3700 };
export const PARK = { wEast: 2000, wWest: 2400, sNorth: 3700, sSouth: 3900 };
export const BUBBLY_CREEK_W = 1350;

/** Surface colors, as sRGB. */
export const TONES = {
  redBrick: [0.4, 0.24, 0.18],
  tanBrick: [0.5, 0.42, 0.31],
  greystone: [0.47, 0.46, 0.42],
  frame: [0.36, 0.34, 0.32],
  roof: [0.2, 0.18, 0.17],
  factory: [0.45, 0.29, 0.21],
  tank: [0.45, 0.3, 0.18],
  seats: [0.17, 0.21, 0.26],
  concrete: [0.42, 0.42, 0.44],
  wall: [0.12, 0.24, 0.16],
  street: [0.13, 0.125, 0.12],
  avenue: [0.2, 0.19, 0.17],
  archer: [0.42, 0.3, 0.15],
  water: [0.14, 0.26, 0.36],
  lawn: [0.16, 0.27, 0.14],
  leaf: [0.2, 0.33, 0.17],
  trunk: [0.25, 0.18, 0.12],
  dirt: [0.45, 0.32, 0.2],
  chalk: [0.9, 0.88, 0.84],
  steel: [0.24, 0.28, 0.25],
} as const satisfies Record<string, RGB>;

/** Light-emitting colors, used as-is. */
export const GLOW = {
  window: [1, 0.62, 0.26],
  warm: [1, 0.86, 0.66],
  amber: [1, 0.6, 0.15],
  red: [0.9, 0.12, 0.08],
  screen: [0.75, 0.82, 0.95],
} as const satisfies Record<string, RGB>;

/** Seeded so the city looks the same on every visit. */
export function rng(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}

/* ─── Shape helpers ───────────────────────────────────────────────────── */

export const box = (S: Solid[], x0: number, x1: number, z0: number, z1: number, y1: number, color: RGB, y0 = 0, glow = false) =>
  S.push({ kind: 'box', x0, x1, z0, z1, y0, y1, color, glow });
export const tube = (S: Solid[], pts: V[], r: number, color: RGB, glow = false) => S.push({ kind: 'tube', pts, r, color, glow });
export const ball = (S: Solid[], cx: number, cy: number, cz: number, r: number, color: RGB, ry = r, glow = false) =>
  S.push({ kind: 'ball', cx, cy, cz, rx: r, ry, rz: r, color, glow });
export const ribbon = (S: Solid[], pts: [number, number][], width: number, y: number, color: RGB, thick?: number) =>
  S.push({ kind: 'ribbon', pts, width, y, color, thick });
export const lit = (S: Solid[], cx: number, cy: number, cz: number, axis: 'x' | 'z', w: number, h: number, color: RGB = GLOW.window) =>
  S.push({ kind: 'quad', cx, cy, cz, axis, w, h, color, glow: true });

/** Points around a circle in a vertical plane, for wheels and arches. */
export const circle = (cx: number, cy: number, cz: number, r: number, n: number, axis: 'x' | 'z', from = 0, to = Math.PI * 2): V[] =>
  Array.from({ length: n + 1 }, (_, k) => {
    const a = from + ((to - from) * k) / n;
    return axis === 'z' ? [cx + Math.cos(a) * r, cy + Math.sin(a) * r, cz] : [cx, cy + Math.sin(a) * r, cz + Math.cos(a) * r];
  });

export function tree(S: Solid[], rand: () => number, x: number, z: number, height: number) {
  S.push({ kind: 'cyl', cx: x, cz: z, r0: height * 0.05, r1: height * 0.04, y0: 0, y1: height * 0.5, seg: 5, color: TONES.trunk });
  const shade = 0.85 + rand() * 0.3;
  ball(S, x, height * 0.68, z, height * 0.3, [TONES.leaf[0] * shade, TONES.leaf[1] * shade, TONES.leaf[2] * shade], height * 0.34);
}

/* ─── The neighborhood ────────────────────────────────────────────────── */

const inPark = (w: number, s: number) => w >= PARK.wEast && w <= PARK.wWest && s >= PARK.sNorth && s <= PARK.sSouth;
const nearDiagonal = (w: number, s: number, f: (w: number) => number, half: number) => Math.abs(s - f(w)) < half;

const MAJOR_W = new Set([1600, 2000, 2400, 2800, 3200]); // Ashland, Damen, Western, California, Kedzie
const MAJOR_S = new Set([3100, 3500, 3900, 4300]); // 31st, 35th, Pershing, 43rd
const FLOOR = 0.11;
const MAX_STACKS = 4;

/** World points along an alignment from wEast to wWest. */
const alignment = (f: (w: number) => number, w0 = BOUNDS.wEast, w1 = BOUNDS.wWest, step = 25): [number, number][] => {
  const pts: [number, number][] = [];
  for (let w = w0; w <= w1; w += step) pts.push([X(w), Z(f(w))]);
  return pts;
};

/**
 * The neighborhood: streets, buildings, park, river, expressway and the local
 * landmarks. Also returns the tops of the smokestacks, which smoke rises from.
 */
export function buildCity(S: Solid[]): { stacks: V[] } {
  const rand = rng(41837);
  const south = (w: number) => stevensonS(w) + 40;

  // Streets south of the expressway, split where they meet the park.
  for (let w = BOUNDS.wEast; w <= BOUNDS.wWest; w += 100) {
    const major = MAJOR_W.has(w);
    const color = major ? TONES.avenue : TONES.street;
    const runs: [number, number][] = w > PARK.wEast && w < PARK.wWest
      ? [[south(w), PARK.sNorth], [PARK.sSouth, BOUNDS.sSouth]]
      : [[south(w), BOUNDS.sSouth]];
    for (const [s0, s1] of runs) if (s1 > s0) ribbon(S, [[X(w), Z(s0)], [X(w), Z(s1)]], major ? 0.07 : 0.04, 0.006, color);
  }
  for (let s = BOUNDS.sNorth; s <= BOUNDS.sSouth; s += 100) {
    const major = MAJOR_S.has(s);
    const color = major ? TONES.avenue : TONES.street;
    const wLimit = Math.min(BOUNDS.wWest, 2200 + (s - 40 - 3150) / 0.35);
    if (wLimit <= BOUNDS.wEast) continue;
    const runs: [number, number][] = s > PARK.sNorth && s < PARK.sSouth
      ? [[BOUNDS.wEast, PARK.wEast], [PARK.wWest, wLimit]]
      : [[BOUNDS.wEast, wLimit]];
    for (const [w0, w1] of runs) if (w1 > w0) ribbon(S, [[X(w0), Z(s)], [X(w1), Z(s)]], major ? 0.07 : 0.04, 0.006, color);
  }
  ribbon(S, alignment(archerS), 0.08, 0.008, TONES.archer);

  // The river (the Sanitary and Ship Canal west of Damen) and Bubbly Creek.
  ribbon(S, alignment(riverS), 0.5, 0.003, TONES.water);
  const creek: [number, number][] = [];
  for (let s = riverS(BUBBLY_CREEK_W); s <= 3850; s += 10) creek.push([X(BUBBLY_CREEK_W + Math.sin(s / 40) * 12), Z(s)]);
  ribbon(S, creek, 0.16, 0.003, TONES.water);

  // Stevenson Expressway (I-55): two raised carriageways on columns.
  for (const off of [-12, 12]) ribbon(S, alignment((w) => stevensonS(w) + off), 0.14, 0.25, TONES.concrete, 0.035);
  for (let w = BOUNDS.wEast + 50; w < BOUNDS.wWest; w += 100) {
    const x = X(w);
    const z = Z(stevensonS(w));
    S.push({ kind: 'cyl', cx: x, cz: z, r0: 0.03, r1: 0.03, y0: 0, y1: 0.22, seg: 6, color: TONES.concrete, sz: 3 });
  }

  // Buildings. Residential blocks get two rows of deep, narrow Chicago lots
  // split by an alley; the strip by the river and along Bubbly Creek is the old
  // Central Manufacturing District, so it gets factories.
  const stacks: V[] = [];
  for (let w = BOUNDS.wEast; w < BOUNDS.wWest; w += 100) {
    for (let s = BOUNDS.sNorth; s < BOUNDS.sSouth; s += 100) {
      const cw = w + 50;
      const cs = s + 50;
      if (inPark(cw, cs)) continue;
      const corridor = cs < stevensonS(cw) + 40 && cs > riverS(cw) + 25;
      const industrial = corridor || (cw < 1700 && cs < 3800);
      if (!corridor && cs < stevensonS(cw) + 40) continue;

      if (industrial) {
        const count = rand() < 0.5 ? 1 : 2;
        for (let i = 0; i < count; i++) {
          const depth = count === 1 ? 70 : 32;
          const ls = s + 12 + i * 44;
          const lw = w + 12 + rand() * 10;
          if (nearDiagonal(lw + 35, ls + depth / 2, archerS, 30) || nearDiagonal(lw + 35, ls + depth / 2, orangeS, 40)) continue;
          // A few smokestacks, spread out, rather than one on every other factory.
          const canStack = (x: number, z: number) =>
            stacks.length < MAX_STACKS && stacks.every(([sx, , sz]) => Math.hypot(sx - x, sz - z) > 3);
          const stack = factory(S, rand, X(lw + 70), X(lw), Z(ls), Z(ls + depth), 0.3 + rand() * 0.55, canStack);
          if (stack) stacks.push(stack);
        }
        continue;
      }

      for (const row of [0, 1]) {
        for (let lot = 0; lot < 5; lot++) {
          const lw = w + 10 + lot * 17 + rand() * 3;
          const front = row === 0 ? s + 10 : s + 90; // set back from the street
          const back = row === 0 ? s + 40 : s + 60;
          if (nearDiagonal(lw, (front + back) / 2, archerS, 16) || nearDiagonal(lw, (front + back) / 2, orangeS, 24)) continue;
          if (RESERVED.some((r) => Math.hypot(lw - r.at.w, (front + back) / 2 - r.at.s) < r.radius)) continue;
          const corner = lot === 0 || lot === 4;
          const roll = rand();
          if (roll < 0.1) {
            // An empty lot turned community garden.
            box(S, X(lw) - 0.05, X(lw) + 0.05, Math.min(Z(front), Z(back)), Math.max(Z(front), Z(back)), 0.012, TONES.lawn);
            continue;
          }
          const kind: HouseKind =
            corner && rand() < 0.35 ? 'store' : roll < 0.3 ? 'cottage' : roll < 0.5 ? 'bungalow' : roll < 0.85 ? 'twoflat' : 'threeflat';
          house(S, rand, kind, X(lw), Z(front), Z(back), row === 0 ? -1 : 1);
          // Parkway tree between sidewalk and street.
          if (rand() < 0.45) tree(S, rand, X(lw + 8), Z(row === 0 ? s + 5 : s + 95), 0.16);
        }
      }
    }
  }

  // McKinley Park: lawn, the lagoon and its trees.
  box(S, X(PARK.wWest), X(PARK.wEast), Z(PARK.sNorth), Z(PARK.sSouth), 0.01, TONES.lawn);
  const lagoon = { w: 2230, s: 3790, rw: 110, rs: 45 };
  S.push({ kind: 'cyl', cx: X(lagoon.w), cz: Z(lagoon.s), r0: lagoon.rw / 100, r1: lagoon.rw / 100, y0: 0, y1: 0.014, seg: 28, sz: lagoon.rs / lagoon.rw, color: TONES.water });
  for (let t = 0; t < 70; t++) {
    const w = PARK.wEast + 20 + rand() * (PARK.wWest - PARK.wEast - 40);
    const s = PARK.sNorth + 15 + rand() * (PARK.sSouth - PARK.sNorth - 30);
    if (((w - lagoon.w) / lagoon.rw) ** 2 + ((s - lagoon.s) / lagoon.rs) ** 2 < 1.4) continue;
    tree(S, rand, X(w), Z(s), 0.26 + rand() * 0.1);
  }

  buildLandmarks(S, rand);
  return { stacks };
}

type HouseKind = 'cottage' | 'bungalow' | 'twoflat' | 'threeflat' | 'store';

/**
 * One house on a narrow lot. `facing` is -1 when the front faces north (toward
 * smaller z) and 1 when it faces south.
 */
function house(S: Solid[], rand: () => number, kind: HouseKind, x: number, zFront: number, zBack: number, facing: number) {
  const half = kind === 'bungalow' ? 0.065 : 0.05;
  const x0 = x - half;
  const x1 = x + half;
  // Fronts sit near the street, backs leave a yard before the alley.
  const zf = zFront;
  const zb = zFront + (zBack - zFront) * (kind === 'cottage' ? 0.6 : 0.8);
  const floors = { cottage: 1, bungalow: 1, twoflat: 2, threeflat: 3, store: 2 }[kind];
  const h = floors * FLOOR + 0.02 + (kind === 'bungalow' ? 0.02 : 0);
  const [za, zz] = facing < 0 ? [zf, zb] : [zb, zf];
  const walls: RGB[] = kind === 'cottage' ? [TONES.frame, TONES.redBrick] : kind === 'bungalow' ? [TONES.redBrick, TONES.tanBrick] : [TONES.greystone, TONES.redBrick, TONES.tanBrick];
  box(S, x0, x1, za, zz, h, walls[Math.floor(rand() * walls.length)]);

  if (kind === 'cottage' || kind === 'bungalow') {
    // Front-gabled roof: ridge runs front to back, gable faces the street.
    const ridge = h + (kind === 'cottage' ? 0.07 : 0.05);
    S.push({ kind: 'gable', x0: x0 - 0.005, x1: x1 + 0.005, z0: za, z1: zz, y0: h, y1: ridge, rx: x, color: TONES.roof });
    box(S, x - 0.008, x + 0.008, (za + zz) / 2 - 0.008, (za + zz) / 2 + 0.008, ridge + 0.03, TONES.redBrick, ridge - 0.03);
  } else {
    // Flat roof with a raised front parapet, typical of greystones and two-flats.
    box(S, x0, x1, zf - 0.006, zf + 0.006, h + 0.03, TONES.greystone, h);
  }

  // Lit windows on the street face, and a storefront on corner shops.
  const face = zf + facing * 0.004;
  const perFloor = kind === 'bungalow' ? 3 : 2;
  for (let f = kind === 'store' ? 1 : 0; f < floors; f++) {
    for (let i = 0; i < perFloor; i++) {
      if (rand() < 0.3) lit(S, x0 + ((i + 0.5) / perFloor) * (x1 - x0), 0.06 + f * FLOOR, face, 'z', 0.022, 0.035);
    }
  }
  if (kind === 'store') lit(S, x, 0.04, face, 'z', x1 - x0 - 0.02, 0.04, GLOW.warm);
}

/**
 * A factory or warehouse: sawtooth roof, ribbon windows, sometimes a rooftop
 * wooden water tank and a smokestack. Returns the stack's top, if any.
 */
function factory(
  S: Solid[], rand: () => number, x0: number, x1: number, z0: number, z1: number, h: number,
  canStack: (x: number, z: number) => boolean,
): V | null {
  box(S, x0, x1, z0, z1, h, TONES.factory);

  // Sawtooth roof: steep glazed faces and long slopes, repeated across the roof.
  const teeth = Math.max(3, Math.round((x1 - x0) / 0.1));
  for (let t = 0; t < teeth; t++) {
    const xa = x0 + (t / teeth) * (x1 - x0);
    const xb = x0 + ((t + 1) / teeth) * (x1 - x0);
    S.push({ kind: 'gable', x0: xa, x1: xb, z0, z1, y0: h, y1: h + 0.06, rx: xa, color: TONES.roof });
  }

  // Ribbon windows on each floor of both long faces; some lit for the night shift.
  const floors = Math.max(1, Math.floor(h / 0.15));
  for (const [z, d] of [[z0, -1], [z1, 1]] as const) {
    for (let f = 0; f < floors; f++) {
      if (rand() < 0.4) lit(S, (x0 + x1) / 2, 0.08 + f * 0.15, z + d * 0.004, 'z', (x1 - x0) * (0.4 + rand() * 0.5), 0.03);
    }
  }

  // Rooftop wooden water tank on legs, with its conical cap.
  if (rand() < 0.45) {
    const tx = x0 + (x1 - x0) * (0.25 + rand() * 0.5);
    const tz = z0 + (z1 - z0) * (0.25 + rand() * 0.5);
    const r = 0.035;
    const base = h + 0.06;
    for (let l = 0; l < 4; l++) {
      const a = Math.PI / 4 + (l * Math.PI) / 2;
      tube(S, [[tx + Math.cos(a) * r, h, tz + Math.sin(a) * r], [tx + Math.cos(a) * r, base, tz + Math.sin(a) * r]], 0.004, TONES.roof);
    }
    S.push({ kind: 'cyl', cx: tx, cz: tz, r0: r, r1: r, y0: base, y1: base + 0.075, seg: 12, color: TONES.tank });
    S.push({ kind: 'cyl', cx: tx, cz: tz, r0: r * 1.1, r1: 0, y0: base + 0.075, y1: base + 0.12, seg: 12, color: TONES.roof });
  }

  // Brick smokestack.
  if (rand() < 0.3 && canStack(x0 + 0.05, z0 + 0.05)) {
    const sx = x0 + 0.05;
    const sz = z0 + 0.05;
    const top = h + 0.5 + rand() * 0.4;
    S.push({ kind: 'cyl', cx: sx, cz: sz, r0: 0.026, r1: 0.02, y0: 0, y1: top, seg: 10, color: TONES.redBrick });
    return [sx, top, sz];
  }
  return null;
}

/* ─── Moving things ───────────────────────────────────────────────────── */

/** A point travelling along a path; `t` in [0, 1) advances by `speed` each second. */
export type Mover = { path: (t: number) => V; t: number; speed: number };

/** Constant-speed position along a polyline, t in [0, 1]. */
export function along(pts: V[]): (t: number) => V {
  const lens = [0];
  for (let i = 1; i < pts.length; i++) {
    const [a, b] = [pts[i - 1], pts[i]];
    lens.push(lens[i - 1] + Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]));
  }
  const total = lens[lens.length - 1];
  return (t) => {
    const d = (((t % 1) + 1) % 1) * total;
    let i = 1;
    while (i < lens.length - 1 && lens[i] < d) i++;
    const k = (d - lens[i - 1]) / (lens[i] - lens[i - 1] || 1);
    const [a, b] = [pts[i - 1], pts[i]];
    return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
  };
}

export function buildMovers(stacks: V[]): { traffic: Mover[]; smoke: Mover[] } {
  const rand = rng(3528);

  // Smoke puffs rise from each stack and drift east on the wind.
  const smoke: Mover[] = [];
  for (const [sx, sy, sz] of stacks) {
    for (let i = 0; i < 14; i++) {
      const spread = (rand() - 0.5) * 0.12;
      smoke.push({ t: i / 14, speed: 0.1 + rand() * 0.04, path: (t) => [sx + t * 0.9 + spread * t, sy + t * 0.7, sz + spread * t * 2] });
    }
  }

  // Expressway traffic in both directions.
  const span = BOUNDS.wWest - BOUNDS.wEast;
  const traffic: Mover[] = [];
  for (let i = 0; i < 70; i++) {
    const inbound = i % 2 === 0;
    traffic.push({
      t: rand(),
      speed: 0.05 + rand() * 0.03,
      path: (t) => {
        const w = inbound ? BOUNDS.wWest - t * span : BOUNDS.wEast + t * span;
        return [X(w), 0.27, Z(stevensonS(w) + (inbound ? -14 : 14))];
      },
    });
  }
  return { traffic, smoke };
}

/* ─── Landmarks ──────────────────────────────────────────────────────────
 * Local ones sit at their grid position. Famous ones a few miles out are set
 * on the horizon in their true compass direction from the center, pulled in
 * close enough to share the frame; their labels give the real distance.
 */

export const toWorld = (p: GridPoint): World => ({ x: X(p.w), z: Z(p.s) });

/** Real distance from the geographic center in miles (800 address numbers = 1 mile). */
export const milesFromCenter = (p: GridPoint) => Math.hypot(p.w - CENTER.w, p.s - CENTER.s) / 800;

/** Same compass bearing from the center, placed `radius` world units out. */
export function onHorizon(p: GridPoint, radius: number): World {
  const c = toWorld(CENTER);
  const t = toWorld(p);
  const d = Math.hypot(t.x - c.x, t.z - c.z);
  return { x: c.x + ((t.x - c.x) / d) * radius, z: c.z + ((t.z - c.z) / d) * radius };
}

// Real addresses. North and East of the grid origin are negative here.
const SOX: GridPoint = { w: 333, s: 3500 }; // Rate Field, 333 W 35th St
const MIDWAY: GridPoint = { w: 5100, s: 5900 }; // Midway Airport, Cicero Ave and 55th-63rd
const STOCKYARDS: GridPoint = { w: 900, s: 4100 }; // Union Stock Yard Gate, Exchange Ave at Peoria St
const CMD_TOWER: GridPoint = { w: 2000, s: 3950 }; // Central Manufacturing District tower, 2001 W Pershing Rd
export const STATION: GridPoint = { w: 2200, s: orangeS(2200) }; // 35th/Archer, Orange Line

export const SOX_AT = onHorizon(SOX, 11.8);
/** Home plate to center field, as a unit vector: east-southeast, per andrewclem.com/Baseball/RateField.html. */
export const SOX_FACING = { x: Math.cos(Math.PI / 8), z: Math.sin(Math.PI / 8) };
export const MIDWAY_AT = onHorizon(MIDWAY, 13.8);
const STOCKYARDS_AT = onHorizon(STOCKYARDS, 11.6);

/** Lots the local landmarks stand on, so houses aren't drawn through them. */
const RESERVED: { at: GridPoint; radius: number }[] = [{ at: CMD_TOWER, radius: 45 }];

function buildLandmarks(S: Solid[], rand: () => number) {
  ballpark(S, SOX_AT);

  // Midway Airport: a square mile of field with criss-crossing runways.
  const mx = MIDWAY_AT.x;
  const mz = MIDWAY_AT.z;
  const m = 1.2;
  S.push({ kind: 'poly', pts: [[mx - m, mz - m], [mx + m, mz - m], [mx + m, mz + m], [mx - m, mz + m]], y: 0.004, color: TONES.lawn });
  const runways: [number, number, number, number][] = [
    [-1, 0.95, 1, -0.95], [-1, -0.95, 1, 0.95], [-1.05, -0.35, 1.05, -0.35], [-0.3, -1.05, -0.3, 1.05],
  ];
  for (const [ax, az, bx, bz] of runways) {
    ribbon(S, [[mx + ax, mz + az], [mx + bx, mz + bz]], 0.09, 0.008, TONES.avenue);
    for (const [ex, ez] of [[ax, az], [bx, bz]]) box(S, mx + ex - 0.02, mx + ex + 0.02, mz + ez - 0.02, mz + ez + 0.02, 0.02, GLOW.red, 0, true);
  }
  box(S, mx + 0.45, mx + 0.95, mz + 0.55, mz + 0.8, 0.12, TONES.concrete);
  lit(S, mx + 0.7, 0.07, mz + 0.546, 'z', 0.45, 0.03, GLOW.warm);
  S.push({ kind: 'cyl', cx: mx + 0.7, cz: mz + 0.45, r0: 0.02, r1: 0.02, y0: 0, y1: 0.55, seg: 8, color: TONES.concrete });
  S.push({ kind: 'cyl', cx: mx + 0.7, cz: mz + 0.45, r0: 0.045, r1: 0.045, y0: 0.55, y1: 0.6, seg: 8, color: GLOW.screen, glow: true });

  // Union Stock Yard Gate: limestone arch with the steer's head over it.
  const gx = STOCKYARDS_AT.x;
  const gz = STOCKYARDS_AT.z;
  for (const dz of [-0.22, 0.22]) box(S, gx - 0.06, gx + 0.06, gz + dz - 0.06, gz + dz + 0.06, 0.38, TONES.greystone);
  tube(S, circle(gx, 0.3, gz, 0.16, 12, 'x', 0, Math.PI), 0.025, TONES.greystone);
  box(S, gx - 0.05, gx + 0.05, gz - 0.28, gz + 0.28, 0.5, TONES.greystone, 0.44);
  ball(S, gx - 0.055, 0.47, gz, 0.03, TONES.chalk);

  // Central Manufacturing District: brick water and clock tower over Pershing Road.
  const cmd = toWorld(CMD_TOWER);
  const half = 0.07;
  box(S, cmd.x - half, cmd.x + half, cmd.z - half, cmd.z + half, 1.15, TONES.redBrick);
  box(S, cmd.x - 0.3, cmd.x + 0.3, cmd.z - 0.12, cmd.z + 0.3, 0.32, TONES.redBrick);
  for (let x = cmd.x - 0.26; x < cmd.x + 0.27; x += 0.065) {
    if (rand() < 0.5) lit(S, x, 0.12, cmd.z - 0.124, 'z', 0.035, 0.05);
    if (rand() < 0.5) lit(S, x, 0.24, cmd.z - 0.124, 'z', 0.035, 0.05);
  }
  for (const [nx, nz] of [[0, -1], [1, 0], [0, 1], [-1, 0]]) {
    lit(S, cmd.x + nx * (half + 0.003), 0.95, cmd.z + nz * (half + 0.003), nx === 0 ? 'z' : 'x', 0.08, 0.08, GLOW.warm);
  }
  S.push({ kind: 'cyl', cx: cmd.x, cz: cmd.z, r0: half * 1.3, r1: 0, y0: 1.15, y1: 1.35, seg: 4, color: TONES.roof });
}

/**
 * Rate Field (Guaranteed Rate Field until 2024). Built in field coordinates
 * (u from home plate toward center field, v toward the third-base side) and
 * turned so center field faces east-southeast.
 */
function ballpark(S: Solid[], at: World) {
  const K = 1.25; // field units to world units; the wall sits at 1 field unit
  const { x: fx, z: fz } = SOX_FACING;
  const hx = at.x - fx * 0.55 * K;
  const hz = at.z - fz * 0.55 * K;
  const P = (u: number, v: number, y: number): V => [hx + (fx * u - fz * v) * K, y, hz + (fz * u + fx * v) * K];
  const plan = (u: number, v: number): [number, number] => {
    const [x, , z] = P(u, v, 0);
    return [x, z];
  };
  const polar = (r: number, a: number, y: number) => P(r * Math.cos(a), r * Math.sin(a), y);
  const Q = Math.PI / 4; // the foul lines
  const arc = (r: number, a0: number, a1: number, n: number) =>
    Array.from({ length: n + 1 }, (_, k) => plan(r * Math.cos(a0 + ((a1 - a0) * k) / n), r * Math.sin(a0 + ((a1 - a0) * k) / n)));

  // Grass out to the wall, the infield dirt arc, the bases and the mound.
  S.push({ kind: 'poly', pts: [plan(-0.12, 0), ...arc(1, -Q - 0.1, Q + 0.1, 24)], y: 0.01, color: TONES.lawn });
  S.push({ kind: 'poly', pts: [...arc(0.42, -Q, Q, 12), ...arc(0.29, Q, -Q, 12)], y: 0.014, color: TONES.dirt });
  const d = 0.19;
  for (const [u, v] of [[0, 0], [d, -d], [2 * d, 0], [d, d]]) {
    const [x, , z] = P(u, v, 0);
    box(S, x - 0.012, x + 0.012, z - 0.012, z + 0.012, 0.022, TONES.chalk);
  }
  const mound = P(d, 0, 0);
  S.push({ kind: 'cyl', cx: mound[0], cz: mound[2], r0: 0.045, r1: 0.03, y0: 0, y1: 0.024, seg: 12, color: TONES.dirt });

  // Foul lines out to the yellow foul poles, and the green outfield wall.
  for (const side of [-1, 1]) {
    ribbon(S, [plan(0, 0), plan(Math.cos(side * Q), Math.sin(side * Q))], 0.01, 0.018, TONES.chalk);
    tube(S, [polar(1, side * Q, 0), polar(1, side * Q, 0.42)], 0.008, GLOW.amber, true);
  }
  const wall: V[][] = [[], []];
  for (let a = -Q; a <= Q + 1e-6; a += Q / 24) {
    wall[0].push(polar(1, a, 0));
    wall[1].push(polar(1, a, 0.09));
  }
  S.push({ kind: 'loft', rows: wall, color: TONES.wall });

  const ground = (pts: V[]) => pts.map(([x, , z]) => [x, 0, z] as V);

  // Outfield bleachers on both sides of the batter's eye in dead center.
  for (const side of [-1, 1]) {
    const rows: V[][] = [];
    for (let row = 0; row < 5; row++) {
      const pts: V[] = [];
      for (let k = 0; k <= 30; k++) pts.push(polar(1.05 + row * 0.045, side * (0.16 + (k / 30) * (Q - 0.08)), 0.08 + row * 0.04));
      rows.push(pts);
    }
    S.push({ kind: 'loft', rows: [ground(rows[0]), ...rows, ground(rows[rows.length - 1])], color: TONES.seats });
  }

  // The center-field scoreboard and the pinwheels that spin after a home run.
  const sb = 1.3;
  S.push({ kind: 'loft', rows: [[P(sb + 0.02, -0.3, 0), P(sb + 0.02, 0.3, 0)], [P(sb + 0.02, -0.3, 0.7), P(sb + 0.02, 0.3, 0.7)]], color: TONES.roof });
  S.push({ kind: 'loft', rows: [[P(sb, -0.27, 0.33), P(sb, 0.27, 0.33)], [P(sb, -0.27, 0.67), P(sb, 0.27, 0.67)]], color: [0.32, 0.36, 0.44], glow: true });
  for (const v of [-0.2, 0, 0.2]) {
    const ring: V[] = Array.from({ length: 15 }, (_, k) => {
      const a = (k / 14) * Math.PI * 2;
      return P(sb, v + Math.cos(a) * 0.07, 0.82 + Math.sin(a) * 0.07);
    });
    tube(S, ring, 0.006, GLOW.amber, true);
    for (let k = 0; k < 4; k++) {
      const a = (k / 4) * Math.PI * 2 + 0.4;
      tube(S, [P(sb, v, 0.82), P(sb, v + Math.cos(a) * 0.07, 0.82 + Math.sin(a) * 0.07)], 0.004, GLOW.warm, true);
    }
  }

  // The grandstand: rows that follow both foul lines and wrap behind home plate.
  // Every row has the same number of points so neighbouring rows can be lofted.
  const N = 140;
  const row = (dist: number, len: number, y: number) => {
    const arcLen = (Math.PI / 2) * dist;
    const total = 2 * len + arcLen;
    const pts: V[] = [];
    for (let i = 0; i < N; i++) {
      const dd = (i / (N - 1)) * total;
      let u: number;
      let v: number;
      if (dd < len) {
        const t = len - dd;
        [u, v] = [t * Math.cos(Q) - dist * Math.sin(Q), t * Math.sin(Q) + dist * Math.cos(Q)];
      } else if (dd < len + arcLen) {
        const a = Q + Math.PI / 2 + (dd - len) / dist;
        [u, v] = [dist * Math.cos(a), dist * Math.sin(a)];
      } else {
        const t = dd - len - arcLen;
        [u, v] = [t * Math.cos(Q) - dist * Math.sin(Q), -(t * Math.sin(Q) + dist * Math.cos(Q))];
      }
      pts.push(P(u, v, y));
    }
    return pts;
  };
  const lower: V[][] = [];
  for (let dist = 0.12; dist <= 0.42; dist += 0.05) lower.push(row(dist, 0.95, 0.03 + (dist - 0.12) * 0.6));
  const suites = row(0.47, 0.8, 0.3);
  const upper: V[][] = [];
  for (let dist = 0.52; dist <= 0.8; dist += 0.05) upper.push(row(dist, 0.75, 0.38 + (dist - 0.52) * 0.75));
  const back = upper[upper.length - 1];
  S.push({ kind: 'loft', rows: [ground(lower[0]), ...lower, suites, ...upper], color: TONES.seats });
  S.push({ kind: 'loft', rows: [row(0.465, 0.8, 0.26), row(0.465, 0.8, 0.34)], color: GLOW.window, glow: true }); // lit suites
  S.push({ kind: 'loft', rows: [back, ground(back)], color: TONES.concrete });
  S.push({ kind: 'loft', rows: [row(0.72, 0.72, 0.72), row(0.86, 0.72, 0.72)], color: TONES.roof }); // roof canopy

  // Light towers along the roof.
  for (const [t, side] of [[0.15, 1], [0.5, 1], [0.15, -1], [0.5, -1]] as const) {
    const u = t * Math.cos(Q) - 0.86 * Math.sin(Q);
    const v = side * (t * Math.sin(Q) + 0.86 * Math.cos(Q));
    tube(S, [P(u, v, 0.72), P(u, v, 1.02)], 0.01, TONES.concrete);
    const [x, , z] = P(u, v, 0);
    box(S, x - 0.03, x + 0.03, z - 0.03, z + 0.03, 1.07, GLOW.warm, 1.02, true);
  }
}

const mi = (p: GridPoint) => `${milesFromCenter(p).toFixed(1)} mi`;

/** Labels pinned to points in the scene. `sub` is a second, smaller line. */
export const LABELS: { text: string; sub?: string; at: World; y: number; accent?: boolean; far?: boolean }[] = [
  { text: 'Geographic center of Chicago', sub: '37th & Honore marker', at: toWorld(CENTER), y: 3.3, accent: true },
  { text: 'Rate Field', sub: `White Sox · ${mi(SOX)}`, at: SOX_AT, y: 1.35, far: true },
  { text: 'Midway Airport', sub: mi(MIDWAY), at: MIDWAY_AT, y: 0.7, far: true },
  { text: 'Union Stock Yard Gate', sub: `c. 1875 · ${mi(STOCKYARDS)}`, at: STOCKYARDS_AT, y: 0.65, far: true },
  { text: 'McKinley Park', at: toWorld({ w: 2200, s: 3880 }), y: 0.4 },
  { text: 'Central Manufacturing District', sub: 'Clock tower, 1917', at: toWorld(CMD_TOWER), y: 1.35 },
  { text: '35th/Archer', sub: 'Orange Line', at: toWorld(STATION), y: 0.42 },
  { text: 'Ashland', sub: 'Orange Line', at: toWorld({ w: 1600, s: orangeS(1600) }), y: 0.42 },
  { text: 'Archer Ave', at: toWorld({ w: 2900, s: archerS(2900) }), y: 0.2 },
  { text: 'I-55 Stevenson', at: toWorld({ w: 1500, s: stevensonS(1500) }), y: 0.5 },
  { text: 'Sanitary & Ship Canal', at: toWorld({ w: 2950, s: riverS(2950) }), y: 0.15 },
  { text: 'Bubbly Creek', at: toWorld({ w: BUBBLY_CREEK_W, s: 3650 }), y: 0.15 },
  { text: 'Brighton Park', at: toWorld({ w: 3000, s: 4250 }), y: 0.15 },
];
