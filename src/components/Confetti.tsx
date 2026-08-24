'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useMemo, useState, useEffect } from 'react';
import * as THREE from 'three';

const COUNT = 2000; // Increased for a denser effect
const COLORS = ['#f94144', '#f3722c', '#f8961e', '#f9c74f', '#90be6d', '#43aa8b', '#577590'];

function ConfettiInstance() {
  const ref = useRef<THREE.InstancedMesh>(null!);
  const [particles] = useState(() => 
    Array.from({ length: COUNT }, () => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 20, // x
        (Math.random() - 0.5) * 30, // y
        (Math.random() - 0.5) * 10  // z
      ),
      rotation: new THREE.Euler(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI),
      scale: Math.random() * 0.5 + 0.2,
      color: new THREE.Color(COLORS[Math.floor(Math.random() * COLORS.length)]),
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.2, // x-drift
        Math.random() * 1.5 + 1,     // y-speed
        0
      ),
      rotationSpeed: new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2
      ),
    }))
  );

  // Set initial colors
  useEffect(() => {
    if (ref.current) {
      particles.forEach((p, i) => ref.current!.setColorAt(i, p.color));
      ref.current.instanceColor!.needsUpdate = true;
    }
  }, [particles]);

  useFrame((state, delta) => {
    if (ref.current) {
      const dummy = new THREE.Object3D();
      particles.forEach((p, i) => {
        p.position.y -= p.velocity.y * delta;
        p.position.x += p.velocity.x * delta;

        p.rotation.x += p.rotationSpeed.x * delta;
        p.rotation.y += p.rotationSpeed.y * delta;
        p.rotation.z += p.rotationSpeed.z * delta;

        // Reset position when it falls off-screen
        if (p.position.y < -state.viewport.height / 2 - 2) {
          p.position.y = state.viewport.height / 2 + 2;
          p.position.x = (Math.random() - 0.5) * 20;
        }

        dummy.position.copy(p.position);
        dummy.rotation.copy(p.rotation);
        dummy.scale.set(p.scale, p.scale, p.scale);
        dummy.updateMatrix();
        ref.current!.setMatrixAt(i, dummy.matrix);
      });
      ref.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, COUNT]}>
      <planeGeometry args={[0.1, 0.1]} />
      <meshStandardMaterial side={THREE.DoubleSide} emissiveIntensity={0.6} toneMapped={false} />
    </instancedMesh>
  );
}

export default function Confetti() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <ConfettiInstance />
      </Canvas>
    </div>
  );
}