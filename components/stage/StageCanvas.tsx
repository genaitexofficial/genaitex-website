"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { MotionValue } from "motion/react";
import { baseColors, buildHelix, HELIX_TILT, helixPose, mulberry32 } from "@/lib/helix";
import type { Anchor } from "./anchors";

const WIDE_OFFSET = 1.3; // pushes the helix right on large screens, clear of the text column
const baseKeys = ["A", "T", "G", "C"] as const;

function Dna({ progress, anchors }: { progress: MotionValue<number>; anchors: Anchor[] }) {
  const tilt = useRef<THREE.Group>(null);
  const spin = useRef<THREE.Group>(null);
  const backbone = useRef<THREE.InstancedMesh>(null);
  const rungBeads = useRef<THREE.InstancedMesh>(null);

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
    return {
      backboneData: pack(beads.filter((b) => b.color === 0)),
      rungData: pack(beads.filter((b) => b.color !== 0)),
      rungs,
      dust,
    };
  }, []);
  const { backboneData, rungData, rungs, dust } = data;

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
  const smooth = useRef(anchors.map((a) => ({ x: a.target.x, y: a.target.y })));

  useFrame((state) => {
    const t = tilt.current;
    const s = spin.current;
    if (!t || !s) return;

    const { width, height } = state.size;
    const offset = width >= 1024 ? WIDE_OFFSET : 0;
    // Pull the camera back on narrow or tall screens so the helix always has room.
    state.camera.position.z = Math.max(5.4, (4.6 + 2 * offset) / (0.8284 * (width / height)));

    const pose = helixPose(progress.get(), state.clock.elapsedTime);
    t.position.x = offset;
    t.rotation.z = HELIX_TILT + state.pointer.x * 0.04;
    s.rotation.y = pose.angle;
    s.position.y = pose.slide;

    // Attach each callout line to the rung nearest its target zone, easing between rungs as the helix turns.
    s.updateWorldMatrix(true, false);
    anchors.forEach((a, k) => {
      let best = Infinity;
      let bx = a.target.x;
      let by = a.target.y;
      for (const r of rungs) {
        world.set(r.mid[0], r.mid[1], r.mid[2]).applyMatrix4(s.matrixWorld).project(state.camera);
        const px = (world.x * 0.5 + 0.5) * 100;
        const py = (1 - (world.y * 0.5 + 0.5)) * 100;
        const d = (px - a.target.x) ** 2 + (py - a.target.y) ** 2;
        if (d < best) {
          best = d;
          bx = px;
          by = py;
        }
      }
      const cur = smooth.current[k];
      cur.x += (bx - cur.x) * 0.12;
      cur.y += (by - cur.y) * 0.12;
      a.x.set(cur.x);
      a.y.set(cur.y);
    });
  });

  return (
    <>
      <ambientLight intensity={0.7} />
      <pointLight position={[3, 3, 5]} intensity={90} color="#7dd3fc" />
      <pointLight position={[-4, -3, 3]} intensity={55} color="#a78bfa" />

      <group ref={tilt}>
        <group ref={spin}>
          <instancedMesh ref={backbone} args={[undefined, undefined, backboneData.count]}>
            <sphereGeometry args={[1, 14, 10]} />
            <meshStandardMaterial
              color="#2b6fe0"
              emissive="#0b3fa8"
              emissiveIntensity={0.9}
              roughness={0.25}
              metalness={0.15}
            />
          </instancedMesh>
          <instancedMesh ref={rungBeads} args={[undefined, undefined, rungData.count]}>
            <sphereGeometry args={[1, 6, 4]} />
            <meshBasicMaterial toneMapped={false} />
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
  active,
}: {
  progress: MotionValue<number>;
  anchors: Anchor[];
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
      <Dna progress={progress} anchors={anchors} />
    </Canvas>
  );
}
