"use client";

import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { baseColors, buildHelix, HELIX_FULL, HELIX_TILT, mulberry32 } from "@/lib/helix";
import type { Anchor } from "./anchors";
import type { Director } from "./director";
import { createHudWriter, type HudState } from "./hud";

const baseKeys = ["A", "T", "G", "C"] as const;
const BEADS_PER_RUNG = HELIX_FULL.beadsPerHalfRung * 2;
// Idle pages re-render at about 16 fps (the helix only drifts); anything moving renders every frame.
const IDLE_MS = 60;

/** Drives on-demand rendering: every frame while the camera moves, a slow tick while it rests. */
function Pulse({ movingRef, active }: { movingRef: { current: boolean }; active: boolean }) {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    let last = 0;
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (now - last < (movingRef.current ? 0 : IDLE_MS)) return;
      last = now;
      invalidate();
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, invalidate, movingRef]);
  return null;
}

function Dna({
  director,
  anchors,
  hud,
  movingRef,
}: {
  director: Director;
  anchors: Anchor[];
  hud: HudState;
  movingRef: { current: boolean };
}) {
  const tilt = useRef<THREE.Group>(null);
  const spin = useRef<THREE.Group>(null);
  const backbone = useRef<THREE.InstancedMesh>(null);
  const rungBeads = useRef<THREE.InstancedMesh>(null);
  const halo = useRef<THREE.InstancedMesh>(null);

  const data = useMemo(() => {
    const { beads, rungs } = buildHelix();
    const m = new THREE.Matrix4();
    const c = new THREE.Color();
    const pack = (list: typeof beads) => {
      const matrices = new Float32Array(list.length * 16);
      const colors = new Float32Array(list.length * 3);
      list.forEach((b, i) => {
        m.makeScale(b.r, b.r, b.r).setPosition(b.x, b.y, b.z).toArray(matrices, i * 16);
        if (b.color > 0) c.set(baseColors[baseKeys[b.color - 1]]).toArray(colors, i * 3);
      });
      return { matrices, colors, count: list.length };
    };
    const rand = mulberry32(99);
    const dust = new Float32Array(900 * 3);
    for (let i = 0; i < 900; i++) {
      dust[i * 3] = (rand() - 0.5) * 12;
      dust[i * 3 + 1] = (rand() - 0.5) * 10;
      dust[i * 3 + 2] = (rand() - 0.5) * 6;
    }
    const rungList = beads.filter((b) => b.color !== 0);
    return {
      backboneData: pack(beads.filter((b) => b.color === 0)),
      rungData: pack(rungList),
      rungList,
      rungs,
      dust,
    };
  }, []);
  const { backboneData, rungData, rungList, rungs, dust } = data;

  // Beads never move relative to the helix, so their instance data is written once.
  useLayoutEffect(() => {
    const b = backbone.current;
    const r = rungBeads.current;
    if (b) {
      b.instanceMatrix.array.set(backboneData.matrices);
      b.instanceMatrix.needsUpdate = true;
    }
    if (r) {
      r.instanceMatrix.array.set(rungData.matrices);
      r.instanceMatrix.needsUpdate = true;
      r.instanceColor = new THREE.InstancedBufferAttribute(rungData.colors, 3);
    }
  }, [backboneData, rungData]);

  const world = useMemo(() => new THREE.Vector3(), []);
  const mat = useMemo(() => new THREE.Matrix4(), []);
  const smooth = useRef(anchors.map((a) => ({ x: a.target.x, y: a.target.y })));
  const writeHud = useMemo(() => createHudWriter(hud), [hud]);
  const screen = useMemo(() => ({ x: new Float32Array(rungs.length), y: new Float32Array(rungs.length) }), [rungs]);

  useFrame((state) => {
    const t = tilt.current;
    const s = spin.current;
    if (!t || !s) return;

    const { width, height } = state.size;
    const cam = director.sample(width, height);
    movingRef.current = cam.moving;
    const persp = state.camera as THREE.PerspectiveCamera;

    // Optical zoom (no flying inside the strands). The view offset is in pixels, so the zoom stays centred on
    // wherever the director puts the helix (right of the text column in a chapter, swaying elsewhere).
    const z = width >= 1024 ? Math.max(5.4, 4.6 / (0.8284 * (width / height))) : 5.4;
    persp.position.z = z;
    persp.zoom = cam.zoom * cam.fit;
    persp.setViewOffset(
      width,
      height,
      -((cam.cx - 50) / 100) * width,
      -((cam.cy - 50) / 100) * height,
      width,
      height,
    );
    const fog = state.scene.fog as THREE.Fog | null;
    if (fog) {
      fog.near = z - 0.6;
      fog.far = z + 2.2;
    }

    t.rotation.z = HELIX_TILT + cam.roll + state.pointer.x * 0.04;
    s.rotation.y = cam.angle + state.clock.elapsedTime * 0.12;
    s.position.y = cam.slide;

    // Project every rung once, then use the results for both the callout lines and the targeted pair.
    s.updateWorldMatrix(true, false);
    rungs.forEach((r, i) => {
      world.set(r.mid[0], r.mid[1], r.mid[2]).applyMatrix4(s.matrixWorld).project(state.camera);
      screen.x[i] = (world.x * 0.5 + 0.5) * 100;
      screen.y[i] = (1 - (world.y * 0.5 + 0.5)) * 100;
    });

    director.publishRungs(screen.x, screen.y, width, height);

    // Callout lines belong to the chapter stage
    if (cam.stage > 0.02) {
      anchors.forEach((a, k) => {
        const aim = width >= 1024 ? a.target : a.phone;
        const r = director.stageRatio(height); // stage percentages are of svh, rung percentages of the canvas
        let best = Infinity;
        let bx = aim.x;
        let by = aim.y * r;
        for (let i = 0; i < rungs.length; i++) {
          const d = (screen.x[i] - aim.x) ** 2 + (screen.y[i] - aim.y * r) ** 2;
          if (d < best) {
            best = d;
            bx = screen.x[i];
            by = screen.y[i];
          }
        }
        const cur = smooth.current[k];
        cur.x += (bx - cur.x) * 0.12;
        cur.y += (by - cur.y) * 0.12;
        a.x.set(cur.x);
        a.y.set(cur.y / r);
      });
    }

    // The "targeted" base pair: whichever rung is nearest the centre of the helix. It glows and feeds the HUD.
    let target = 0;
    let best = Infinity;
    for (let i = 0; i < rungs.length; i++) {
      const d = (screen.x[i] - cam.cx) ** 2 + (screen.y[i] - cam.cy) ** 2;
      if (d < best) {
        best = d;
        target = i;
      }
    }
    const h = halo.current;
    if (h) {
      for (let k = 0; k < BEADS_PER_RUNG; k++) {
        const b = rungList[target * BEADS_PER_RUNG + k];
        h.setMatrixAt(k, mat.makeScale(b.r * 2.8, b.r * 2.8, b.r * 2.8).setPosition(b.x, b.y, b.z));
      }
      h.instanceMatrix.needsUpdate = true;
    }
    writeHud(cam.zoom, rungs[target], state.clock.elapsedTime * 1000);
  });

  return (
    <>
      <fog attach="fog" args={["#050914", 4.8, 7.6]} />
      <ambientLight intensity={0.7} />
      <pointLight position={[3, 3, 5]} intensity={90} color="#7dd3fc" />
      <pointLight position={[-4, -3, 3]} intensity={55} color="#a78bfa" />
      <directionalLight position={[-3, 2, -4]} intensity={2.2} color="#7dd3fc" />

      <group ref={tilt}>
        <group ref={spin}>
          <instancedMesh ref={backbone} args={[undefined, undefined, backboneData.count]}>
            <sphereGeometry args={[1, 24, 16]} />
            <meshStandardMaterial
              color="#2b6fe0"
              emissive="#0b3fa8"
              emissiveIntensity={0.9}
              roughness={0.25}
              metalness={0.15}
            />
          </instancedMesh>
          <instancedMesh ref={rungBeads} args={[undefined, undefined, rungData.count]}>
            <sphereGeometry args={[1, 14, 10]} />
            <meshBasicMaterial toneMapped={false} />
          </instancedMesh>
          <instancedMesh ref={halo} args={[undefined, undefined, BEADS_PER_RUNG]} frustumCulled={false}>
            <sphereGeometry args={[1, 14, 10]} />
            <meshBasicMaterial
              color="#7dd3fc"
              transparent
              opacity={0.3}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
              toneMapped={false}
            />
          </instancedMesh>
        </group>
      </group>

      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[dust, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.03}
          color="#7dd3fc"
          transparent
          opacity={0.55}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </>
  );
}

export default function DnaCanvas({
  director,
  anchors,
  hud,
  active,
}: {
  director: Director;
  anchors: Anchor[];
  hud: HudState;
  active: boolean;
}) {
  const movingRef = useRef(true);
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 5.4], fov: 45 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      frameloop="demand"
      aria-hidden
    >
      <Pulse movingRef={movingRef} active={active} />
      <Dna director={director} anchors={anchors} hud={hud} movingRef={movingRef} />
    </Canvas>
  );
}
