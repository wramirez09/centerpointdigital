/**
 * Particle model of McKinley Park, the community area that holds the geographic
 * center of Chicago. Everything is placed in Chicago address-grid coordinates
 * (800 numbers = 1 mile) and converted to world units here, so the layout reads
 * like the city's own grid. Street and river lines are stylized, not surveyed.
 */

/** West address (e.g. 2400 = Western Ave) and South address (e.g. 3900 = Pershing Rd). */
export type GridPoint = { w: number; s: number };

export const X = (w: number) => -(w - 2200) / 100;
export const Z = (s: number) => (s - 3600) / 100;

export const BOUNDS = { wEast: 1200, wWest: 3200, sNorth: 2800, sSouth: 4400 };

// Stylized alignments: each runs southwest across the grid.
export const archerS = (w: number) => 3528 + (w - 2200) * 0.55;
export const stevensonS = (w: number) => 3150 + (w - 2200) * 0.35;
export const riverS = (w: number) => stevensonS(w) - 130;

export const CENTER: GridPoint = { w: 2200, s: 3650 };
export const PARK = { wEast: 2000, wWest: 2400, sNorth: 3700, sSouth: 3900 };
export const BUBBLY_CREEK_W = 1450;

export const COLORS = {
  amber: [0.95, 0.64, 0.23],
  text: [0.93, 0.9, 0.84],
  dim: [0.55, 0.5, 0.42],
  park: [0.47, 0.68, 0.4],
  water: [0.33, 0.58, 0.78],
} as const;

export type RGB = readonly [number, number, number];

/** Seeded so the skyline is the same on every visit. */
export function rng(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}

export class Cloud {
  positions: number[] = [];
  colors: number[] = [];
  sizes: number[] = [];
  seeds: number[] = [];
  constructor(private rand: () => number) {}

  add(x: number, y: number, z: number, color: RGB, size: number, brightness = 1) {
    this.positions.push(x, y, z);
    this.colors.push(color[0] * brightness, color[1] * brightness, color[2] * brightness);
    this.sizes.push(size);
    this.seeds.push(this.rand());
  }

  get count() {
    return this.seeds.length;
  }
}

const inBounds = (w: number, s: number) =>
  w >= BOUNDS.wEast && w <= BOUNDS.wWest && s >= BOUNDS.sNorth && s <= BOUNDS.sSouth;
const inPark = (w: number, s: number) =>
  w >= PARK.wEast && w <= PARK.wWest && s >= PARK.sNorth && s <= PARK.sSouth;
const nearDiagonal = (w: number, s: number, f: (w: number) => number, half: number) =>
  Math.abs(s - f(w)) < half;

const MAJOR_W = new Set([1600, 2000, 2400, 2800, 3200]); // Ashland, Damen, Western, California, Kedzie
const MAJOR_S = new Set([3100, 3500, 3900, 4300]); // 31st, 35th, Pershing, 43rd

/**
 * The static city: street grid, buildings, park and the diagonal roads. Also
 * returns the tops of the smokestacks, which the animated smoke rises from.
 */
export function buildCity(): { cloud: Cloud; stacks: [number, number, number][] } {
  const rand = rng(41837);
  const c = new Cloud(rand);
  const south = (w: number, s: number) => s > stevensonS(w) + 40;

  // Street grid, south of the expressway.
  for (let w = BOUNDS.wEast; w <= BOUNDS.wWest; w += 100) {
    const major = MAJOR_W.has(w);
    for (let s = BOUNDS.sNorth; s <= BOUNDS.sSouth; s += major ? 6 : 10) {
      if (!south(w, s)) continue;
      c.add(X(w), 0, Z(s), major ? COLORS.text : COLORS.dim, major ? 1.3 : 0.9, major ? 0.8 : 0.55);
    }
  }
  for (let s = BOUNDS.sNorth; s <= BOUNDS.sSouth; s += 100) {
    const major = MAJOR_S.has(s);
    for (let w = BOUNDS.wEast; w <= BOUNDS.wWest; w += major ? 6 : 10) {
      if (!south(w, s)) continue;
      c.add(X(w), 0, Z(s), major ? COLORS.text : COLORS.dim, major ? 1.3 : 0.9, major ? 0.8 : 0.55);
    }
  }

  // Archer Avenue.
  for (let w = BOUNDS.wEast; w <= BOUNDS.wWest; w += 4) {
    const s = archerS(w);
    if (inBounds(w, s)) c.add(X(w), 0.01, Z(s), COLORS.amber, 1.5, 0.8);
  }

  // Stevenson Expressway (I-55): two raised carriageways.
  for (let w = BOUNDS.wEast; w <= BOUNDS.wWest; w += 5) {
    for (const off of [-12, 12]) {
      const s = stevensonS(w) + off;
      if (inBounds(w, s)) c.add(X(w), 0.25, Z(s), COLORS.text, 1.2, 0.6);
    }
  }

  // Buildings. Residential blocks get two rows of deep, narrow Chicago lots
  // split by an alley; the strip by the river and along Bubbly Creek is the old
  // Central Manufacturing District, so it gets warehouses.
  const stacks: [number, number, number][] = [];
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
          if (nearDiagonal(lw + 35, ls + depth / 2, archerS, 30)) continue;
          const stack = warehouse(c, rand, X(lw + 70), X(lw), Z(ls), Z(ls + depth), 0.3 + rand() * 0.55);
          if (stack) stacks.push(stack);
        }
        continue;
      }

      // Alley down the middle of the block.
      for (let aw = w + 4; aw < w + 96; aw += 8) {
        if (!nearDiagonal(aw, s + 50, archerS, 10)) c.add(X(aw), 0, Z(s + 50), COLORS.dim, 0.7, 0.3);
      }
      for (const row of [0, 1]) {
        for (let lot = 0; lot < 5; lot++) {
          const lw = w + 10 + lot * 17 + rand() * 3;
          const front = row === 0 ? s + 10 : s + 90; // set back from the street
          const back = row === 0 ? s + 40 : s + 60;
          if (nearDiagonal(lw, (front + back) / 2, archerS, 16)) continue;
          if (RESERVED.some((r) => Math.hypot(lw - r.at.w, (front + back) / 2 - r.at.s) < r.radius)) continue;
          const corner = lot === 0 || lot === 4;
          const roll = rand();
          if (roll < 0.1) {
            garden(c, rand, X(lw), Z(front), Z(back));
            continue;
          }
          const kind: HouseKind =
            corner && rand() < 0.35 ? 'store' : roll < 0.3 ? 'cottage' : roll < 0.5 ? 'bungalow' : roll < 0.85 ? 'twoflat' : 'threeflat';
          house(c, rand, kind, X(lw), Z(front), Z(back), row === 0 ? -1 : 1);
          // Parkway tree between sidewalk and street.
          if (rand() < 0.45) tree(c, rand, X(lw + 8), Z(row === 0 ? s + 5 : s + 95), 0.16);
        }
      }
    }
  }

  // McKinley Park: lawn, tree canopy and the lagoon.
  const lagoon = { w: 2230, s: 3790, rw: 110, rs: 45 };
  for (let i = 0; i < 2600; i++) {
    const w = PARK.wEast + rand() * (PARK.wWest - PARK.wEast);
    const s = PARK.sNorth + rand() * (PARK.sSouth - PARK.sNorth);
    const inLagoon = ((w - lagoon.w) / lagoon.rw) ** 2 + ((s - lagoon.s) / lagoon.rs) ** 2 < 1;
    if (inLagoon) c.add(X(w), 0.02, Z(s), COLORS.water, 1.4, 0.9);
    else c.add(X(w), 0.02, Z(s), COLORS.park, 1, 0.45);
  }
  for (let t = 0; t < 70; t++) {
    const w = PARK.wEast + 20 + rand() * (PARK.wWest - PARK.wEast - 40);
    const s = PARK.sNorth + 15 + rand() * (PARK.sSouth - PARK.sNorth - 30);
    if (((w - lagoon.w) / lagoon.rw) ** 2 + ((s - lagoon.s) / lagoon.rs) ** 2 < 1.4) continue;
    tree(c, rand, X(w), Z(s), 0.3);
  }

  buildLandmarks(c, rand);

  return { cloud: c, stacks };
}

type HouseKind = 'cottage' | 'bungalow' | 'twoflat' | 'threeflat' | 'store';

const FLOOR = 0.11;

/** Points along a straight segment, `step` apart. */
export function line(
  c: Cloud, a: [number, number, number], b: [number, number, number],
  step: number, color: RGB, size: number, brightness: number,
) {
  const len = Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
  const n = Math.max(1, Math.round(len / step));
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    c.add(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t, color, size, brightness);
  }
}

/** Wireframe box: four corner posts and the roofline. */
export function box(c: Cloud, x0: number, x1: number, z0: number, z1: number, h: number, b: number, step = 0.05) {
  for (const [x, z] of [[x0, z0], [x1, z0], [x0, z1], [x1, z1]]) {
    line(c, [x, 0.02, z], [x, h, z], step, COLORS.text, 0.9, b * 0.8);
  }
  line(c, [x0, h, z0], [x1, h, z0], step, COLORS.text, 0.9, b);
  line(c, [x0, h, z1], [x1, h, z1], step, COLORS.text, 0.9, b);
  line(c, [x0, h, z0], [x0, h, z1], step, COLORS.text, 0.9, b);
  line(c, [x1, h, z0], [x1, h, z1], step, COLORS.text, 0.9, b);
}

/** A row of windows on the face at depth `z`; a share of them are lit. */
function windows(c: Cloud, rand: () => number, x0: number, x1: number, z: number, floors: number, perFloor: number, base = 0.06) {
  for (let f = 0; f < floors; f++) {
    for (let i = 0; i < perFloor; i++) {
      const x = x0 + ((i + 0.5) / perFloor) * (x1 - x0);
      const lit = rand() < 0.22;
      c.add(x, base + f * FLOOR, z, lit ? COLORS.amber : COLORS.text, lit ? 1.4 : 0.8, lit ? 0.55 + rand() * 0.3 : 0.08);
    }
  }
}

/**
 * One house on a narrow lot. `facing` is -1 when the front faces north (toward
 * smaller z) and 1 when it faces south.
 */
function house(c: Cloud, rand: () => number, kind: HouseKind, x: number, zFront: number, zBack: number, facing: number) {
  const half = kind === 'bungalow' ? 0.065 : 0.05;
  const x0 = x - half;
  const x1 = x + half;
  // Fronts sit near the street, backs leave a yard before the alley.
  const zf = zFront;
  const zb = zFront + (zBack - zFront) * (kind === 'cottage' ? 0.6 : 0.8);
  const b = 0.16 + rand() * 0.14;
  const floors = { cottage: 1, bungalow: 1, twoflat: 2, threeflat: 3, store: 2 }[kind];
  const h = floors * FLOOR + 0.02 + (kind === 'bungalow' ? 0.02 : 0);
  const [za, zz] = facing < 0 ? [zf, zb] : [zb, zf];
  box(c, x0, x1, za, zz, h, b, 0.065);

  if (kind === 'cottage' || kind === 'bungalow') {
    // Front-gabled roof: ridge runs front to back, gable triangle faces the street.
    const ridge = h + (kind === 'cottage' ? 0.07 : 0.05);
    line(c, [x, ridge, za], [x, ridge, zz], 0.04, COLORS.text, 0.9, b);
    for (const zEnd of [za, zz]) {
      line(c, [x0, h, zEnd], [x, ridge, zEnd], 0.03, COLORS.text, 0.9, b * 0.9);
      line(c, [x1, h, zEnd], [x, ridge, zEnd], 0.03, COLORS.text, 0.9, b * 0.9);
    }
    // Brick chimney on the ridge.
    line(c, [x, ridge, (za + zz) / 2], [x, ridge + 0.04, (za + zz) / 2], 0.02, COLORS.amber, 0.9, 0.35);
  } else {
    // Flat roof with a raised front parapet, typical of greystones and two-flats.
    line(c, [x0, h + 0.03, zf], [x1, h + 0.03, zf], 0.025, COLORS.text, 0.9, b);
    // Back porch stairs: the wooden porch on nearly every Chicago flat.
    const porch = zb + facing * -0.03;
    for (let f = 1; f <= floors; f++) line(c, [x0, f * FLOOR - 0.03, porch], [x1, f * FLOOR - 0.03, porch], 0.03, COLORS.dim, 0.8, 0.5);
  }

  if (kind === 'store') {
    // Lit storefront band on the ground floor.
    line(c, [x0 + 0.01, 0.05, zf], [x1 - 0.01, 0.05, zf], 0.015, COLORS.amber, 1.4, 0.9);
    windows(c, rand, x0, x1, zf, floors - 1, 2, 0.06 + FLOOR);
  } else {
    windows(c, rand, x0, x1, zf, floors, kind === 'bungalow' ? 3 : 2);
  }
  // A few side windows down the length of the building.
  for (let f = 0; f < floors; f++) {
    if (rand() < 0.5) {
      const lit = rand() < 0.3;
      c.add(rand() < 0.5 ? x0 : x1, 0.06 + f * FLOOR, za + (zz - za) * (0.3 + rand() * 0.4), lit ? COLORS.amber : COLORS.text, 1, lit ? 0.7 : 0.18);
    }
  }
}

/** An empty lot turned community garden. */
function garden(c: Cloud, rand: () => number, x: number, z0: number, z1: number) {
  for (let i = 0; i < 18; i++) {
    c.add(x + (rand() - 0.5) * 0.1, 0.02, z0 + rand() * (z1 - z0), COLORS.park, 1, 0.45);
  }
}

function tree(c: Cloud, rand: () => number, x: number, z: number, height: number) {
  line(c, [x, 0.02, z], [x, height * 0.55, z], 0.04, COLORS.dim, 0.8, 0.4);
  const n = Math.round(height * 45);
  for (let k = 0; k < n; k++) {
    const a = rand() * Math.PI * 2;
    const r = Math.sqrt(rand()) * height * 0.35;
    c.add(x + Math.cos(a) * r, height * (0.55 + rand() * 0.45), z + Math.sin(a) * r, COLORS.park, 1.1, 0.6 + rand() * 0.3);
  }
}

/**
 * A factory or warehouse: sawtooth roof, ribbon windows, sometimes a rooftop
 * wooden water tank and a smokestack. Returns the stack's top, if any.
 */
function warehouse(
  c: Cloud, rand: () => number, x0: number, x1: number, z0: number, z1: number, h: number,
): [number, number, number] | null {
  const b = 0.3 + rand() * 0.15;
  box(c, x0, x1, z0, z1, h, b, 0.045);

  // Sawtooth roof: steep glazed faces and long slopes, repeated across the roof.
  const teeth = Math.max(3, Math.round((x1 - x0) / 0.1));
  for (let t = 0; t < teeth; t++) {
    const xa = x0 + (t / teeth) * (x1 - x0);
    const xb = x0 + ((t + 1) / teeth) * (x1 - x0);
    line(c, [xa, h + 0.06, z0], [xa, h + 0.06, z1], 0.04, COLORS.text, 0.9, b * 0.8);
    line(c, [xa, h + 0.06, z0], [xb, h, z0], 0.03, COLORS.text, 0.8, b * 0.6);
    line(c, [xa, h + 0.06, z1], [xb, h, z1], 0.03, COLORS.text, 0.8, b * 0.6);
  }

  // Ribbon windows on every floor of both long faces, and a loading dock.
  const floors = Math.max(1, Math.floor(h / 0.15));
  const panes = Math.round((x1 - x0) / 0.035);
  for (const z of [z0, z1]) {
    for (let f = 0; f < floors; f++) {
      const y = 0.08 + f * 0.15;
      for (let i = 1; i < panes; i++) {
        const lit = rand() < 0.25;
        c.add(x0 + (i / panes) * (x1 - x0), y, z, lit ? COLORS.amber : COLORS.water, lit ? 1.3 : 0.9, lit ? 0.7 : 0.3);
      }
    }
  }
  const dock = z1 + 0.04;
  for (let i = 0; i < 4; i++) {
    const xd = x0 + 0.08 + i * 0.07;
    if (xd < x1) line(c, [xd, 0.02, z1], [xd, 0.02, dock], 0.02, COLORS.amber, 1, 0.5);
  }

  // Rooftop water tank on legs, with its conical cap.
  if (rand() < 0.45) {
    const tx = x0 + (x1 - x0) * (0.25 + rand() * 0.5);
    const tz = z0 + (z1 - z0) * (0.25 + rand() * 0.5);
    const r = 0.035;
    const base = h + 0.06;
    for (let l = 0; l < 4; l++) {
      const a = Math.PI / 4 + (l * Math.PI) / 2;
      line(c, [tx + Math.cos(a) * r, h, tz + Math.sin(a) * r], [tx + Math.cos(a) * r, base, tz + Math.sin(a) * r], 0.02, COLORS.dim, 0.8, 0.6);
    }
    for (let ring = 0; ring <= 3; ring++) {
      for (let k = 0; k < 10; k++) {
        const a = (k / 10) * Math.PI * 2;
        c.add(tx + Math.cos(a) * r, base + ring * 0.025, tz + Math.sin(a) * r, COLORS.amber, 0.9, 0.5);
      }
    }
    for (let k = 0; k < 6; k++) {
      const a = (k / 6) * Math.PI * 2;
      line(c, [tx + Math.cos(a) * r, base + 0.075, tz + Math.sin(a) * r], [tx, base + 0.12, tz], 0.02, COLORS.amber, 0.8, 0.45);
    }
  }

  // Brick smokestack.
  if (rand() < 0.3) {
    const sx = x0 + 0.05;
    const sz = z0 + 0.05;
    const top = h + 0.5 + rand() * 0.4;
    for (let y = 0.02; y < top; y += 0.025) {
      for (let k = 0; k < 4; k++) {
        const a = (k / 4) * Math.PI * 2 + y * 3;
        c.add(sx + Math.cos(a) * 0.022, y, sz + Math.sin(a) * 0.022, COLORS.amber, 0.8, 0.35);
      }
    }
    return [sx, top, sz];
  }
  return null;
}

/** One point travelling along a path; `t` in [0, 1) advances by `speed` each second. */
export type Mover = { path: (t: number) => [number, number, number]; t: number; speed: number };

export function buildMovers(stacks: [number, number, number][]): {
  water: Mover[]; traffic: Mover[]; train: Mover[]; smoke: Mover[];
} {
  const rand = rng(3528);

  // Smoke rises from each stack and drifts east on the wind.
  const smoke: Mover[] = [];
  for (const [sx, sy, sz] of stacks) {
    for (let i = 0; i < 24; i++) {
      const spread = (rand() - 0.5) * 0.12;
      smoke.push({
        t: rand(),
        speed: 0.12 + rand() * 0.06,
        path: (t) => [sx + t * 0.9 + spread * t, sy + t * 0.7, sz + spread * t * 2],
      });
    }
  }
  const span = BOUNDS.wWest - BOUNDS.wEast;

  // Water drifts west and south toward the Sanitary and Ship Canal.
  const water: Mover[] = [];
  for (let i = 0; i < 700; i++) {
    const lane = (rand() - 0.5) * 50;
    water.push({
      t: rand(),
      speed: 0.01 + rand() * 0.006,
      path: (t) => {
        const w = BOUNDS.wEast + t * span;
        return [X(w), 0.03, Z(riverS(w) + lane)];
      },
    });
  }
  // Bubbly Creek, a slow arm running south from the river.
  for (let i = 0; i < 160; i++) {
    const lane = (rand() - 0.5) * 16;
    const top = riverS(BUBBLY_CREEK_W);
    water.push({
      t: rand(),
      speed: 0.008 + rand() * 0.004,
      path: (t) => {
        const s = 3780 - t * (3780 - top);
        const wiggle = Math.sin(s / 40) * 12;
        return [X(BUBBLY_CREEK_W + wiggle + lane), 0.03, Z(s)];
      },
    });
  }

  // Expressway traffic in both directions.
  const traffic: Mover[] = [];
  for (let i = 0; i < 90; i++) {
    const inbound = i % 2 === 0;
    traffic.push({
      t: rand(),
      speed: 0.05 + rand() * 0.03,
      path: (t) => {
        const w = inbound ? BOUNDS.wWest - t * span : BOUNDS.wEast + t * span;
        return [X(w), 0.3, Z(stevensonS(w) + (inbound ? -12 : 12))];
      },
    });
  }

  // An Orange Line train on the embankment beside Archer.
  const train: Mover[] = [];
  for (let car = 0; car < 24; car++) {
    train.push({
      t: car * 0.004,
      speed: 0.06,
      path: (t) => {
        const w = BOUNDS.wWest - t * span;
        return [X(w), 0.5, Z(archerS(w) - 45)];
      },
    });
  }

  return { water, traffic, train, smoke };
}

/* ─── Landmarks ──────────────────────────────────────────────────────────
 * Local ones sit at their grid position. Famous ones a few miles out are set
 * on the horizon in their true compass direction from the center, pulled in
 * close enough to share the frame; their labels give the real distance.
 */

export type World = { x: number; z: number };

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
const SOX: GridPoint = { w: 333, s: 3500 }; // Guaranteed Rate Field, 333 W 35th St
const MIDWAY: GridPoint = { w: 5100, s: 5900 }; // Midway Airport, Cicero Ave and 55th-63rd
const STOCKYARDS: GridPoint = { w: 850, s: 4100 }; // Union Stock Yard Gate, Exchange Ave
const CMD_TOWER: GridPoint = { w: 2050, s: 3960 }; // Central Manufacturing District, Pershing Rd
const STATION: GridPoint = { w: 2200, s: archerS(2200) - 45 }; // 35th/Archer, Orange Line

export const SOX_AT = onHorizon(SOX, 11.8);
/** Home plate to center field, as a unit vector. The outfield opens to the northeast. */
export const SOX_FACING = { x: Math.SQRT1_2, z: -Math.SQRT1_2 };
const MIDWAY_AT = onHorizon(MIDWAY, 13.8);
const STOCKYARDS_AT = onHorizon(STOCKYARDS, 11.6);

/** Lots the local landmarks stand on, so houses aren't drawn through them. */
export const RESERVED: { at: GridPoint; radius: number }[] = [{ at: CMD_TOWER, radius: 45 }];

function buildLandmarks(c: Cloud, rand: () => number) {
  ballpark(c, rand, SOX_AT);

  // Midway Airport: a square mile of field with criss-crossing runways.
  const mx = MIDWAY_AT.x;
  const mz = MIDWAY_AT.z;
  const m = 1.2;
  for (const [a, b] of [[[-m, -m], [m, -m]], [[m, -m], [m, m]], [[m, m], [-m, m]], [[-m, m], [-m, -m]]] as const) {
    line(c, [mx + a[0], 0.01, mz + a[1]], [mx + b[0], 0.01, mz + b[1]], 0.08, COLORS.dim, 0.8, 0.4);
  }
  const runways: [number, number, number, number][] = [
    [-1, 0.95, 1, -0.95], [-1, -0.95, 1, 0.95], [-1.05, -0.35, 1.05, -0.35], [-0.3, -1.05, -0.3, 1.05],
  ];
  for (const [ax, az, bx, bz] of runways) {
    line(c, [mx + ax, 0.02, mz + az], [mx + bx, 0.02, mz + bz], 0.035, COLORS.text, 1, 0.6);
    line(c, [mx + ax, 0.03, mz + az], [mx + bx, 0.03, mz + bz], 0.16, COLORS.amber, 1.6, 0.9);
  }
  box(c, mx + 0.45, mx + 0.95, mz + 0.55, mz + 0.8, 0.12, 0.6, 0.05);
  line(c, [mx + 0.7, 0, mz + 0.45], [mx + 0.7, 0.55, mz + 0.45], 0.04, COLORS.text, 0.9, 0.7);
  for (let k = 0; k < 8; k++) {
    const a = (k / 8) * Math.PI * 2;
    c.add(mx + 0.7 + Math.cos(a) * 0.05, 0.58, mz + 0.45 + Math.sin(a) * 0.05, COLORS.amber, 1.3, 0.9);
  }

  // Union Stock Yard Gate: limestone arch with the steer's head over it.
  const gx = STOCKYARDS_AT.x;
  const gz = STOCKYARDS_AT.z;
  for (const dz of [-0.22, 0.22]) {
    box(c, gx - 0.06, gx + 0.06, gz + dz - 0.06, gz + dz + 0.06, 0.38, 0.75, 0.035);
  }
  for (let k = 0; k <= 16; k++) {
    const a = Math.PI * (k / 16);
    c.add(gx, 0.3 + Math.sin(a) * 0.12, gz - Math.cos(a) * 0.16, COLORS.text, 1.1, 0.8);
  }
  line(c, [gx, 0.48, gz - 0.28], [gx, 0.48, gz + 0.28], 0.03, COLORS.text, 1, 0.8);
  c.add(gx, 0.55, gz, COLORS.amber, 3, 1);

  // Central Manufacturing District: brick water and clock tower over Pershing Road.
  const cmd = toWorld(CMD_TOWER);
  const half = 0.07;
  box(c, cmd.x - half, cmd.x + half, cmd.z - half, cmd.z + half, 1.15, 0.8, 0.04);
  box(c, cmd.x - 0.3, cmd.x + 0.3, cmd.z - 0.12, cmd.z + 0.3, 0.32, 0.5, 0.05);
  facadeLights(c, rand, cmd.x - 0.3, cmd.x + 0.3, cmd.z - 0.12, 0.32, 0.1);
  for (const [nx, nz] of [[0, -1], [1, 0], [0, 1], [-1, 0]]) {
    for (let k = 0; k < 12; k++) {
      const a = (k / 12) * Math.PI * 2;
      const r = 0.045;
      const along = Math.cos(a) * r;
      c.add(cmd.x + nx * half + nz * along, 0.95 + Math.sin(a) * r, cmd.z + nz * half + nx * along, COLORS.amber, 1.2, 0.95);
    }
  }
  for (let y = 1.15; y < 1.35; y += 0.03) c.add(cmd.x, y, cmd.z, COLORS.text, 1, 0.8);

  // 35th/Archer station: platform and canopy on the Orange Line embankment.
  const st = toWorld(STATION);
  const rise = (dx: number) => dx * 0.55 * -1; // follow the line's southwest run
  for (const y of [0.45, 0.62]) {
    line(c, [st.x - 0.4, y, st.z + rise(-0.4)], [st.x + 0.4, y, st.z + rise(0.4)], 0.03, y > 0.5 ? COLORS.amber : COLORS.text, 1, 0.7);
  }
  for (const dx of [-0.4, -0.13, 0.13, 0.4]) {
    line(c, [st.x + dx, 0.45, st.z + rise(dx)], [st.x + dx, 0.62, st.z + rise(dx)], 0.03, COLORS.text, 0.9, 0.6);
  }
}

/**
 * Guaranteed Rate Field. Built in field coordinates (u from home plate toward
 * center field, v toward the third-base side) and turned to face northeast.
 */
function ballpark(c: Cloud, rand: () => number, at: World) {
  const K = 1.25; // field units to world units; the wall sits at 1 field unit
  const { x: fx, z: fz } = SOX_FACING;
  const hx = at.x - fx * 0.55 * K;
  const hz = at.z - fz * 0.55 * K;
  const P = (u: number, v: number, y: number): [number, number, number] => [
    hx + (fx * u - fz * v) * K, y, hz + (fz * u + fx * v) * K,
  ];
  const polar = (r: number, a: number, y: number) => P(r * Math.cos(a), r * Math.sin(a), y);
  const Q = Math.PI / 4; // the foul lines
  const WHITE = COLORS.text;

  // Grass, with the infield dirt arc cut out of it.
  for (let i = 0; i < 1100; i++) {
    const a = (rand() * 2 - 1) * (Q + 0.1);
    const r = Math.sqrt(rand()) * 0.99;
    if (Math.abs(a) < Q && r > 0.29 && r < 0.42) continue;
    c.add(...polar(r, a, 0.02), COLORS.park, 1.1, 0.4 + rand() * 0.2);
  }
  for (let i = 0; i < 260; i++) {
    c.add(...polar(0.29 + rand() * 0.13, (rand() * 2 - 1) * Q, 0.02), COLORS.amber, 1, 0.3);
  }

  // The diamond: base paths, bases and the mound.
  const d = 0.19;
  const bases: [number, number][] = [[0, 0], [d, -d], [2 * d, 0], [d, d]];
  for (let i = 0; i < 4; i++) {
    const [u0, v0] = bases[i];
    const [u1, v1] = bases[(i + 1) % 4];
    line(c, P(u0, v0, 0.025), P(u1, v1, 0.025), 0.02, COLORS.amber, 1, 0.45);
    c.add(...P(u0, v0, 0.04), WHITE, 2.4, 1);
  }
  for (let k = 0; k < 10; k++) {
    const a = (k / 10) * Math.PI * 2;
    c.add(...P(d + Math.cos(a) * 0.035, Math.sin(a) * 0.035, 0.035), COLORS.amber, 1, 0.6);
  }

  // Foul lines out to the yellow foul poles, and the outfield wall.
  for (const side of [-1, 1]) {
    line(c, P(0, 0, 0.03), polar(1, side * Q, 0.03), 0.02, WHITE, 1, 0.8);
    line(c, polar(1, side * Q, 0.02), polar(1, side * Q, 0.4), 0.02, COLORS.amber, 1.2, 0.9);
  }
  for (let a = -Q; a <= Q; a += 0.015) {
    for (const y of [0.03, 0.06]) c.add(...polar(1, a, y), WHITE, 0.9, 0.5);
    c.add(...polar(1, a, 0.09), COLORS.amber, 1, 0.6);
  }

  // Outfield bleachers, split by the batter's eye in dead center.
  for (let row = 0; row < 5; row++) {
    for (let a = -Q - 0.08; a <= Q + 0.08; a += 0.02) {
      if (Math.abs(a) < 0.16) continue;
      c.add(...polar(1.05 + row * 0.045, a, 0.08 + row * 0.04), WHITE, 0.9, 0.22 + rand() * 0.2);
    }
  }

  // The center-field scoreboard and the pinwheels that spin after a home run.
  const sb = 1.3;
  for (let v = -0.28; v <= 0.28; v += 0.022) {
    for (let y = 0.32; y <= 0.68; y += 0.022) {
      const roll = rand();
      const color = roll < 0.3 ? COLORS.amber : roll < 0.45 ? COLORS.water : WHITE;
      c.add(...P(sb, v, y), color, 1, 0.3 + rand() * 0.5);
    }
  }
  line(c, P(sb, -0.3, 0.3), P(sb, 0.3, 0.3), 0.02, WHITE, 1, 0.8);
  line(c, P(sb, -0.3, 0.7), P(sb, 0.3, 0.7), 0.02, WHITE, 1, 0.8);
  for (const v of [-0.3, 0.3]) line(c, P(sb, v, 0), P(sb, v, 0.7), 0.03, WHITE, 1, 0.6);
  for (const v of [-0.2, 0, 0.2]) {
    const cy = 0.82;
    for (let k = 0; k < 14; k++) {
      const a = (k / 14) * Math.PI * 2;
      c.add(...P(sb, v + Math.cos(a) * 0.07, cy + Math.sin(a) * 0.07), COLORS.amber, 1.4, 1);
    }
    for (let k = 0; k < 4; k++) {
      const a = (k / 4) * Math.PI * 2 + 0.4;
      line(c, P(sb, v, cy), P(sb, v + Math.cos(a) * 0.07, cy + Math.sin(a) * 0.07), 0.02, WHITE, 1, 0.8);
    }
  }

  // The grandstand: rows that follow both foul lines and wrap behind home plate.
  const row = (dist: number, y: number, len: number, color: RGB, size: number, brightness: () => number) => {
    const pts: [number, number][] = [];
    for (let t = len; t > 0; t -= 0.025) pts.push([t * Math.cos(Q) - dist * Math.sin(Q), t * Math.sin(Q) + dist * Math.cos(Q)]);
    for (let a = Q + Math.PI / 2; a <= 2 * Math.PI - Q - Math.PI / 2; a += 0.025 / dist) pts.push([dist * Math.cos(a), dist * Math.sin(a)]);
    for (let t = 0; t < len; t += 0.025) pts.push([t * Math.cos(Q) - dist * Math.sin(Q), -(t * Math.sin(Q) + dist * Math.cos(Q))]);
    for (const [u, v] of pts) c.add(...P(u, v, y), color, size, brightness());
  };
  for (let dist = 0.12; dist <= 0.42; dist += 0.05) {
    row(dist, 0.03 + (dist - 0.12) * 0.6, 0.95, WHITE, 0.9, () => 0.2 + rand() * 0.2);
  }
  row(0.47, 0.3, 0.8, COLORS.amber, 1, () => (rand() < 0.5 ? 0.7 : 0.15)); // lit suites
  for (let dist = 0.52; dist <= 0.8; dist += 0.05) {
    row(dist, 0.38 + (dist - 0.52) * 0.75, 0.75, WHITE, 0.9, () => 0.2 + rand() * 0.2);
  }
  row(0.86, 0.72, 0.72, WHITE, 1, () => 0.65); // roof canopy edge

  // Light towers along the roof.
  for (const [t, side] of [[0.15, 1], [0.5, 1], [0.15, -1], [0.5, -1]] as const) {
    const u = t * Math.cos(Q) - 0.86 * Math.sin(Q);
    const v = side * (t * Math.sin(Q) + 0.86 * Math.cos(Q));
    line(c, P(u, v, 0.72), P(u, v, 1.02), 0.03, WHITE, 0.9, 0.6);
    for (let i = -2; i <= 2; i++) {
      for (let j = 0; j < 3; j++) c.add(...P(u + i * 0.02, v, 1.03 + j * 0.025), COLORS.amber, 2, 1);
    }
  }
}

/** Scattered lit office windows on one face of a tower. */
function facadeLights(c: Cloud, rand: () => number, x0: number, x1: number, z: number, h: number, step: number) {
  for (let y = 0.1; y < h; y += step) {
    for (let x = x0 + 0.03; x < x1; x += 0.045) {
      if (rand() < 0.4) c.add(x, y, z, rand() < 0.5 ? COLORS.amber : COLORS.text, 0.9, 0.35 + rand() * 0.4);
    }
  }
}

const mi = (p: GridPoint) => `${milesFromCenter(p).toFixed(1)} mi`;
const atGrid = (p: GridPoint): World => toWorld(p);

/** Labels pinned to points in the scene. `sub` is a second, smaller line. */
export const LABELS: { text: string; sub?: string; at: World; y: number; accent?: boolean; far?: boolean }[] = [
  { text: 'Geographic center of Chicago', at: atGrid(CENTER), y: 3.3, accent: true },
  { text: 'Guaranteed Rate Field', sub: `White Sox · ${mi(SOX)}`, at: SOX_AT, y: 1.35, far: true },
  { text: 'Midway Airport', sub: mi(MIDWAY), at: MIDWAY_AT, y: 0.7, far: true },
  { text: 'Union Stock Yard Gate', sub: `1879 · ${mi(STOCKYARDS)}`, at: STOCKYARDS_AT, y: 0.65, far: true },
  { text: 'McKinley Park', at: atGrid({ w: 2200, s: 3880 }), y: 0.4 },
  { text: 'Central Manufacturing District', sub: 'Pershing Rd water tower', at: atGrid(CMD_TOWER), y: 1.35 },
  { text: '35th/Archer', sub: 'Orange Line', at: atGrid(STATION), y: 0.75 },
  { text: 'Archer Ave', at: atGrid({ w: 2900, s: archerS(2900) }), y: 0.2 },
  { text: 'I-55 Stevenson', at: atGrid({ w: 1500, s: stevensonS(1500) }), y: 0.5 },
  { text: 'Sanitary & Ship Canal', at: atGrid({ w: 2950, s: riverS(2950) }), y: 0.15 },
  { text: 'Bubbly Creek', at: atGrid({ w: BUBBLY_CREEK_W, s: 3650 }), y: 0.15 },
  { text: 'Brighton Park', at: atGrid({ w: 3000, s: 4250 }), y: 0.15 },
];
