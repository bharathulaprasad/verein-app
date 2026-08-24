'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useMemo, useState, useEffect } from 'react';
import * as THREE from 'three';

const CONFETTI_COLORS = ['#f94144', '#f3722c', '#f8961e', '#f9c74f', '#90be6d', '#43aa8b', '#577590'];

type Particle = {
  position: THREE.Vector3;
  rotation: THREE.Euler;
  scale: number;
  color: THREE.Color;
  velocity: THREE.Vector3;
  rotationSpeed: THREE.Vector3;
};

function createParticles(
  count: number,
  creator: () => Omit<Particle, 'color'> & { color: string | THREE.Color }
): Particle[] {
  return Array.from({ length: count }, () => {
    const { color, ...rest } = creator();
    return {
      ...rest,
      color: color instanceof THREE.Color ? color : new THREE.Color(color),
    };
  });
}

function Particles({ count, particleCreator }: { count: number; particleCreator: () => any }) {
  const ref = useRef<THREE.InstancedMesh>(null!);
  const [particles] = useState<Particle[]>(() => createParticles(count, particleCreator));

  // Set initial colors
  useEffect(() => {
    if (ref.current) {
      particles.forEach((p, i) => ref.current!.setColorAt(i, p.color));
      if (ref.current.instanceColor) {
        ref.current.instanceColor.needsUpdate = true;
      }
    }
  }, [particles]);

  useFrame((state, delta) => {
    if (ref.current) {
      const dummy = new THREE.Object3D();
      for (let i = 0; i < count; i++) {
        const p = particles[i];
        p.position.y -= p.velocity.y * delta;
        p.position.x += p.velocity.x * delta;

        p.rotation.x += p.rotationSpeed.x * delta;
        p.rotation.y += p.rotationSpeed.y * delta;
        p.rotation.z += p.rotationSpeed.z * delta;

        if (p.position.y < -state.viewport.height / 2 - 2) {
          p.position.y = state.viewport.height / 2 + 2;
          p.position.x = (Math.random() - 0.5) * 20;
        }

        dummy.position.copy(p.position);
        dummy.rotation.copy(p.rotation);
        dummy.scale.set(p.scale, p.scale, p.scale);
        dummy.updateMatrix();
        ref.current!.setMatrixAt(i, dummy.matrix);
      }
      ref.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <planeGeometry args={[0.1, 0.1]} />
      <meshStandardMaterial side={THREE.DoubleSide} emissiveIntensity={0.6} toneMapped={false} />
    </instancedMesh>
  );
}

const createConfettiParticle = () => ({
  position: new THREE.Vector3((Math.random() - 0.5) * 20, (Math.random() - 0.5) * 30, (Math.random() - 0.5) * 5),
  rotation: new THREE.Euler(0, 0, 0),
  scale: Math.random() * 0.4 + 0.2,
  color: '#87CEEB', // A nice sky blue color
  velocity: new THREE.Vector3((Math.random() - 0.5) * 0.1, Math.random() * 2 + 2, 0), // Faster downward, less side drift
  rotationSpeed: new THREE.Vector3(0, 0, 0), // No rotation for a droplet effect
});

const createSnowParticle = () => ({
  position: new THREE.Vector3((Math.random() - 0.8) * 25, (Math.random() - 0.5) * 20, (Math.random() - 0.5) * 5),
  rotation: new THREE.Euler(0, 0, 0),
  scale: Math.random() * 0.3 + 0.1,
  color: '#ffffff',
  velocity: new THREE.Vector3((Math.random() - 0.8) * 0.1, Math.random() * 0.5 + 0.2, 0),
  rotationSpeed: new THREE.Vector3(0, 0, (Math.random() - 0.8) * 0.5),
});

const createRainParticle = () => ({
  position: new THREE.Vector3((Math.random() - 0.5) * 30, (Math.random() - 0.5) * 30, (Math.random() - 0.5) * 2),
  rotation: new THREE.Euler(0, 0, 0),
  scale: Math.random() * 0.8 + 0.5, // Will be scaled in geometry
  color: '#a0c4ff',
  velocity: new THREE.Vector3(0, Math.random() * 8 + 12, 0),
  rotationSpeed: new THREE.Vector3(0, 0, 0),
});

function Rain() {
  // Rain uses a different geometry and material, so it's a separate component
  const ref = useRef<THREE.InstancedMesh>(null!);
  const [particles] = useState<Particle[]>(() => createParticles(1500, createRainParticle));

  useFrame((state, delta) => {
    if (ref.current) {
      const dummy = new THREE.Object3D();
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.position.y -= p.velocity.y * delta;

        if (p.position.y < -state.viewport.height / 2 - 5) {
          p.position.y = state.viewport.height / 2 + 5;
          p.position.x = (Math.random() - 0.5) * 30;
        }

        dummy.position.copy(p.position);
        dummy.scale.set(1, p.scale, 1); // Stretch vertically
        dummy.updateMatrix();
        ref.current!.setMatrixAt(i, dummy.matrix);
      }
      ref.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, particles.length]}>
      <planeGeometry args={[0.02, 0.2]} />
      <meshBasicMaterial color="#a0c4ff" transparent opacity={0.4} side={THREE.DoubleSide} />
    </instancedMesh>
  );
}

function Sun() {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.getElapsedTime();
      const radius = state.viewport.width / 2.5 + 1; // Sun's orbit radius
      ref.current.position.x = radius * Math.cos(t * 0.5);
      ref.current.position.y = radius * Math.sin(t * 0.5);
      ref.current.rotation.z += 0.5;
    }
  });

  return (
    <mesh ref={ref}>
      <circleGeometry args={[1, 32]} />
      <meshStandardMaterial color="#f9c74f" emissive="#f9c74f" emissiveIntensity={1} toneMapped={true} />
    </mesh>
  );
}

export type EffectType = 'confetti' | 'snow' | 'rain' | 'sun';

interface SpecialEffectsProps {
  type: EffectType;
}

export default function SpecialEffects({ type }: SpecialEffectsProps) {
  const renderEffect = () => {
    switch (type) {
      case 'confetti':
        return <Particles count={3000} particleCreator={createConfettiParticle} />;
      case 'snow':
        return <Particles count={3000} particleCreator={createSnowParticle} />;
      case 'rain':
        return <Rain />;
      case 'sun':
        return <Sun />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
        <ambientLight intensity={0.5} />
        {renderEffect()}
      </Canvas>
    </div>
  );
}