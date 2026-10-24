/**
 * Downtown Chicago: the Loop, River North, Streeterville, the South Loop and
 * the West Loop, with the river, the lakefront and the famous towers.
 *
 * It keeps its true compass direction from the geographic center but sits
 * closer than its real ~5 miles, and its ground plan is drawn at 45% of the
 * neighborhood's scale so the whole skyline fits in one view. Heights are not
 * shrunk: one world unit is about 120 m, so the towers keep their real
 * proportions to each other.
 */
import {
  GLOW, TONES, X, Z, ball, box, circle, lit, milesFromCenter, onHorizon, ribbon, riverS, rng, tree, tube,
  type GridPoint, type RGB, type World,
} from './scene';
import type { Solid, V } from './solid';

/** Facade colors, as sRGB. */
const FACADE = {
  black: [0.13, 0.13, 0.15],
  white: [0.82, 0.8, 0.76],
  terraCotta: [0.9, 0.88, 0.82],
  limestone: [0.7, 0.66, 0.56],
  silverGlass: [0.55, 0.62, 0.7],
  blueGlass: [0.33, 0.48, 0.6],
  granite: [0.46, 0.36, 0.31],
  bronze: [0.2, 0.17, 0.13],
  steel: [0.8, 0.82, 0.85],
} as const satisfies Record<string, RGB>;

// Ordinary towers: glass, steel and stone in muted greys.
const GLASS: RGB[] = [[0.3, 0.34, 0.4], [0.4, 0.44, 0.5], [0.5, 0.5, 0.52], [0.36, 0.4, 0.38], [0.55, 0.52, 0.48], [0.26, 0.3, 0.36]];

/** Address-grid point; north and east of State and Madison are negative. */
const WILLIS: GridPoint = { w: 350, s: 233 }; // 233 S Wacker Dr
const SCALE = 0.45;

export const DOWNTOWN_ANCHOR = onHorizon(WILLIS, 20);

/** World position of a downtown address. */
export const D = (w: number, s: number): World => ({
  x: DOWNTOWN_ANCHOR.x + ((WILLIS.w - w) / 100) * SCALE,
  z: DOWNTOWN_ANCHOR.z + ((s - WILLIS.s) / 100) * SCALE,
});
const plan = (w: number, s: number): [number, number] => {
  const p = D(w, s);
  return [p.x, p.z];
};
const at = (w: number, s: number, y: number): V => {
  const p = D(w, s);
  return [p.x, y, p.z];
};

/** Real height in metres to world units. */
const m = (metres: number) => metres / 120;

/** The elevated Loop: Lake St, Wabash Ave, Van Buren St and Wells St. */
export const LOOP_L = { north: -200, east: -45, south: 400, west: 200 };

// Lake Michigan shoreline, north to south, as [west address, south address].
const SHORE: [number, number][] = [
  [-60, -1500], [-100, -1100], [-200, -1000], [-450, -720], [-600, -600], [-560, -420],
  [-520, -250], [-500, 0], [-480, 600], [-450, 1100], [-560, 1180], [-900, 1250],
  [-560, 1330], [-470, 1450], [-520, 1700], [-560, 1950],
];

/** West address of the shoreline at a given south address. */
function shoreW(s: number) {
  for (let i = 0; i < SHORE.length - 1; i++) {
    const [w0, s0] = SHORE[i];
    const [w1, s1] = SHORE[i + 1];
    if (s >= s0 && s <= s1) return w0 + ((s - s0) / (s1 - s0)) * (w1 - w0);
  }
  return s < SHORE[0][1] ? SHORE[0][0] : SHORE[SHORE.length - 1][0];
}

// The river: main stem from the lake to Wolf Point, then the two branches.
const MAIN_STEM: [number, number][] = [[-560, -340], [330, -340]];
const NORTH_BRANCH: [number, number][] = [[330, -340], [420, -800], [560, -1400], [700, -1900]];
const SOUTH_BRANCH: [number, number][] = [[330, -340], [420, 0], [430, 1100], [560, 1700], [620, 2000]];
const RIVERS = [MAIN_STEM, NORTH_BRANCH, SOUTH_BRANCH];

function distToPolyline(w: number, s: number, pts: [number, number][]) {
  let best = Infinity;
  for (let i = 0; i < pts.length - 1; i++) {
    const [aw, as] = pts[i];
    const [bw, bs] = pts[i + 1];
    const dw = bw - aw;
    const ds = bs - as;
    const t = Math.max(0, Math.min(1, ((w - aw) * dw + (s - as) * ds) / (dw * dw + ds * ds)));
    best = Math.min(best, Math.hypot(w - (aw + t * dw), s - (as + t * ds)));
  }
  return best;
}

const GRANT_PARK = { wEast: -470, wWest: -110, sNorth: -150, sSouth: 1150 };
const inGrantPark = (w: number, s: number) =>
  w <= GRANT_PARK.wWest && w >= Math.max(GRANT_PARK.wEast, shoreW(s) + 20) && s >= GRANT_PARK.sNorth && s <= GRANT_PARK.sSouth;

/* ─── Drawing helpers ─────────────────────────────────────────────────── */

/** Lit office windows scattered over all four faces of a box. */
function windows(S: Solid[], rand: () => number, x0: number, x1: number, z0: number, z1: number, h: number, density = 0.2) {
  const e = 0.003;
  for (let y = 0.08; y < h - 0.03; y += 0.09) {
    for (let x = x0 + 0.02; x < x1 - 0.005; x += 0.035) {
      if (rand() < density) lit(S, x, y, z0 - e, 'z', 0.02, 0.04);
      if (rand() < density) lit(S, x, y, z1 + e, 'z', 0.02, 0.04);
    }
    for (let z = z0 + 0.02; z < z1 - 0.005; z += 0.035) {
      if (rand() < density) lit(S, x0 - e, y, z, 'x', 0.02, 0.04);
      if (rand() < density) lit(S, x1 + e, y, z, 'x', 0.02, 0.04);
    }
  }
}

/** A plain rectangular tower centred on (cx, cz), in `tone` or a random glass. */
function tower(S: Solid[], rand: () => number, cx: number, cz: number, hw: number, hd: number, h: number, tone?: RGB, density = 0.2) {
  box(S, cx - hw, cx + hw, cz - hd, cz + hd, h, tone ?? GLASS[Math.floor(rand() * GLASS.length)]);
  windows(S, rand, cx - hw, cx + hw, cz - hd, cz + hd, h, density);
}

const cyl = (S: Solid[], cx: number, cz: number, r0: number, r1: number, y0: number, y1: number, color: RGB, glow = false, seg = 14) =>
  S.push({ kind: 'cyl', cx, cz, r0, r1, y0, y1, seg, color, glow });

/* ─── Landmarks ───────────────────────────────────────────────────────── */

type Landmark = { name: string; w: number; s: number; top: number; draw: (S: Solid[], rand: () => number, p: World) => void };

const LANDMARKS: Landmark[] = [
  {
    name: 'Willis Tower', w: 350, s: 233, top: m(442) + 0.75,
    // Nine bundled tubes that stop at different heights, and two antennas.
    draw: (S, rand, p) => {
      const tube7 = 0.07;
      const heights = [[0.46, 0.61, 0.83], [0.83, 1, 1], [0.61, 0.83, 0.46]];
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          const x0 = p.x + (i - 1.5) * tube7;
          const z0 = p.z + (j - 1.5) * tube7;
          const h = heights[i][j] * m(442);
          box(S, x0, x0 + tube7, z0, z0 + tube7, h, FACADE.black);
          windows(S, rand, x0, x0 + tube7, z0, z0 + tube7, h, 0.12);
        }
      }
      for (const dx of [-0.03, 0.04]) {
        tube(S, [[p.x + dx, m(442), p.z], [p.x + dx, m(442) + 0.72, p.z]], 0.007, FACADE.steel);
        ball(S, p.x + dx, m(442) + 0.74, p.z, 0.015, GLOW.red, 0.015, true);
      }
    },
  },
  {
    name: 'John Hancock Center', w: -110, s: -875, top: m(344) + 0.5,
    // Tapered black shaft with the X-bracing down every face.
    draw: (S, _rand, p) => {
      const h = m(344);
      const base = 0.1;
      const top = 0.06;
      S.push({ kind: 'frustum', cx: p.x, cz: p.z, bx: base, bz: base * 0.65, tx: top, tz: top * 0.65, y0: 0, y1: h, color: FACADE.black });
      const corners = (half: number, y: number): V[] =>
        [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([sx, sz]) => [p.x + sx * (half + 0.003), y, p.z + sz * (half * 0.65 + 0.003)]);
      const bays = 5;
      for (let b = 0; b < bays; b++) {
        const lo = corners(base + (top - base) * (b / bays), (b / bays) * h);
        const hi = corners(base + (top - base) * ((b + 1) / bays), ((b + 1) / bays) * h);
        for (let k = 0; k < 4; k++) {
          const n = (k + 1) % 4;
          tube(S, [lo[k], hi[n]], 0.004, [0.3, 0.3, 0.32]);
          tube(S, [lo[n], hi[k]], 0.004, [0.3, 0.3, 0.32]);
        }
      }
      for (const dx of [-0.025, 0.025]) tube(S, [[p.x + dx, h, p.z], [p.x + dx, h + 0.45, p.z]], 0.006, FACADE.steel);
    },
  },
  {
    name: 'Trump Tower', w: -60, s: -400, top: m(423),
    // Three setbacks that line up with the cornices of its neighbours, then a spire.
    draw: (S, rand, p) => {
      for (const [half, frac] of [[0.08, 0.38], [0.06, 0.65], [0.04, 0.86]]) {
        box(S, p.x - half, p.x + half, p.z - half * 0.55, p.z + half * 0.55, frac * m(423), FACADE.silverGlass);
        windows(S, rand, p.x - half, p.x + half, p.z - half * 0.55, p.z + half * 0.55, frac * m(423), 0.08);
      }
      tube(S, [[p.x, 0.86 * m(423), p.z], [p.x, m(423), p.z]], 0.008, FACADE.steel);
    },
  },
  {
    name: 'St. Regis Chicago', w: -363, s: -300, top: m(363),
    // Three linked frustums of different heights.
    draw: (S, rand, p) => {
      for (const [dx, dz, frac] of [[-0.06, 0.02, 0.62], [0, -0.01, 1], [0.06, 0.015, 0.8]]) {
        const h = frac * m(363);
        S.push({ kind: 'frustum', cx: p.x + dx, cz: p.z + dz, bx: 0.032, bz: 0.036, tx: 0.026, tz: 0.032, y0: 0, y1: h, color: FACADE.blueGlass });
        windows(S, rand, p.x + dx - 0.03, p.x + dx + 0.03, p.z + dz - 0.036, p.z + dz + 0.036, h, 0.08);
      }
    },
  },
  {
    name: 'Aon Center', w: -260, s: -160, top: m(346),
    draw: (S, rand, p) => tower(S, rand, p.x, p.z, 0.065, 0.065, m(346), FACADE.white, 0.12),
  },
  {
    name: 'Two Prudential Plaza', w: -140, s: -190, top: m(303),
    // A stepped pyramid crown topped with a spire.
    draw: (S, rand, p) => {
      const h = m(250);
      tower(S, rand, p.x, p.z, 0.045, 0.045, h, TONES.greystone);
      for (let k = 0; k < 4; k++) {
        const half = 0.045 - k * 0.011;
        box(S, p.x - half, p.x + half, p.z - half, p.z + half, h + (k + 1) * 0.07, TONES.greystone, h + k * 0.07);
      }
      tube(S, [[p.x, h + 0.28, p.z], [p.x, m(303), p.z]], 0.006, FACADE.steel);
    },
  },
  {
    name: 'Franklin Center', w: 227, s: 100, top: m(307),
    // Setbacks and twin rooftop spires.
    draw: (S, rand, p) => {
      tower(S, rand, p.x, p.z, 0.06, 0.06, m(220), FACADE.granite);
      box(S, p.x - 0.04, p.x + 0.04, p.z - 0.04, p.z + 0.04, m(270), FACADE.granite, m(220));
      for (const dx of [-0.025, 0.025]) tube(S, [[p.x + dx, m(270), p.z], [p.x + dx, m(307), p.z]], 0.006, FACADE.steel);
    },
  },
  {
    name: '311 S Wacker', w: 410, s: 311, top: m(293),
    // Tall shaft under a glowing cylindrical crown.
    draw: (S, rand, p) => {
      tower(S, rand, p.x, p.z, 0.05, 0.05, m(255), FACADE.granite);
      cyl(S, p.x, p.z, 0.04, 0.04, m(255), m(293), GLOW.warm, true, 16);
    },
  },
  {
    name: 'Chase Tower', w: 40, s: 10, top: m(259),
    draw: (S, rand, p) => tower(S, rand, p.x, p.z, 0.06, 0.035, m(259), TONES.greystone),
  },
  {
    name: 'Marina City', w: 10, s: -320, top: m(179),
    // The twin "corncobs": a parking spiral below, scalloped balconies above.
    draw: (S, _rand, p) => {
      for (const dx of [-0.045, 0.045]) {
        cyl(S, p.x + dx, p.z, 0.026, 0.026, 0, 0.5, TONES.concrete);
        cyl(S, p.x + dx, p.z, 0.028, 0.028, 0.5, m(179), FACADE.white);
        for (let y = 0.52; y < m(179); y += 0.06) cyl(S, p.x + dx, p.z, 0.036, 0.036, y, y + 0.012, FACADE.white, false, 16);
      }
    },
  },
  {
    name: 'Wrigley Building', w: -95, s: -410, top: m(134),
    // White terra cotta block with the clock tower.
    draw: (S, rand, p) => {
      box(S, p.x - 0.06, p.x + 0.06, p.z - 0.03, p.z + 0.03, m(90), FACADE.terraCotta);
      windows(S, rand, p.x - 0.06, p.x + 0.06, p.z - 0.03, p.z + 0.03, m(90), 0.2);
      box(S, p.x + 0.02, p.x + 0.05, p.z - 0.015, p.z + 0.015, m(125), FACADE.terraCotta);
      lit(S, p.x + 0.035, m(110), p.z - 0.019, 'z', 0.022, 0.022, GLOW.warm);
      tube(S, [[p.x + 0.035, m(125), p.z], [p.x + 0.035, m(134), p.z]], 0.006, FACADE.terraCotta);
    },
  },
  {
    name: 'Tribune Tower', w: -135, s: -445, top: m(141),
    // Gothic shaft with its ring of flying buttresses at the top.
    draw: (S, rand, p) => {
      tower(S, rand, p.x, p.z, 0.035, 0.035, m(115), FACADE.limestone);
      for (let k = 0; k < 8; k++) {
        const a = (k / 8) * Math.PI * 2;
        tube(S, [[p.x + Math.cos(a) * 0.035, m(115), p.z + Math.sin(a) * 0.035], [p.x + Math.cos(a) * 0.02, m(141), p.z + Math.sin(a) * 0.02]], 0.005, FACADE.limestone);
      }
    },
  },
  {
    name: 'Lake Point Tower', w: -620, s: -505, top: m(197),
    // Three curved bronze wings around a core, alone on the lakefront.
    draw: (S, _rand, p) => {
      for (let k = 0; k < 3; k++) {
        const a = (k / 3) * Math.PI * 2 + 0.3;
        cyl(S, p.x + Math.cos(a) * 0.03, p.z + Math.sin(a) * 0.03, 0.028, 0.028, 0, m(197), FACADE.bronze);
      }
    },
  },
  {
    name: 'Merchandise Mart', w: 300, s: -380, top: m(105),
    // Once the largest building in the world: a long, squat block on the river.
    draw: (S, rand, p) => tower(S, rand, p.x, p.z, 0.15, 0.07, m(105), TONES.tanBrick, 0.25),
  },
  {
    name: 'Water Tower Place', w: -40, s: -840, top: m(262),
    draw: (S, rand, p) => tower(S, rand, p.x, p.z, 0.05, 0.05, m(262), FACADE.white, 0.12),
  },
  {
    name: 'Old Water Tower', w: -80, s: -800, top: m(47),
    // The 1869 limestone tower that survived the Great Fire.
    draw: (S, _rand, p) => {
      box(S, p.x - 0.02, p.x + 0.02, p.z - 0.02, p.z + 0.02, m(25), FACADE.limestone);
      cyl(S, p.x, p.z, 0.01, 0.006, m(25), m(47), FACADE.limestone, false, 8);
    },
  },
  {
    name: 'Navy Pier', w: -620, s: -560, top: 0.55,
    // The pier, its headhouse and the Centennial Wheel.
    draw: (S, _rand, p) => {
      const end = D(-1150, -560);
      box(S, p.x, end.x, p.z - 0.05, p.z + 0.05, 0.035, TONES.concrete);
      box(S, p.x + 0.05, end.x - 0.2, p.z - 0.04, p.z + 0.04, 0.09, TONES.greystone, 0.035);
      box(S, end.x - 0.15, end.x, p.z - 0.06, p.z + 0.06, 0.18, TONES.greystone);
      // Centennial Wheel, turned to face south along the pier.
      const wx = p.x + 0.35;
      const hub = 0.27;
      const r = 0.22;
      tube(S, circle(wx, hub, p.z, r, 40, 'z'), 0.006, GLOW.amber, true);
      for (let k = 0; k < 12; k++) {
        const a = (k / 12) * Math.PI * 2;
        tube(S, [[wx, hub, p.z], [wx + Math.cos(a) * r, hub + Math.sin(a) * r, p.z]], 0.003, FACADE.steel);
        box(S, wx + Math.cos(a) * r - 0.012, wx + Math.cos(a) * r + 0.012, p.z - 0.012, p.z + 0.012, hub + Math.sin(a) * r, GLOW.warm, hub + Math.sin(a) * r - 0.025, true);
      }
      tube(S, [[wx - 0.08, 0.035, p.z], [wx, hub, p.z], [wx + 0.08, 0.035, p.z]], 0.006, FACADE.steel);
    },
  },
  {
    name: 'Cloud Gate', w: -170, s: 40, top: 0.1,
    // "The Bean": a polished steel bean in Millennium Park.
    draw: (S, _rand, p) => S.push({ kind: 'ball', cx: p.x, cy: 0.035, cz: p.z, rx: 0.045, ry: 0.025, rz: 0.03, color: FACADE.steel }),
  },
  {
    name: 'Buckingham Fountain', w: -300, s: 500, top: 0.25,
    // Tiered basins and the lit central jet.
    draw: (S, _rand, p) => {
      cyl(S, p.x, p.z, 0.12, 0.12, 0, 0.02, TONES.water, false, 24);
      cyl(S, p.x, p.z, 0.07, 0.06, 0.02, 0.05, TONES.greystone, false, 18);
      cyl(S, p.x, p.z, 0.04, 0.035, 0.05, 0.08, TONES.greystone, false, 14);
      cyl(S, p.x, p.z, 0.01, 0.004, 0.08, 0.25, GLOW.screen, true, 6);
    },
  },
  {
    name: 'Soldier Field', w: -430, s: 1550, top: 0.35,
    // The modern bowl rising above the old colonnades.
    draw: (S, _rand, p) => {
      const tiers: V[][] = [];
      for (let tier = 0; tier < 5; tier++) {
        tiers.push(Array.from({ length: 57 }, (_, k) => {
          const a = (k / 56) * Math.PI * 2;
          return [p.x + Math.cos(a) * (0.1 + tier * 0.02), 0.04 + tier * 0.05, p.z + Math.sin(a) * (0.16 + tier * 0.02)] as V;
        }));
      }
      const outer = tiers[tiers.length - 1];
      S.push({ kind: 'loft', rows: tiers, color: TONES.seats });
      S.push({ kind: 'loft', rows: [outer, outer.map(([x, , z]) => [x, 0, z] as V)], color: TONES.greystone });
      S.push({ kind: 'cyl', cx: p.x, cz: p.z, r0: 0.08, r1: 0.08, y0: 0, y1: 0.03, seg: 20, sz: 1.6, color: TONES.lawn });
      for (const dx of [-0.17, 0.17]) {
        for (let dz = -0.12; dz <= 0.12; dz += 0.03) cyl(S, p.x + dx, p.z + dz, 0.007, 0.007, 0, 0.12, FACADE.limestone, false, 6);
      }
    },
  },
  {
    name: 'Field Museum', w: -380, s: 1400, top: 0.25,
    draw: (S, _rand, p) => box(S, p.x - 0.1, p.x + 0.1, p.z - 0.05, p.z + 0.05, 0.2, FACADE.white),
  },
  {
    name: 'Shedd Aquarium', w: -640, s: 1225, top: 0.2,
    draw: (S, _rand, p) => {
      box(S, p.x - 0.07, p.x + 0.07, p.z - 0.05, p.z + 0.05, 0.12, FACADE.white);
      cyl(S, p.x, p.z, 0.03, 0.01, 0.12, 0.17, TONES.water, false, 8);
    },
  },
  {
    name: 'Adler Planetarium', w: -870, s: 1255, top: 0.18,
    draw: (S, _rand, p) => {
      cyl(S, p.x, p.z, 0.06, 0.06, 0, 0.04, FACADE.limestone, false, 12);
      S.push({ kind: 'ball', cx: p.x, cy: 0.04, cz: p.z, rx: 0.045, ry: 0.05, rz: 0.045, color: FACADE.bronze });
    },
  },
];

/** Downtown landmark labels, most famous first. */
const LABELED = [
  'Willis Tower', 'John Hancock Center', 'Trump Tower', 'Navy Pier', 'Soldier Field', 'St. Regis Chicago',
  'Aon Center', 'Marina City', 'Wrigley Building', 'Buckingham Fountain', 'Cloud Gate', 'Merchandise Mart',
  'Tribune Tower', 'Lake Point Tower', '311 S Wacker', 'Field Museum', 'Two Prudential Plaza', 'Franklin Center',
];

export const DOWNTOWN_LABELS = LABELED.map((name) => {
  const l = LANDMARKS.find((x) => x.name === name)!;
  const sub = name === 'Willis Tower' ? `Downtown · ${milesFromCenter({ w: l.w, s: l.s }).toFixed(1)} mi` : undefined;
  return { text: name, sub, at: D(l.w, l.s), y: l.top + 0.08, far: true };
}).concat([
  { text: 'Lake Michigan', sub: undefined, at: D(-1300, 300), y: 0.15, far: true },
  { text: 'The Loop ‘L’', sub: undefined, at: D(LOOP_L.west, LOOP_L.north), y: 0.42, far: true },
]);

/* ─── Districts of ordinary towers ────────────────────────────────────── */

// Rectangles in addresses, with typical height ranges in metres.
const DISTRICTS = [
  { w: [-100, 420], s: [-300, 480], h: [80, 240], per: 5 }, // Loop
  { w: [-500, -150], s: [-330, -170], h: [110, 250], per: 3 }, // Lakeshore East
  { w: [-100, 480], s: [-950, -370], h: [40, 190], per: 4 }, // River North
  { w: [-560, -100], s: [-1000, -380], h: [70, 240], per: 4 }, // Streeterville
  { w: [-200, 100], s: [-1500, -1000], h: [50, 170], per: 3 }, // Gold Coast
  { w: [-110, 420], s: [500, 1700], h: [40, 200], per: 3 }, // South Loop
  { w: [450, 1150], s: [-300, 800], h: [25, 140], per: 3 }, // West Loop
] as const;

/** Distance in addresses from the elevated Loop's tracks. */
const fromLoopL = (w: number, s: number) => {
  const { north, east, south, west } = LOOP_L;
  const ring = distToPolyline(w, s, [[west, north], [east, north], [east, south], [west, south], [west, north]]);
  // The Orange Line comes up Wabash from Roosevelt to join it.
  return Math.min(ring, distToPolyline(w, s, [[east, south], [east, 1200]]));
};

export function buildDowntown(S: Solid[]) {
  const rand = rng(60606);
  const taken = LANDMARKS.map((l) => ({ w: l.w, s: l.s }));

  for (const l of LANDMARKS) l.draw(S, rand, D(l.w, l.s));

  for (const d of DISTRICTS) {
    for (let w = d.w[0]; w < d.w[1]; w += 100) {
      for (let s = d.s[0]; s < d.s[1]; s += 100) {
        for (let i = 0; i < d.per; i++) {
          const bw = w + 10 + rand() * 80;
          const bs = s + 10 + rand() * 80;
          if (bw < shoreW(bs) + 40) continue; // in the lake
          if (inGrantPark(bw, bs)) continue;
          if (RIVERS.some((r) => distToPolyline(bw, bs, r) < 35)) continue;
          if (fromLoopL(bw, bs) < 22) continue; // keep the 'L' clear
          if (taken.some((t) => Math.hypot(t.w - bw, t.s - bs) < 55)) continue;
          taken.push({ w: bw, s: bs });
          const metres = d.h[0] + rand() ** 1.6 * (d.h[1] - d.h[0]);
          const p = D(bw, bs);
          const hw = 0.02 + rand() * 0.035;
          const hd = 0.02 + rand() * 0.035;
          tower(S, rand, p.x, p.z, hw, hd, m(metres));
          // A share of the taller ones carry a red aircraft beacon.
          if (metres > 180 && rand() < 0.4) ball(S, p.x, m(metres) + 0.02, p.z, 0.012, GLOW.red, 0.012, true);
        }
      }
    }
  }

  // Lake Michigan, with Lake Shore Drive along its edge.
  const shore: [number, number][] = [];
  for (let s = SHORE[0][1]; s <= SHORE[SHORE.length - 1][1]; s += 20) shore.push([shoreW(s), s]);
  const first = shore[0];
  const last = shore[shore.length - 1];
  S.push({
    kind: 'poly',
    pts: [...shore.map(([w, s]) => plan(w, s)), plan(last[0] - 3000, last[1]), plan(first[0] - 3000, first[1])],
    y: 0.003,
    color: TONES.water,
  });
  ribbon(S, shore.map(([w, s]) => plan(w + 40, s)), 0.05, 0.007, TONES.avenue);

  // Streets: the Loop's main north-south and east-west streets, on land.
  const onLand = (w: number, s: number) => w > shoreW(s) + 25;
  for (const w of [400, 300, 200, 100, 0, -100]) {
    let run: [number, number][] = [];
    for (let s = -1500; s <= 1900; s += 20) {
      if (onLand(w, s)) run.push(plan(w, s));
      else if (run.length) (ribbon(S, run, 0.03, 0.006, TONES.street), (run = []));
    }
    if (run.length > 1) ribbon(S, run, 0.03, 0.006, TONES.street);
  }
  for (const s of [-1200, -800, -400, 0, 400, 800, 1200, 1600]) {
    const w0 = shoreW(s) + 30;
    ribbon(S, [plan(1200, s), plan(w0, s)], 0.03, 0.006, TONES.street);
  }

  // The river, and a bascule bridge at every street that crosses it.
  for (const r of RIVERS) ribbon(S, r.map(([w, s]) => plan(w, s)), 0.14, 0.004, TONES.water);
  for (let w = 300; w >= -400; w -= 100) {
    const a = D(w, -380);
    const b = D(w, -300);
    box(S, a.x - 0.018, a.x + 0.018, a.z, b.z, 0.03, [0.32, 0.22, 0.18], 0.012);
  }
  for (const s of [-800, -400, 0, 400, 800]) {
    const w = s < -340 ? 380 + ((s + 340) / -460) * 90 : 420;
    const a = D(w + 40, s);
    const b = D(w - 40, s);
    box(S, a.x, b.x, a.z - 0.018, a.z + 0.018, 0.03, [0.32, 0.22, 0.18], 0.012);
  }

  // The South Branch continues to meet the neighborhood's stretch of river.
  const branchEnd = D(620, 2000);
  ribbon(S, [[branchEnd.x, branchEnd.z], [X(1200), Z(riverS(1200))]], 0.14, 0.004, TONES.water);

  // Grant Park and Millennium Park, with rows of trees.
  const park: [number, number][] = [];
  for (let s = GRANT_PARK.sNorth; s <= GRANT_PARK.sSouth; s += 25) park.push(plan(GRANT_PARK.wWest, s));
  for (let s = GRANT_PARK.sSouth; s >= GRANT_PARK.sNorth; s -= 25) park.push(plan(Math.max(GRANT_PARK.wEast, shoreW(s) + 20), s));
  S.push({ kind: 'poly', pts: park, y: 0.005, color: TONES.lawn });
  for (let i = 0; i < 110; i++) {
    const w = GRANT_PARK.wEast + rand() * (GRANT_PARK.wWest - GRANT_PARK.wEast);
    const s = GRANT_PARK.sNorth + rand() * (GRANT_PARK.sSouth - GRANT_PARK.sNorth);
    if (!inGrantPark(w, s) || Math.hypot(w + 300, s - 500) < 60) continue;
    const p = D(w, s);
    tree(S, rand, p.x, p.z, 0.09);
  }
}

/** World points for an address path, used by the transit lines. */
export const downtownPath = (pts: [number, number][], y: number): V[] => pts.map(([w, s]) => at(w, s, y));
