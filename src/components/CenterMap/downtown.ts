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
  COLORS, Cloud, TONES, X, Z, box, line, milesFromCenter, onHorizon, riverS, rng,
  type GridPoint, type RGB, type World,
} from './scene';

/** Facade colors for the solid view, as sRGB. */
const FACADE = {
  black: [0.13, 0.13, 0.15],
  white: [0.82, 0.8, 0.76],
  terraCotta: [0.9, 0.88, 0.82],
  limestone: [0.7, 0.66, 0.56],
  silverGlass: [0.55, 0.62, 0.7],
  blueGlass: [0.33, 0.48, 0.6],
  granite: [0.46, 0.36, 0.31],
  bronze: [0.2, 0.17, 0.13],
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

/** Real height in metres to world units. */
const m = (metres: number) => metres / 120;

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

type V = [number, number, number];
const at = (w: number, s: number, y: number): V => {
  const p = D(w, s);
  return [p.x, y, p.z];
};

/** Lit office windows on all four faces of a box. */
function lights(c: Cloud, rand: () => number, x0: number, x1: number, z0: number, z1: number, h: number, density = 0.35) {
  for (let y = 0.08; y < h - 0.03; y += 0.09) {
    for (let x = x0 + 0.02; x < x1 - 0.005; x += 0.035) {
      for (const z of [z0, z1]) {
        if (rand() < density) c.add(x, y, z, rand() < 0.55 ? COLORS.amber : COLORS.text, 0.85, 0.3 + rand() * 0.45);
      }
    }
    for (let z = z0 + 0.02; z < z1 - 0.005; z += 0.035) {
      for (const x of [x0, x1]) {
        if (rand() < density) c.add(x, y, z, rand() < 0.55 ? COLORS.amber : COLORS.text, 0.85, 0.3 + rand() * 0.45);
      }
    }
  }
}

/** A plain rectangular tower centred on (cx, cz), in `tone` or a random glass. */
function tower(c: Cloud, rand: () => number, cx: number, cz: number, hw: number, hd: number, h: number, b = 0.5, tone?: RGB) {
  c.tone = tone ?? GLASS[Math.floor(rand() * GLASS.length)];
  box(c, cx - hw, cx + hw, cz - hd, cz + hd, h, b, 0.06);
  lights(c, rand, cx - hw, cx + hw, cz - hd, cz + hd, h);
}

/** Vertical ring of points, used for cylinders, crowns and the Ferris wheel. */
function ring(c: Cloud, cx: number, y: number, cz: number, r: number, n: number, color: RGB, size: number, b: number) {
  for (let k = 0; k < n; k++) {
    const a = (k / n) * Math.PI * 2;
    c.add(cx + Math.cos(a) * r, y, cz + Math.sin(a) * r, color, size, b);
  }
}

/* ─── Landmarks ───────────────────────────────────────────────────────── */

type Landmark = { name: string; w: number; s: number; top: number; sub?: string; draw: (c: Cloud, rand: () => number, p: World) => void };

const LANDMARKS: Landmark[] = [
  {
    name: 'Willis Tower', w: 350, s: 233, top: m(442) + 0.75,
    // Nine bundled tubes that stop at different heights, and two antennas.
    draw: (c, rand, p) => {
      c.tone = FACADE.black;
      const tube = 0.07;
      const heights = [[0.46, 0.61, 0.83], [0.83, 1, 1], [0.61, 0.83, 0.46]];
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          const x0 = p.x + (i - 1.5) * tube;
          const z0 = p.z + (j - 1.5) * tube;
          const h = heights[i][j] * m(442);
          box(c, x0, x0 + tube, z0, z0 + tube, h, 0.75, 0.05);
          lights(c, rand, x0, x0 + tube, z0, z0 + tube, h, 0.25);
        }
      }
      for (const dx of [-0.03, 0.04]) {
        line(c, [p.x + dx, m(442), p.z], [p.x + dx, m(442) + 0.72, p.z], 0.04, COLORS.text, 0.9, 0.8);
        c.add(p.x + dx, m(442) + 0.75, p.z, COLORS.amber, 2.4, 1);
      }
    },
  },
  {
    name: 'John Hancock Center', w: -110, s: -875, top: m(344) + 0.5,
    // Tapered shaft with the X-bracing down every face.
    draw: (c, _rand, p) => {
      const h = m(344);
      const corners = (half: number, y: number): V[] =>
        [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([sx, sz]) => [p.x + sx * half, y, p.z + sz * half * 0.65]);
      const base = 0.1;
      const top = 0.06;
      const bottom = corners(base, 0);
      const upper = corners(top, h);
      c.solids.push({ kind: 'frustum', cx: p.x, cz: p.z, bx: base, bz: base * 0.65, tx: top, tz: top * 0.65, y0: 0, y1: h, color: FACADE.black });
      c.outline(() => {
        for (let k = 0; k < 4; k++) {
          line(c, bottom[k], upper[k], 0.05, COLORS.text, 0.9, 0.75);
          line(c, upper[k], upper[(k + 1) % 4], 0.03, COLORS.text, 0.9, 0.75);
        }
      });
      const bays = 5;
      for (let b = 0; b < bays; b++) {
        const lo = corners(base + (top - base) * (b / bays), (b / bays) * h);
        const hi = corners(base + (top - base) * ((b + 1) / bays), ((b + 1) / bays) * h);
        for (let k = 0; k < 4; k++) {
          const n = (k + 1) % 4;
          line(c, lo[k], hi[n], 0.04, COLORS.amber, 0.9, 0.55);
          line(c, lo[n], hi[k], 0.04, COLORS.amber, 0.9, 0.55);
        }
      }
      for (const dx of [-0.025, 0.025]) line(c, [p.x + dx, h, p.z], [p.x + dx, h + 0.45, p.z], 0.04, COLORS.text, 0.9, 0.8);
    },
  },
  {
    name: 'Trump Tower', w: -60, s: -400, top: m(423),
    // Three setbacks that line up with the cornices of its neighbours, then a spire.
    draw: (c, rand, p) => {
      c.tone = FACADE.silverGlass;
      const tiers: [number, number][] = [[0.08, 0.38], [0.06, 0.65], [0.04, 0.86]];
      tiers.forEach(([half, frac]) => {
        const h = frac * m(423);
        box(c, p.x - half, p.x + half, p.z - half * 0.55, p.z + half * 0.55, h, 0.65, 0.05);
        lights(c, rand, p.x - half, p.x + half, p.z - half * 0.55, p.z + half * 0.55, h, 0.15);
      });
      line(c, [p.x, 0.86 * m(423), p.z], [p.x, m(423), p.z], 0.03, COLORS.text, 0.9, 0.9);
    },
  },
  {
    name: 'St. Regis Chicago', w: -363, s: -300, top: m(363),
    // Three linked frustums of different heights.
    draw: (c, rand, p) => {
      c.tone = FACADE.blueGlass;
      const parts: [number, number, number][] = [[-0.06, 0.02, 0.62], [0, -0.01, 1], [0.06, 0.015, 0.8]];
      for (const [dx, dz, frac] of parts) {
        const h = frac * m(363);
        box(c, p.x + dx - 0.03, p.x + dx + 0.03, p.z + dz - 0.035, p.z + dz + 0.035, h, 0.6, 0.05);
        lights(c, rand, p.x + dx - 0.03, p.x + dx + 0.03, p.z + dz - 0.035, p.z + dz + 0.035, h, 0.2);
      }
    },
  },
  {
    name: 'Aon Center', w: -260, s: -160, top: m(346),
    // A plain white-clad square shaft.
    draw: (c, rand, p) => {
      c.tone = FACADE.white;
      box(c, p.x - 0.065, p.x + 0.065, p.z - 0.065, p.z + 0.065, m(346), 0.8, 0.04);
      lights(c, rand, p.x - 0.065, p.x + 0.065, p.z - 0.065, p.z + 0.065, m(346), 0.2);
    },
  },
  {
    name: 'Two Prudential Plaza', w: -140, s: -190, top: m(303),
    // A stepped pyramid crown topped with a spire.
    draw: (c, rand, p) => {
      const h = m(250);
      tower(c, rand, p.x, p.z, 0.045, 0.045, h, 0.55, TONES.greystone);
      for (let k = 0; k < 4; k++) {
        const half = 0.045 - k * 0.011;
        box(c, p.x - half, p.x + half, p.z - half, p.z + half, h + (k + 1) * 0.07, 0.6, 0.03);
      }
      line(c, [p.x, h + 0.28, p.z], [p.x, m(303), p.z], 0.03, COLORS.text, 0.9, 0.9);
    },
  },
  {
    name: 'Franklin Center', w: 227, s: 100, top: m(307),
    // Setbacks and twin rooftop spires.
    draw: (c, rand, p) => {
      tower(c, rand, p.x, p.z, 0.06, 0.06, m(220), 0.55, FACADE.granite);
      box(c, p.x - 0.04, p.x + 0.04, p.z - 0.04, p.z + 0.04, m(270), 0.6, 0.05);
      for (const dx of [-0.025, 0.025]) line(c, [p.x + dx, m(270), p.z], [p.x + dx, m(307), p.z], 0.03, COLORS.text, 0.9, 0.85);
    },
  },
  {
    name: '311 S Wacker', w: 410, s: 311, top: m(293),
    // Tall shaft under a glowing cylindrical crown.
    draw: (c, rand, p) => {
      tower(c, rand, p.x, p.z, 0.05, 0.05, m(255), 0.55, FACADE.granite);
      c.solids.push({ kind: 'cyl', cx: p.x, cz: p.z, r0: 0.04, r1: 0.04, y0: m(255), y1: m(293), seg: 16, color: FACADE.white });
      for (let y = m(255); y <= m(293); y += 0.04) ring(c, p.x, y, p.z, 0.04, 16, COLORS.text, 1.1, 0.95);
    },
  },
  {
    name: 'Chase Tower', w: 40, s: 10, top: m(259),
    draw: (c, rand, p) => tower(c, rand, p.x, p.z, 0.06, 0.035, m(259), 0.55, TONES.greystone),
  },
  {
    name: 'Marina City', w: 10, s: -320, top: m(179),
    // The twin "corncobs": scalloped balconies ringing every floor.
    draw: (c, _rand, p) => {
      for (const dx of [-0.045, 0.045]) {
        c.solids.push({ kind: 'cyl', cx: p.x + dx, cz: p.z, r0: 0.024, r1: 0.024, y0: 0, y1: 0.5, seg: 14, color: TONES.concrete });
        c.solids.push({ kind: 'cyl', cx: p.x + dx, cz: p.z, r0: 0.034, r1: 0.034, y0: 0.5, y1: m(179), seg: 14, color: FACADE.white });
        for (let y = 0.04; y <= m(179); y += 0.045) {
          ring(c, p.x + dx, y, p.z, y < 0.5 ? 0.025 : 0.035, 14, y < 0.5 ? COLORS.dim : COLORS.text, 0.9, y < 0.5 ? 0.4 : 0.7);
        }
      }
    },
  },
  {
    name: 'Wrigley Building', w: -95, s: -410, top: m(134),
    // White terra cotta block with the clock tower.
    draw: (c, _rand, p) => {
      c.tone = FACADE.terraCotta;
      box(c, p.x - 0.06, p.x + 0.06, p.z - 0.03, p.z + 0.03, m(90), 0.95, 0.03);
      box(c, p.x + 0.02, p.x + 0.05, p.z - 0.015, p.z + 0.015, m(125), 0.95, 0.025);
      ring(c, p.x + 0.035, m(110), p.z - 0.016, 0.012, 10, COLORS.amber, 1.3, 1);
      line(c, [p.x + 0.035, m(125), p.z], [p.x + 0.035, m(134), p.z], 0.02, COLORS.text, 1, 1);
    },
  },
  {
    name: 'Tribune Tower', w: -135, s: -445, top: m(141),
    // Gothic shaft with its ring of flying buttresses at the top.
    draw: (c, rand, p) => {
      tower(c, rand, p.x, p.z, 0.035, 0.035, m(115), 0.55, FACADE.limestone);
      for (let k = 0; k < 8; k++) {
        const a = (k / 8) * Math.PI * 2;
        line(c, [p.x + Math.cos(a) * 0.035, m(115), p.z + Math.sin(a) * 0.035], [p.x + Math.cos(a) * 0.02, m(141), p.z + Math.sin(a) * 0.02], 0.02, COLORS.text, 0.9, 0.8);
      }
    },
  },
  {
    name: 'Lake Point Tower', w: -620, s: -505, top: m(197),
    // Three curved wings around a core, alone on the lakefront.
    draw: (c, _rand, p) => {
      for (let k = 0; k < 3; k++) {
        const a = (k / 3) * Math.PI * 2 + 0.3;
        const cx = p.x + Math.cos(a) * 0.03;
        const cz = p.z + Math.sin(a) * 0.03;
        c.solids.push({ kind: 'cyl', cx, cz, r0: 0.028, r1: 0.028, y0: 0, y1: m(197), seg: 14, color: FACADE.bronze });
        for (let y = 0.04; y <= m(197); y += 0.05) ring(c, cx, y, cz, 0.028, 12, COLORS.text, 0.9, 0.35);
      }
    },
  },
  {
    name: 'Merchandise Mart', w: 300, s: -380, top: m(105),
    // Once the largest building in the world: a long, squat block on the river.
    draw: (c, rand, p) => tower(c, rand, p.x, p.z, 0.15, 0.07, m(105), 0.55, TONES.tanBrick),
  },
  {
    name: 'Water Tower Place', w: -40, s: -840, top: m(262),
    draw: (c, rand, p) => tower(c, rand, p.x, p.z, 0.05, 0.05, m(262), 0.5, FACADE.white),
  },
  {
    name: 'Old Water Tower', w: -80, s: -800, top: m(47),
    // The 1869 limestone tower that survived the Great Fire.
    draw: (c, _rand, p) => {
      c.tone = FACADE.limestone;
      box(c, p.x - 0.02, p.x + 0.02, p.z - 0.02, p.z + 0.02, m(25), 0.95, 0.02);
      line(c, [p.x, m(25), p.z], [p.x, m(47), p.z], 0.015, COLORS.amber, 1.2, 0.95);
    },
  },
  {
    name: 'Navy Pier', w: -620, s: -560, top: 0.55,
    // The pier, its headhouse and the Centennial Wheel.
    draw: (c, _rand, p) => {
      const end = D(-1150, -560);
      c.solids.push({ kind: 'box', x0: p.x, x1: end.x, z0: p.z - 0.05, z1: p.z + 0.05, y0: 0, y1: 0.035, color: TONES.concrete });
      c.tone = TONES.greystone;
      for (const dz of [-0.05, 0.05]) line(c, [p.x, 0.04, p.z + dz], [end.x, 0.04, end.z + dz], 0.025, COLORS.text, 1, 0.7);
      for (let x = p.x; x < end.x; x += 0.06) line(c, [x, 0.04, p.z - 0.05], [x, 0.04, p.z + 0.05], 0.025, COLORS.dim, 0.8, 0.35);
      box(c, end.x - 0.15, end.x, p.z - 0.06, p.z + 0.06, 0.18, 0.7, 0.03);
      // Centennial Wheel, turned to face south along the pier.
      const wx = p.x + 0.35;
      const hub = 0.27;
      const r = 0.22;
      for (let k = 0; k < 60; k++) {
        const a = (k / 60) * Math.PI * 2;
        c.add(wx + Math.cos(a) * r, hub + Math.sin(a) * r, p.z, k % 5 === 0 ? COLORS.amber : COLORS.text, k % 5 === 0 ? 1.8 : 1, 0.9);
      }
      for (let k = 0; k < 12; k++) {
        const a = (k / 12) * Math.PI * 2;
        line(c, [wx, hub, p.z], [wx + Math.cos(a) * r, hub + Math.sin(a) * r, p.z], 0.03, COLORS.dim, 0.8, 0.6);
      }
      line(c, [wx - 0.08, 0.04, p.z], [wx, hub, p.z], 0.03, COLORS.text, 0.9, 0.6);
      line(c, [wx + 0.08, 0.04, p.z], [wx, hub, p.z], 0.03, COLORS.text, 0.9, 0.6);
    },
  },
  {
    name: 'Cloud Gate', w: -170, s: 40, top: 0.1,
    // "The Bean": a polished steel bean in Millennium Park.
    draw: (c, rand, p) => {
      for (let k = 0; k < 90; k++) {
        const u = rand() * Math.PI;
        const v = rand() * Math.PI * 2;
        c.add(p.x + Math.sin(u) * Math.cos(v) * 0.04, 0.03 + Math.cos(u) * 0.025 + 0.025, p.z + Math.sin(u) * Math.sin(v) * 0.025, COLORS.text, 1, 0.9);
      }
    },
  },
  {
    name: 'Buckingham Fountain', w: -300, s: 500, top: 0.25,
    // Tiered basins and the central jet.
    draw: (c, _rand, p) => {
      ring(c, p.x, 0.02, p.z, 0.12, 40, COLORS.water, 1.2, 0.8);
      ring(c, p.x, 0.05, p.z, 0.07, 26, COLORS.water, 1.2, 0.85);
      ring(c, p.x, 0.08, p.z, 0.04, 16, COLORS.water, 1.2, 0.9);
      line(c, [p.x, 0.08, p.z], [p.x, 0.25, p.z], 0.015, COLORS.water, 1.4, 1);
      for (let k = 0; k < 4; k++) {
        const a = (k / 4) * Math.PI * 2 + Math.PI / 4;
        c.add(p.x + Math.cos(a) * 0.12, 0.05, p.z + Math.sin(a) * 0.12, COLORS.amber, 1.6, 0.9);
      }
    },
  },
  {
    name: 'Soldier Field', w: -430, s: 1550, top: 0.35,
    // The colonnades with the modern bowl rising above them.
    draw: (c, rand, p) => {
      const tiers: [number, number, number][][] = [];
      for (let tier = 0; tier < 5; tier++) {
        const pts: [number, number, number][] = [];
        for (let k = 0; k <= 56; k++) {
          const a = (k / 56) * Math.PI * 2;
          pts.push([p.x + Math.cos(a) * (0.1 + tier * 0.02), 0.04 + tier * 0.05, p.z + Math.sin(a) * (0.16 + tier * 0.02)]);
        }
        c.outline(() => pts.slice(1).forEach((q) => c.add(...q, COLORS.text, 0.9, 0.5)));
        tiers.push(pts);
      }
      const outer = tiers[tiers.length - 1];
      c.solids.push({ kind: 'loft', rows: tiers, color: TONES.seats });
      c.solids.push({ kind: 'loft', rows: [outer, outer.map(([x, , z]) => [x, 0, z] as [number, number, number])], color: TONES.greystone });
      for (const dx of [-0.16, 0.16]) {
        for (let dz = -0.12; dz <= 0.12; dz += 0.03) line(c, [p.x + dx, 0, p.z + dz], [p.x + dx, 0.12, p.z + dz], 0.03, COLORS.text, 0.9, 0.75);
      }
      for (let k = 0; k < 60; k++) {
        const a = rand() * Math.PI * 2;
        const r = Math.sqrt(rand());
        c.add(p.x + Math.cos(a) * r * 0.07, 0.02, p.z + Math.sin(a) * r * 0.12, COLORS.park, 1, 0.6);
      }
    },
  },
  {
    name: 'Field Museum', w: -380, s: 1400, top: 0.25,
    draw: (c, _rand, p) => {
      c.tone = FACADE.white;
      box(c, p.x - 0.1, p.x + 0.1, p.z - 0.05, p.z + 0.05, 0.2, 0.75, 0.03);
    },
  },
  {
    name: 'Shedd Aquarium', w: -640, s: 1225, top: 0.2,
    draw: (c, _rand, p) => {
      c.tone = FACADE.white;
      box(c, p.x - 0.07, p.x + 0.07, p.z - 0.05, p.z + 0.05, 0.12, 0.7, 0.03);
      ring(c, p.x, 0.16, p.z, 0.025, 10, COLORS.water, 1.1, 0.9);
    },
  },
  {
    name: 'Adler Planetarium', w: -870, s: 1255, top: 0.18,
    draw: (c, _rand, p) => {
      c.solids.push({ kind: 'cyl', cx: p.x, cz: p.z, r0: 0.05, r1: 0.012, y0: 0, y1: 0.12, seg: 14, color: FACADE.white });
      for (let y = 0.02; y < 0.12; y += 0.025) ring(c, p.x, y, p.z, 0.05 * Math.cos(((y - 0.02) / 0.1) * 1.3), 14, COLORS.text, 1, 0.75);
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
}).concat([{ text: 'Lake Michigan', sub: undefined, at: D(-1300, 300), y: 0.15, far: true }]);

/* ─── Districts of ordinary towers ────────────────────────────────────── */

// Rectangles in addresses, with typical height ranges in metres.
const DISTRICTS = [
  { name: 'Loop', w: [-100, 420], s: [-300, 480], h: [80, 240], per: 5 },
  { name: 'Lakeshore East', w: [-500, -150], s: [-330, -170], h: [110, 250], per: 3 },
  { name: 'River North', w: [-100, 480], s: [-950, -370], h: [40, 190], per: 4 },
  { name: 'Streeterville', w: [-560, -100], s: [-1000, -380], h: [70, 240], per: 4 },
  { name: 'Gold Coast', w: [-200, 100], s: [-1500, -1000], h: [50, 170], per: 3 },
  { name: 'South Loop', w: [-110, 420], s: [500, 1700], h: [40, 200], per: 3 },
  { name: 'West Loop', w: [450, 1150], s: [-300, 800], h: [25, 140], per: 3 },
] as const;

export function buildDowntown(c: Cloud, neighborhoodRiverEnd: World) {
  const rand = rng(60606);
  const taken = LANDMARKS.map((l) => ({ w: l.w, s: l.s }));

  for (const l of LANDMARKS) l.draw(c, rand, D(l.w, l.s));

  for (const d of DISTRICTS) {
    for (let w = d.w[0]; w < d.w[1]; w += 100) {
      for (let s = d.s[0]; s < d.s[1]; s += 100) {
        for (let i = 0; i < d.per; i++) {
          const bw = w + 10 + rand() * 80;
          const bs = s + 10 + rand() * 80;
          if (bw < shoreW(bs) + 40) continue; // in the lake
          if (inGrantPark(bw, bs)) continue;
          if (RIVERS.some((r) => distToPolyline(bw, bs, r) < 35)) continue;
          if (taken.some((t) => Math.hypot(t.w - bw, t.s - bs) < 55)) continue;
          taken.push({ w: bw, s: bs });
          const metres = d.h[0] + rand() ** 1.6 * (d.h[1] - d.h[0]);
          const p = D(bw, bs);
          const hw = 0.02 + rand() * 0.035;
          const hd = 0.02 + rand() * 0.035;
          tower(c, rand, p.x, p.z, hw, hd, m(metres), 0.25 + rand() * 0.2);
          // A share of the taller ones get a rooftop beacon.
          if (metres > 180 && rand() < 0.4) c.add(p.x, m(metres) + 0.04, p.z, COLORS.amber, 1.8, 0.9);
        }
      }
    }
  }

  // Street grid: the Loop's main streets, faint, on land only.
  const streetsW = [400, 300, 200, 100, 0, -100];
  const streetsS = [-1200, -800, -400, 0, 400, 800, 1200, 1600];
  for (const w of streetsW) {
    for (let s = -1500; s <= 1900; s += 12) {
      if (w > shoreW(s) + 20 && !RIVERS.some((r) => distToPolyline(w, s, r) < 20)) c.add(...at(w, s, 0), COLORS.dim, 0.8, 0.4);
    }
  }
  for (const s of streetsS) {
    for (let w = -600; w <= 1200; w += 12) {
      if (w > shoreW(s) + 20 && !RIVERS.some((r) => distToPolyline(w, s, r) < 20)) c.add(...at(w, s, 0), COLORS.dim, 0.8, 0.4);
    }
  }

  // The river, and a bascule bridge at every street that crosses it.
  for (const r of RIVERS) {
    for (let i = 0; i < r.length - 1; i++) {
      const [aw, as] = r[i];
      const [bw, bs] = r[i + 1];
      const len = Math.hypot(bw - aw, bs - as);
      for (let t = 0; t <= len; t += 6) {
        const lane = (rand() - 0.5) * 30;
        const w = aw + ((bw - aw) * t) / len + lane * ((bs - as) / len);
        const s = as + ((bs - as) * t) / len - lane * ((bw - aw) / len);
        c.add(...at(w, s, 0.02), COLORS.water, 1.3, 0.6 + rand() * 0.3);
      }
    }
  }
  for (let w = 300; w >= -400; w -= 100) line(c, at(w, -370, 0.05), at(w, -310, 0.05), 0.03, COLORS.amber, 1.1, 0.75);
  for (const s of [-800, -400, 0, 400, 800]) {
    const w = s < -340 ? 380 + ((s + 340) / -460) * 90 : 420;
    line(c, at(w - 30, s, 0.05), at(w + 30, s, 0.05), 0.03, COLORS.amber, 1.1, 0.75);
  }

  // The South Branch continues to meet the neighborhood's stretch of river.
  const branchEnd = D(620, 2000);
  line(c, [branchEnd.x, 0.02, branchEnd.z], [neighborhoodRiverEnd.x, 0.02, neighborhoodRiverEnd.z], 0.08, COLORS.water, 1.2, 0.55);

  // Lake Michigan: a bright shoreline with Lake Shore Drive beside it, and open water.
  for (let s = SHORE[0][1]; s <= SHORE[SHORE.length - 1][1]; s += 8) {
    c.add(...at(shoreW(s), s, 0.02), COLORS.water, 1.3, 0.85);
    c.add(...at(shoreW(s) + 35, s, 0.02), COLORS.text, 0.9, 0.55);
  }
  for (let s = SHORE[0][1]; s <= SHORE[SHORE.length - 1][1]; s += 35) {
    for (let w = shoreW(s) - 30; w > shoreW(s) - 1600; w -= 45) {
      if (rand() < 0.4) c.add(...at(w + (rand() - 0.5) * 30, s + (rand() - 0.5) * 30, 0.01), COLORS.water, 1.1, 0.2 + rand() * 0.35);
    }
  }

  // Grant Park and Millennium Park lawns, with lines of trees.
  for (let i = 0; i < 1400; i++) {
    const w = GRANT_PARK.wEast + rand() * (GRANT_PARK.wWest - GRANT_PARK.wEast);
    const s = GRANT_PARK.sNorth + rand() * (GRANT_PARK.sSouth - GRANT_PARK.sNorth);
    if (!inGrantPark(w, s)) continue;
    c.add(...at(w, s, 0.02), COLORS.park, 1, 0.35 + rand() * 0.2);
    if (rand() < 0.08) c.add(...at(w, s, 0.07), COLORS.park, 1.3, 0.6);
  }
}

/** The South Branch reaches the neighborhood at its east edge. */
export const neighborhoodRiverEnd = (): World => ({ x: X(1200), z: Z(riverS(1200)) });
