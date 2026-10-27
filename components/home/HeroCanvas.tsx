"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/** Small seeded PRNG so the point cloud is identical on every render. */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function Orb() {
  const group = useRef<THREE.Group>(null);
  const ring = useRef<THREE.Mesh>(null);

  const { positions, colors } = useMemo(() => {
    const rand = mulberry32(7);
    const count = 2600;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const violet = new THREE.Color("#8b5cf6");
    const cyan = new THREE.Color("#22d3ee");
    const tmp = new THREE.Color();

    for (let i = 0; i < count; i++) {
      const u = rand() * 2 - 1; // cos(phi)
      const theta = rand() * Math.PI * 2;
      const radius = 1.75 + (rand() - 0.5) * 0.55;
      const s = Math.sqrt(1 - u * u);
      positions[i * 3] = radius * s * Math.cos(theta);
      positions[i * 3 + 1] = radius * u;
      positions[i * 3 + 2] = radius * s * Math.sin(theta);
      tmp.copy(violet).lerp(cyan, (u + 1) / 2);
      colors[i * 3] = tmp.r;
      colors[i * 3 + 1] = tmp.g;
      colors[i * 3 + 2] = tmp.b;
    }
    return { positions, colors };
  }, []);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    g.rotation.y += delta * 0.14;
    // Ease toward the pointer for a subtle parallax feel.
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, -state.pointer.y * 0.35, 0.04);
    g.position.x = THREE.MathUtils.lerp(g.position.x, state.pointer.x * 0.3, 0.04);
    if (ring.current) ring.current.rotation.z += delta * 0.25;
  });

  return (
    <group ref={group}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.022}
          vertexColors
          transparent
          opacity={0.95}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      <mesh>
        <icosahedronGeometry args={[1.15, 1]} />
        <meshBasicMaterial color="#8b5cf6" wireframe transparent opacity={0.28} />
      </mesh>

      <mesh ref={ring} rotation={[Math.PI / 2.3, 0.2, 0]}>
        <torusGeometry args={[2.35, 0.006, 8, 200]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.55} />
      </mesh>
    </group>
  );
}

export default function HeroCanvas({ active }: { active: boolean }) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 5.4], fov: 45 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      frameloop={active ? "always" : "never"}
      aria-hidden
    >
      <Orb />
    </Canvas>
  );
}
