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

type RGB = readonly [number, number, number];

/** Seeded so the skyline is the same on every visit. */
function rng(seed: number) {
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

/** The static city: street grid, buildings, park and the diagonal roads. */
export function buildCity(): Cloud {
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

  // Buildings: lots per block, low two-flats and bungalows, warehouses on the
  // industrial strip by the river and along Bubbly Creek.
  for (let w = BOUNDS.wEast; w < BOUNDS.wWest; w += 100) {
    for (let s = BOUNDS.sNorth; s < BOUNDS.sSouth; s += 100) {
      const cw = w + 50;
      const cs = s + 50;
      if (inPark(cw, cs)) continue;
      const corridor = cs < stevensonS(cw) + 40 && cs > riverS(cw) + 25;
      const industrial = corridor || (cw < 1700 && cs < 3800);
      if (!corridor && cs < stevensonS(cw) + 40) continue;
      const lots = industrial ? 2 : 6;
      for (let i = 0; i < lots; i++) {
        const lw = w + 15 + rand() * 70;
        const ls = s + 15 + rand() * 70;
        if (nearDiagonal(lw, ls, archerS, 12)) continue;
        const height = industrial ? 0.35 + rand() * 0.9 : 0.12 + rand() * 0.38;
        const footprint = industrial ? 0.22 : 0.08;
        const brightness = 0.35 + rand() * 0.45;
        const tint = rand() < 0.06 ? COLORS.amber : COLORS.text;
        for (let y = 0.06; y <= height; y += 0.07) {
          for (const [dx, dz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
            c.add(X(lw) + dx * footprint, y, Z(ls) + dz * footprint, tint, 1, brightness * (0.6 + y / height / 2));
          }
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
    for (let k = 0; k < 14; k++) {
      const a = rand() * Math.PI * 2;
      const r = rand() * 0.12;
      c.add(X(w) + Math.cos(a) * r, 0.18 + rand() * 0.2, Z(s) + Math.sin(a) * r, COLORS.park, 1.2, 0.8);
    }
  }

  return c;
}

/** One point travelling along a path; `t` in [0, 1) advances by `speed` each second. */
export type Mover = { path: (t: number) => [number, number, number]; t: number; speed: number };

export function buildMovers(): { water: Mover[]; traffic: Mover[]; train: Mover[] } {
  const rand = rng(3528);
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

  return { water, traffic, train };
}

/** Labels pinned to points in the scene. */
export const LABELS: { text: string; at: GridPoint; y: number; accent?: boolean }[] = [
  { text: 'Geographic center of Chicago', at: CENTER, y: 3.3, accent: true },
  { text: 'McKinley Park', at: { w: 2200, s: 3880 }, y: 0.4 },
  { text: 'Archer Ave', at: { w: 2900, s: archerS(2900) }, y: 0.2 },
  { text: 'I-55 Stevenson', at: { w: 1500, s: stevensonS(1500) }, y: 0.5 },
  { text: 'Chicago River', at: { w: 2900, s: riverS(2900) }, y: 0.15 },
  { text: 'Western Ave', at: { w: 2400, s: 4300 }, y: 0.15 },
];
