"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { MotionValue } from "motion/react";
import {
  baseColors,
  buildHelix,
  cameraAt,
  type CameraKey,
  HELIX_FULL,
  HELIX_TILT,
  helixAngle,
  mulberry32,
} from "@/lib/helix";
import type { Anchor } from "./anchors";
import { createHudWriter, reticleCenter, type HudState } from "./hud";

const baseKeys = ["A", "T", "G", "C"] as const;
const BEADS_PER_RUNG = HELIX_FULL.beadsPerHalfRung * 2;
const WIDE_SHIFT = 0.167; // fraction of the width the scene is pushed right, clear of the text column

function Dna({
  progress,
  anchors,
  keys,
  hud,
}: {
  progress: MotionValue<number>;
  anchors: Anchor[];
  keys: readonly CameraKey[];
  hud: HudState;
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
    const p = progress.get();
    const cam = cameraAt(p, keys);

    // Optical zoom (no flying inside the strands), with the scene pushed right of the text column.
    // The view offset is in pixels, so the zoom always centres on the reticle at any magnification.
    const shift = width >= 1024 ? width * WIDE_SHIFT : 0;
    state.camera.position.z = Math.max(5.4, 4.6 / (0.8284 * (width / height)));
    (state.camera as THREE.PerspectiveCamera).zoom = cam.zoom;
    (state.camera as THREE.PerspectiveCamera).setViewOffset(width, height, -shift, 0, width, height);

    t.rotation.z = HELIX_TILT + cam.roll + state.pointer.x * 0.04;
    s.rotation.y = helixAngle(p, state.clock.elapsedTime);
    s.position.y = cam.focus + (p - 0.5) * 0.8;

    // Project every rung once, then use the results for both the callout lines and the targeted pair.
    s.updateWorldMatrix(true, false);
    rungs.forEach((r, i) => {
      world.set(r.mid[0], r.mid[1], r.mid[2]).applyMatrix4(s.matrixWorld).project(state.camera);
      screen.x[i] = (world.x * 0.5 + 0.5) * 100;
      screen.y[i] = (1 - (world.y * 0.5 + 0.5)) * 100;
    });

    anchors.forEach((a, k) => {
      let best = Infinity;
      let bx = a.target.x;
      let by = a.target.y;
      for (let i = 0; i < rungs.length; i++) {
        const d = (screen.x[i] - a.target.x) ** 2 + (screen.y[i] - a.target.y) ** 2;
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
      a.y.set(cur.y);
    });

    // The "targeted" base pair: whichever rung is nearest the reticle. It glows and feeds the HUD readouts.
    const c = reticleCenter(width);
    let target = 0;
    let best = Infinity;
    for (let i = 0; i < rungs.length; i++) {
      const d = (screen.x[i] - c.x) ** 2 + (screen.y[i] - c.y) ** 2;
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

export default function StageCanvas({
  progress,
  anchors,
  keys,
  hud,
  active,
}: {
  progress: MotionValue<number>;
  anchors: Anchor[];
  keys: readonly CameraKey[];
  hud: HudState;
  active: boolean;
}) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 5.4], fov: 45 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      frameloop={active ? "always" : "never"}
      aria-hidden
    >
      <Dna progress={progress} anchors={anchors} keys={keys} hud={hud} />
    </Canvas>
  );
}
