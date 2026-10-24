'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './CenterMap.module.css';
import { Reveal } from '@/components/Reveal/Reveal';
import { CENTER, LABELS, SOX_AT, SOX_FACING, STATION, X, Z, buildCity, buildMovers, orangeS } from './scene';
import { D, DOWNTOWN_LABELS, buildDowntown } from './downtown';
import { buildTransit } from './transit';
import { buildSolidGeometry, type Solid } from './solid';

type ViewName = 'overview' | 'skyline' | 'downtown' | 'orange' | 'ballpark';

const VIEW_NAMES: Record<ViewName, string> = { overview: 'Overview', skyline: 'Skyline', downtown: 'Downtown', orange: 'Orange Line', ballpark: 'Sox Park' };

// The center's label first, then downtown's famous towers, then the rest.
const ALL_LABELS: (typeof LABELS)[number][] = [LABELS[0], ...DOWNTOWN_LABELS, ...LABELS.slice(1)];

const MIN_ZOOM = 0.7;
const MAX_ZOOM = 8;
const BG = 0x0a0906;

/**
 * Interactive 3D model of McKinley Park, home of Chicago's geographic center,
 * with downtown on the horizon. three.js loads only when the section is about
 * to scroll into view.
 */
export default function CenterMap() {
  const stageRef = useRef<HTMLDivElement>(null);
  const labelsRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<ViewName>('overview');
  // Filled in once the scene has loaded; the buttons call through these.
  const goToRef = useRef<(name: ViewName) => void>(() => {});
  const zoomByRef = useRef<(factor: number) => void>(() => {});

  useEffect(() => {
    const stage = stageRef.current;
    const labelLayer = labelsRef.current;
    if (!stage || !labelLayer) return;

    let disposed = false;
    let cleanup = () => {};

    const start = async () => {
      const THREE = await import('three');
      const { OrbitControls } = await import('three/examples/jsm/controls/OrbitControls.js');
      if (disposed) return;

      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const coarse = window.matchMedia('(pointer: coarse)').matches;

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      stage.prepend(renderer.domElement);

      const scene = new THREE.Scene();
      scene.fog = new THREE.Fog(BG, 28, 75);
      const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 200);
      camera.position.set(9, 10.5, 12.5);

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.target.set(0, 0.9, 0.5);
      controls.enableDamping = true;
      controls.enableZoom = false;
      controls.enablePan = true;
      controls.minPolarAngle = 0.35;
      controls.maxPolarAngle = 1.45;
      controls.autoRotate = !reduceMotion;
      controls.autoRotateSpeed = 0.35;
      // On touch screens a drag should scroll the page, not spin the map.
      controls.enabled = !coarse;
      if (coarse) renderer.domElement.style.touchAction = 'pan-y';

      // The city: every shape is recorded first, then built into two meshes.
      const solids: Solid[] = [];
      const { stacks } = buildCity(solids);
      buildDowntown(solids);
      const routes = buildTransit(solids);
      const geo = buildSolidGeometry(THREE, solids);
      const litMat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.82, metalness: 0.08, flatShading: true, side: THREE.DoubleSide });
      // Lit windows, lamps and signs: drawn at full brightness, unaffected by the lights.
      const glowMat = new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.DoubleSide, toneMapped: false });
      const city = new THREE.Group();
      city.add(new THREE.Mesh(geo.lit, litMat), new THREE.Mesh(geo.glow, glowMat));
      scene.add(city);

      const groundGeo = new THREE.PlaneGeometry(400, 400);
      const groundMat = new THREE.MeshStandardMaterial({ color: 0x0c0b09, roughness: 1 });
      const ground = new THREE.Mesh(groundGeo, groundMat);
      ground.rotation.x = -Math.PI / 2;
      ground.position.y = -0.01;
      scene.add(ground);
      scene.add(new THREE.HemisphereLight(0xc4d0de, 0x1a140e, 1.1));
      // Low evening sun from the southwest.
      const sun = new THREE.DirectionalLight(0xffd9a8, 2.4);
      sun.position.set(-10, 9, 8);
      scene.add(sun);

      // Moving things, each an instanced mesh repositioned every frame.
      const movers = buildMovers(stacks);
      const dummy = new THREE.Object3D();
      const carGeo = new THREE.BoxGeometry(0.035, 0.025, 0.06);
      const carMat = new THREE.MeshBasicMaterial({ toneMapped: false });
      const cars = new THREE.InstancedMesh(carGeo, carMat, movers.traffic.length);
      movers.traffic.forEach((_, i) => cars.setColorAt(i, new THREE.Color(i % 2 === 0 ? 0xfff1d6 : 0xff3b24)));
      const trainGeo = new THREE.BoxGeometry(0.05, 0.05, 0.13);
      const trainMat = new THREE.MeshStandardMaterial({ color: 0xc9ccd2, metalness: 0.4, roughness: 0.4, emissive: 0x3a2a10 });
      const TRAINS = [
        { route: routes.orange, t: 0, speed: 0.012, cars: 6, gap: 0.0028 },
        { route: routes.loop, t: 0, speed: 0.05, cars: 6, gap: 0.012 },
        { route: routes.loop, t: 0.5, speed: 0.05, cars: 6, gap: 0.012 },
      ];
      const trains = new THREE.InstancedMesh(trainGeo, trainMat, TRAINS.reduce((n, t) => n + t.cars, 0));
      const puffGeo = new THREE.IcosahedronGeometry(0.06, 0);
      const puffMat = new THREE.MeshBasicMaterial({ color: 0x8a847a, transparent: true, opacity: 0.35, depthWrite: false });
      const puffs = new THREE.InstancedMesh(puffGeo, puffMat, Math.max(1, movers.smoke.length));
      puffs.count = movers.smoke.length;

      // The beacon over the center marker: a light column and rings rippling out.
      const cx = X(CENTER.w);
      const cz = Z(CENTER.s);
      const beaconMat = new THREE.MeshBasicMaterial({ color: 0xffa438, transparent: true, opacity: 0.9, toneMapped: false });
      const beaconGeo = new THREE.CylinderGeometry(0.025, 0.04, 3, 10, 1, true);
      const beacon = new THREE.Mesh(beaconGeo, beaconMat);
      beacon.position.set(cx, 1.5, cz);
      const ringGeo = new THREE.RingGeometry(0.92, 1, 48);
      const ringMats = [0, 1].map(() => new THREE.MeshBasicMaterial({ color: 0xffa438, transparent: true, side: THREE.DoubleSide, depthWrite: false }));
      const rings = ringMats.map((mat) => {
        const r = new THREE.Mesh(ringGeo, mat);
        r.rotation.x = -Math.PI / 2;
        r.position.set(cx, 0.03, cz);
        return r;
      });
      scene.add(cars, trains, puffs, beacon, ...rings);

      const place = (mesh: InstanceType<typeof THREE.InstancedMesh>, i: number, p: readonly number[], next: readonly number[], scale = 1) => {
        dummy.position.set(p[0], p[1], p[2]);
        dummy.lookAt(next[0], next[1], next[2]);
        dummy.scale.setScalar(scale);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      };
      const updateMovers = (time: number, dt: number) => {
        movers.traffic.forEach((m, i) => {
          m.t = (m.t + m.speed * dt) % 1;
          place(cars, i, m.path(m.t), m.path(m.t + 0.001));
        });
        cars.instanceMatrix.needsUpdate = true;
        let k = 0;
        for (const tr of TRAINS) {
          tr.t = (tr.t + tr.speed * dt) % 1;
          for (let c = 0; c < tr.cars; c++, k++) {
            const t = tr.t - c * tr.gap;
            place(trains, k, tr.route(t), tr.route(t + 0.0005));
          }
        }
        trains.instanceMatrix.needsUpdate = true;
        movers.smoke.forEach((m, i) => {
          m.t = (m.t + m.speed * dt) % 1;
          // Puffs swell as they rise and drift.
          place(puffs, i, m.path(m.t), m.path(m.t + 0.01), 0.4 + m.t * 2.2);
        });
        puffs.instanceMatrix.needsUpdate = true;
        beaconMat.opacity = 0.65 + 0.3 * Math.sin(time * 2.4);
        rings.forEach((r, i) => {
          const p = (time * 0.35 + i * 0.5) % 1;
          r.scale.setScalar(0.15 + p * 1.6);
          ringMats[i].opacity = 0.8 * (1 - p);
        });
      };
      updateMovers(0, 0);

      // HTML labels follow their anchor points.
      const labelEls = ALL_LABELS.map((l) => {
        const el = document.createElement('span');
        el.className = [styles.label, l.accent && styles.labelAccent, l.far && styles.labelFar].filter(Boolean).join(' ');
        el.textContent = l.text;
        if (l.sub) {
          const sub = document.createElement('small');
          sub.textContent = l.sub;
          el.appendChild(sub);
        }
        labelLayer.appendChild(el);
        return { el, pos: new THREE.Vector3(l.at.x, l.y, l.at.z) };
      });
      const projected = new THREE.Vector3();
      let width = 1;
      let height = 1;
      // Labels are in priority order: a label that would overlap one already
      // placed this frame is hidden until the view turns and frees its spot.
      const placed: { x: number; y: number; w: number; h: number }[] = [];
      const placeLabels = () => {
        placed.length = 0;
        for (const { el, pos } of labelEls) {
          projected.copy(pos).project(camera);
          // Keep labels inside the stage instead of running off its right edge.
          const w = el.offsetWidth;
          const h = el.offsetHeight;
          const x = Math.min(((projected.x + 1) / 2) * width, width - w - 12);
          const y = ((1 - projected.y) / 2) * height;
          const onScreen = projected.z < 1 && Math.abs(projected.x) < 1.02 && y > 0 && y < height - h;
          const clear = !placed.some((r) => x < r.x + r.w + 6 && r.x < x + w + 6 && y < r.y + r.h + 4 && r.y < y + h + 4);
          const show = onScreen && clear;
          if (show) placed.push({ x, y, w, h });
          el.style.opacity = show ? '' : '0';
          el.style.transform = `translate(${x}px, ${y}px)`;
        }
      };

      // Zoom is a multiplier on the framing zoom, eased toward its target each frame.
      let baseZoom = 1;
      let zoom = 1;
      let zoomTarget = 1;
      const applyZoom = () => {
        camera.zoom = baseZoom * zoom;
        camera.updateProjectionMatrix();
      };
      const zoomBy = (factor: number) => {
        zoomTarget = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoomTarget * factor));
        if (reduceMotion) zoom = zoomTarget;
      };
      zoomByRef.current = zoomBy;
      // Trackpad pinch arrives as a ctrl+wheel event; a plain wheel keeps scrolling the page.
      const onWheel = (e: WheelEvent) => {
        if (!e.ctrlKey && !e.metaKey) return;
        e.preventDefault();
        zoomBy(Math.exp(-e.deltaY * 0.01));
      };
      renderer.domElement.addEventListener('wheel', onWheel, { passive: false });

      // Camera presets. The skyline view stands just southwest of the center and
      // looks low across the neighborhood toward the Loop.
      const loop = D(0, -150);
      const toSkyline = new THREE.Vector2(loop.x - X(CENTER.w), loop.z - Z(CENTER.s)).normalize();
      const views: Record<ViewName, { pos: InstanceType<typeof THREE.Vector3>; target: InstanceType<typeof THREE.Vector3>; zoom: number; rotate: boolean }> = {
        overview: { pos: new THREE.Vector3(9, 10.5, 12.5), target: new THREE.Vector3(0, 0.9, 0.5), zoom: 1, rotate: true },
        skyline: {
          pos: new THREE.Vector3(X(CENTER.w) - toSkyline.x * 5, 4.2, Z(CENTER.s) - toSkyline.y * 5),
          target: new THREE.Vector3(loop.x, 1.7, loop.z),
          zoom: 3.3,
          rotate: false,
        },
        // Over the lake, southeast of the Loop, looking back at the towers.
        downtown: {
          pos: new THREE.Vector3(loop.x + 6, 5.2, loop.z + 6.5),
          target: new THREE.Vector3(loop.x - 0.3, 1.3, loop.z - 0.2),
          zoom: 1.05,
          rotate: false,
        },
        // Low beside the 35th/Archer platform, looking up the line toward downtown.
        orange: {
          pos: new THREE.Vector3(X(STATION.w + 260), 0.9, Z(orangeS(STATION.w + 260)) + 1.1),
          target: new THREE.Vector3(X(STATION.w - 250), 0.2, Z(orangeS(STATION.w - 250))),
          zoom: 1.6,
          rotate: false,
        },
        // From high behind home plate, looking out to center field.
        ballpark: {
          pos: new THREE.Vector3(SOX_AT.x - SOX_FACING.x * 3.6, 2.4, SOX_AT.z - SOX_FACING.z * 3.6),
          target: new THREE.Vector3(SOX_AT.x + SOX_FACING.x * 0.2, 0.45, SOX_AT.z + SOX_FACING.z * 0.2),
          zoom: 1.75,
          rotate: false,
        },
      };
      let flight: { from: { pos: InstanceType<typeof THREE.Vector3>; target: InstanceType<typeof THREE.Vector3> }; to: (typeof views)[ViewName]; start: number } | null = null;
      goToRef.current = (name) => {
        const to = views[name];
        zoomTarget = to.zoom;
        controls.autoRotate = false;
        flight = { from: { pos: camera.position.clone(), target: controls.target.clone() }, to, start: -1 };
      };

      const resize = () => {
        width = stage.clientWidth;
        height = stage.clientHeight;
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        // Pull back on narrow screens so the whole area stays in frame.
        baseZoom = width < 560 ? 0.42 : 0.55;
        applyZoom();
      };
      resize();
      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(stage);

      let visible = false;
      let introStart = -1;
      let last = performance.now();
      let frame = 0;
      const tick = (now: number) => {
        frame = requestAnimationFrame(tick);
        if (!visible) {
          last = now;
          return;
        }
        const dt = Math.min((now - last) / 1000, 0.1);
        last = now;
        const time = now / 1000;
        if (!reduceMotion) {
          // The city rises out of the ground the first time it is seen.
          if (introStart < 0) introStart = time;
          const progress = Math.min((time - introStart) / 2.6, 1);
          city.scale.y = Math.max(0.001, 1 - (1 - progress) ** 3);
          updateMovers(time, dt);
        }
        if (flight) {
          if (flight.start < 0) flight.start = time;
          const k = reduceMotion ? 1 : Math.min((time - flight.start) / 1.8, 1);
          const e = k < 0.5 ? 4 * k * k * k : 1 - (-2 * k + 2) ** 3 / 2;
          camera.position.lerpVectors(flight.from.pos, flight.to.pos, e);
          controls.target.lerpVectors(flight.from.target, flight.to.target, e);
          camera.lookAt(controls.target);
          if (k >= 1) {
            controls.autoRotate = flight.to.rotate && !reduceMotion;
            flight = null;
          }
        } else {
          controls.update();
        }
        if (Math.abs(zoomTarget - zoom) > 0.001) {
          zoom += (zoomTarget - zoom) * Math.min(1, dt * 6);
          applyZoom();
        }
        renderer.render(scene, camera);
        placeLabels();
      };
      frame = requestAnimationFrame(tick);

      const visibility = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
      });
      visibility.observe(stage);

      cleanup = () => {
        cancelAnimationFrame(frame);
        visibility.disconnect();
        resizeObserver.disconnect();
        renderer.domElement.removeEventListener('wheel', onWheel);
        controls.dispose();
        [geo.lit, geo.glow, groundGeo, carGeo, trainGeo, puffGeo, beaconGeo, ringGeo].forEach((g) => g.dispose());
        [litMat, glowMat, groundMat, carMat, trainMat, puffMat, beaconMat, ...ringMats].forEach((m) => m.dispose());
        renderer.dispose();
        renderer.domElement.remove();
        labelEls.forEach(({ el }) => el.remove());
      };
    };

    // Defer loading three.js until the section is near the viewport.
    const loader = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        loader.disconnect();
        start();
      },
      { rootMargin: '400px 0px' },
    );
    loader.observe(stage);

    return () => {
      disposed = true;
      loader.disconnect();
      cleanup();
    };
  }, []);

  return (
    <section className={styles.section} id="center">
      <div className={styles.inner}>
        <Reveal className={styles.copy}>
          <div className={styles.tag}>The center point</div>
          <h2 className={styles.h2}>
            Chicago&rsquo;s center is in <em>McKinley Park.</em>
          </h2>
          <p className={styles.p}>
            The city marks its geographic center at 37th Street and Honore Street, on the
            Southwest Side between the Stevenson and Pershing Road.
            <span className={styles.hint}> Drag to turn the model, right-drag to pan, and pinch or Ctrl + scroll to zoom.</span>
          </p>
          <dl className={styles.facts}>
            <div>
              <dt>Coordinates</dt>
              <dd>41.83° N, 87.67° W</dd>
            </div>
            <div>
              <dt>On the grid</dt>
              <dd>1832 W · 3700 S</dd>
            </div>
          </dl>
          <ul className={styles.legend}>
            <li><span className={styles.swatchAmber} />Center marker, Archer Ave and the Orange Line</li>
            <li><span className={styles.swatchPark} />McKinley Park</li>
            <li><span className={styles.swatchWater} />River, canal and Bubbly Creek</li>
          </ul>
          <p className={styles.note}>
            Stylized model, not a survey map. The marker dates from 1979; measured against today&rsquo;s city
            limits, which grew to take in O&rsquo;Hare, the center falls near 31st Street and Western Avenue.
          </p>
        </Reveal>
        <div
          ref={stageRef}
          className={styles.stage}
          role="img"
          aria-label="3D model of the McKinley Park neighborhood in Chicago with downtown on the horizon, and a beacon at the city's geographic-center marker"
        >
          <div ref={labelsRef} className={styles.labels} aria-hidden="true" />
          <div className={styles.toolbar}>
            <div className={styles.segment} role="group" aria-label="Camera view">
              {(Object.keys(VIEW_NAMES) as ViewName[]).map((name) => (
                <button
                  key={name}
                  type="button"
                  className={styles.btn}
                  aria-pressed={view === name}
                  onClick={() => {
                    setView(name);
                    goToRef.current(name);
                  }}
                >
                  {VIEW_NAMES[name]}
                </button>
              ))}
            </div>
            <div className={styles.segment} role="group" aria-label="Zoom">
              <button type="button" className={styles.btn} aria-label="Zoom in" onClick={() => zoomByRef.current(1.35)}>+</button>
              <button type="button" className={styles.btn} aria-label="Zoom out" onClick={() => zoomByRef.current(1 / 1.35)}>−</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
