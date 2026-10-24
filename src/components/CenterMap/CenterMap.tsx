'use client';

import { useEffect, useRef } from 'react';
import styles from './CenterMap.module.css';
import { Reveal } from '@/components/Reveal/Reveal';
import { CENTER, COLORS, LABELS, X, Z, buildCity, buildMovers, type Mover } from './scene';

const VERTEX = /* glsl */ `
  attribute vec3 aStart;
  attribute vec3 aColor;
  attribute float aSize;
  attribute float aSeed;
  uniform float uTime;
  uniform float uProgress;
  uniform float uPixelRatio;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float p = clamp(uProgress * 1.6 - aSeed * 0.6, 0.0, 1.0);
    p = 1.0 - pow(1.0 - p, 3.0);
    vec3 pos = mix(aStart, position, p);
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aSize * uPixelRatio * (22.0 / -mv.z);
    vColor = aColor;
    vAlpha = (0.8 + 0.2 * sin(uTime * 1.3 + aSeed * 60.0)) * p;
  }
`;

const FRAGMENT = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.05, d);
    gl_FragColor = vec4(vColor, a * vAlpha);
  }
`;

/**
 * Interactive particle model of McKinley Park, home of Chicago's geographic center.
 * three.js loads only when the section is about to scroll into view.
 */
export default function CenterMap() {
  const stageRef = useRef<HTMLDivElement>(null);
  const labelsRef = useRef<HTMLDivElement>(null);

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
      const pixelRatio = Math.min(window.devicePixelRatio, 2);

      const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
      renderer.setPixelRatio(pixelRatio);
      stage.prepend(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 200);
      camera.position.set(9, 10.5, 12.5);

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.target.set(0, 0.4, 0.5);
      controls.enableDamping = true;
      controls.enableZoom = false;
      controls.enablePan = false;
      controls.minPolarAngle = 0.35;
      controls.maxPolarAngle = 1.25;
      controls.autoRotate = !reduceMotion;
      controls.autoRotateSpeed = 0.35;
      // On touch screens a drag should scroll the page, not spin the map.
      controls.enabled = !coarse;
      if (coarse) renderer.domElement.style.touchAction = 'pan-y';

      const material = new THREE.ShaderMaterial({
        vertexShader: VERTEX,
        fragmentShader: FRAGMENT,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uProgress: { value: reduceMotion ? 1 : 0 },
          uPixelRatio: { value: pixelRatio },
        },
      });

      // Static city: each particle flies in from a scattered start position.
      const city = buildCity();
      const cityGeo = new THREE.BufferGeometry();
      const starts = new Float32Array(city.count * 3);
      for (let i = 0; i < city.count; i++) {
        const a = Math.random() * Math.PI * 2;
        const r = 8 + Math.random() * 14;
        starts[i * 3] = Math.cos(a) * r;
        starts[i * 3 + 1] = 4 + Math.random() * 10;
        starts[i * 3 + 2] = Math.sin(a) * r;
      }
      cityGeo.setAttribute('position', new THREE.Float32BufferAttribute(city.positions, 3));
      cityGeo.setAttribute('aStart', new THREE.BufferAttribute(starts, 3));
      cityGeo.setAttribute('aColor', new THREE.Float32BufferAttribute(city.colors, 3));
      cityGeo.setAttribute('aSize', new THREE.Float32BufferAttribute(city.sizes, 1));
      cityGeo.setAttribute('aSeed', new THREE.Float32BufferAttribute(city.seeds, 1));
      scene.add(new THREE.Points(cityGeo, material));

      // Moving particles: water, traffic, train and the beacon. Positions are
      // rewritten every frame, so the start position simply tracks the current one.
      const movers = buildMovers();
      const groups: { list: Mover[]; color: readonly number[]; size: number }[] = [
        { list: movers.water, color: COLORS.water, size: 1.6 },
        { list: movers.traffic, color: COLORS.text, size: 2 },
        { list: movers.train, color: COLORS.amber, size: 2.4 },
      ];
      const BEACON_COLUMN = 90;
      const BEACON_RING = 140;
      const moverCount = groups.reduce((n, g) => n + g.list.length, 0);
      const dynamicCount = moverCount + BEACON_COLUMN + BEACON_RING;
      const dynPos = new Float32Array(dynamicCount * 3);
      const dynColor = new Float32Array(dynamicCount * 3);
      const dynSize = new Float32Array(dynamicCount);
      const dynSeed = new Float32Array(dynamicCount);
      let k = 0;
      for (const g of groups) {
        for (let i = 0; i < g.list.length; i++, k++) {
          dynColor.set(g.color, k * 3);
          dynSize[k] = g.size;
          dynSeed[k] = Math.random() * 0.4;
        }
      }
      for (; k < dynamicCount; k++) {
        dynColor.set(COLORS.amber, k * 3);
        dynSize[k] = k < moverCount + BEACON_COLUMN ? 2.6 : 2;
        dynSeed[k] = Math.random() * 0.4;
      }
      const dynGeo = new THREE.BufferGeometry();
      const dynAttr = new THREE.BufferAttribute(dynPos, 3);
      dynGeo.setAttribute('position', dynAttr);
      dynGeo.setAttribute('aStart', dynAttr);
      dynGeo.setAttribute('aColor', new THREE.BufferAttribute(dynColor, 3));
      dynGeo.setAttribute('aSize', new THREE.BufferAttribute(dynSize, 1));
      dynGeo.setAttribute('aSeed', new THREE.BufferAttribute(dynSeed, 1));
      scene.add(new THREE.Points(dynGeo, material));

      const cx = X(CENTER.w);
      const cz = Z(CENTER.s);
      const updateMovers = (time: number, dt: number) => {
        let i = 0;
        for (const g of groups) {
          for (const m of g.list) {
            m.t = (m.t + m.speed * dt) % 1;
            const [x, y, z] = m.path(m.t);
            dynPos[i * 3] = x;
            dynPos[i * 3 + 1] = y;
            dynPos[i * 3 + 2] = z;
            i++;
          }
        }
        for (let b = 0; b < BEACON_COLUMN; b++, i++) {
          const h = ((b / BEACON_COLUMN + time * 0.15) % 1) * 3;
          dynPos[i * 3] = cx;
          dynPos[i * 3 + 1] = h;
          dynPos[i * 3 + 2] = cz;
        }
        const pulse = (time * 0.35) % 1;
        for (let b = 0; b < BEACON_RING; b++, i++) {
          const ring = b % 2 === 0 ? pulse : (pulse + 0.5) % 1;
          const a = (b / BEACON_RING) * Math.PI * 4;
          const r = 0.15 + ring * 1.6;
          dynPos[i * 3] = cx + Math.cos(a) * r;
          dynPos[i * 3 + 1] = 0.05;
          dynPos[i * 3 + 2] = cz + Math.sin(a) * r;
        }
        dynAttr.needsUpdate = true;
      };
      updateMovers(0, 0);

      // HTML labels follow their anchor points.
      const labelEls = LABELS.map((l) => {
        const el = document.createElement('span');
        el.className = l.accent ? `${styles.label} ${styles.labelAccent}` : styles.label;
        el.textContent = l.text;
        labelLayer.appendChild(el);
        return { el, pos: new THREE.Vector3(X(l.at.w), l.y, Z(l.at.s)) };
      });
      const projected = new THREE.Vector3();
      let width = 1;
      let height = 1;
      const placeLabels = () => {
        for (const { el, pos } of labelEls) {
          projected.copy(pos).project(camera);
          const visible = projected.z < 1 && Math.abs(projected.x) < 1.05 && Math.abs(projected.y) < 1.05;
          el.style.opacity = visible ? '' : '0';
          // Keep labels inside the stage instead of running off its right edge.
          const x = Math.min(((projected.x + 1) / 2) * width, width - el.offsetWidth - 12);
          el.style.transform = `translate(${x}px, ${((1 - projected.y) / 2) * height}px)`;
        }
      };

      const resize = () => {
        width = stage.clientWidth;
        height = stage.clientHeight;
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        // Pull back on narrow screens so the whole area stays in frame.
        camera.zoom = width < 560 ? 0.75 : 1;
        camera.updateProjectionMatrix();
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
          if (introStart < 0) introStart = time;
          material.uniforms.uProgress.value = Math.min((time - introStart) / 3.2, 1);
          material.uniforms.uTime.value = time;
          updateMovers(time, dt);
        }
        controls.update();
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
        controls.dispose();
        cityGeo.dispose();
        dynGeo.dispose();
        material.dispose();
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
            The geographic middle of the city sits on the Southwest Side, between the
            Stevenson and Pershing Road.
            <span className={styles.hint}> Drag the model to look around.</span>
          </p>
          <dl className={styles.facts}>
            <div>
              <dt>Coordinates</dt>
              <dd>41.83° N, 87.67° W</dd>
            </div>
            <div>
              <dt>On the grid</dt>
              <dd>≈ 2200 W · 3650 S</dd>
            </div>
          </dl>
          <ul className={styles.legend}>
            <li><span className={styles.swatchAmber} />Center, Archer Ave and Orange Line</li>
            <li><span className={styles.swatchPark} />McKinley Park</li>
            <li><span className={styles.swatchWater} />River and Bubbly Creek</li>
          </ul>
          <p className={styles.note}>Stylized model, not a survey map. Locations are approximate.</p>
        </Reveal>
        <div
          ref={stageRef}
          className={styles.stage}
          role="img"
          aria-label="3D particle model of the McKinley Park neighborhood in Chicago, with a beacon marking the city's geographic center"
        >
          <div ref={labelsRef} className={styles.labels} aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
