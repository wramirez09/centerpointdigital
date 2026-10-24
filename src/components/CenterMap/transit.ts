/**
 * The CTA Orange Line and the elevated Loop. Through McKinley Park the Orange
 * Line rides an embankment beside Archer Avenue; toward Midway and downtown it
 * is drawn on steel structure, and it joins the 'L' tracks that ring the Loop
 * on Lake, Wabash, Van Buren and Wells.
 */
import { LOOP_L, downtownPath } from './downtown';
import { BOUNDS, GLOW, MIDWAY_AT, TONES, X, Z, along, box, lit, orangeS, ribbon, type RGB } from './scene';
import type { Solid, V } from './solid';

const DECK = 0.2; // height of the track bed
const EARTH: RGB = [0.27, 0.23, 0.18];
const BALLAST: RGB = [0.18, 0.17, 0.16];

/** Orange Line stations in the neighborhood, by west address. */
export const ORANGE_STATIONS = [
  { name: 'Ashland', w: 1600 },
  { name: '35th/Archer', w: 2200 },
];

const embankment = (w: number): V => [X(w), DECK, Z(orangeS(w))];

/** Steel deck on columns along a path. */
function elevated(S: Solid[], pts: V[]) {
  ribbon(S, pts.map(([x, , z]) => [x, z]), 0.1, DECK, TONES.steel, 0.035);
  for (let i = 0; i < pts.length - 1; i++) {
    const [a, b] = [pts[i], pts[i + 1]];
    const len = Math.hypot(b[0] - a[0], b[2] - a[2]);
    for (let d = 0; d < len; d += 0.22) {
      const x = a[0] + ((b[0] - a[0]) * d) / len;
      const z = a[2] + ((b[2] - a[2]) * d) / len;
      S.push({ kind: 'cyl', cx: x, cz: z, r0: 0.01, r1: 0.01, y0: 0, y1: DECK - 0.035, seg: 4, color: TONES.steel });
    }
  }
}

export function buildTransit(S: Solid[]): { orange: (t: number) => V; loop: (t: number) => V } {
  // Through the neighborhood: an earth embankment with the track bed on top.
  const neighborhood: V[] = [];
  for (let w = BOUNDS.wWest; w >= BOUNDS.wEast; w -= 25) neighborhood.push(embankment(w));
  const plan = neighborhood.map(([x, , z]) => [x, z] as [number, number]);
  ribbon(S, plan, 0.2, DECK - 0.03, EARTH, DECK - 0.03);
  ribbon(S, plan, 0.11, DECK, BALLAST, 0.03);

  // Stations: a platform and canopy on each side of the tracks.
  for (const st of ORANGE_STATIONS) {
    const run = [embankment(st.w + 45), embankment(st.w - 45)].map(([x, , z]) => [x, z] as [number, number]);
    ribbon(S, run, 0.24, DECK + 0.01, TONES.concrete, 0.01);
    ribbon(S, run, 0.26, DECK + 0.13, TONES.steel, 0.012);
    const [x, , z] = embankment(st.w);
    box(S, x - 0.06, x + 0.06, z + 0.11, z + 0.17, DECK + 0.12, TONES.concrete, 0);
    lit(S, x, DECK + 0.06, z + 0.174, 'z', 0.09, 0.05, GLOW.warm);
  }

  // Out to Midway, and in to the Loop along Wabash, on steel structure.
  const midway: V[] = [[MIDWAY_AT.x + 0.9, DECK, MIDWAY_AT.z - 1.3], embankment(BOUNDS.wWest)];
  const toLoop: V[] = [embankment(BOUNDS.wEast), ...downtownPath([[LOOP_L.east, 1200], [LOOP_L.east, LOOP_L.south]], DECK)];
  elevated(S, midway);
  elevated(S, toLoop);
  box(S, midway[0][0] - 0.12, midway[0][0] + 0.12, midway[0][2] - 0.08, midway[0][2] + 0.08, DECK + 0.1, TONES.concrete);

  // The elevated Loop.
  const { north, east, south, west } = LOOP_L;
  const ring = downtownPath([[west, north], [east, north], [east, south], [west, south], [west, north]], DECK);
  elevated(S, ring);

  // Trains run to the Loop and back; Loop trains go round.
  const orangeRoute = [midway[0], ...neighborhood, ...toLoop.slice(1)];
  return {
    orange: along([...orangeRoute, ...orangeRoute.slice(0, -1).reverse()]),
    loop: along(ring),
  };
}
