"use client";

import { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

interface CyscomCore3DProps {
  isTransitioning: boolean;
  bootStage: number; // 0: invisible, 1: point, 2: core forming, 3: active
}

export function CyscomCore3D({ isTransitioning, bootStage }: CyscomCore3DProps) {
  const group = useRef<THREE.Group>(null);
  const cameraGroup = useRef<THREE.Group>(null);
  
  // Rings
  const ring1 = useRef<THREE.Mesh>(null);
  const ring2 = useRef<THREE.Mesh>(null);
  const ring3 = useRef<THREE.Mesh>(null);
  
  // Core Elements
  const logoMesh = useRef<THREE.Mesh>(null);
  const glassMesh = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const networkRef = useRef<THREE.LineSegments>(null);

  const logoTexture = useTexture('/logo.png');
  
  // Transition State
  const [explosionProgress, setExplosionProgress] = useState(0);

  // Particle positions
  const { particlePositions, networkLines, networkPositions } = useMemo(() => {
    // Background Particles
    const pPos = new Float32Array(500 * 3);
    for(let i=0; i<500; i++) {
      pPos[i*3] = (Math.random() - 0.5) * 40;
      pPos[i*3+1] = (Math.random() - 0.5) * 40;
      pPos[i*3+2] = (Math.random() - 0.5) * 40 - 10;
    }

    // Small topology network around the core
    const nPos = new Float32Array(50 * 3);
    const lineIndices: number[] = [];
    
    for(let i=0; i<50; i++) {
      // Create nodes in an orbital ring around the core
      const angle = Math.random() * Math.PI * 2;
      const radius = 6 + Math.random() * 4;
      nPos[i*3] = Math.cos(angle) * radius;
      nPos[i*3+1] = (Math.random() - 0.5) * 4;
      nPos[i*3+2] = Math.sin(angle) * radius;
    }

    // Connect nearby nodes
    const vecA = new THREE.Vector3();
    const vecB = new THREE.Vector3();
    for (let i = 0; i < 50; i++) {
      vecA.set(nPos[i*3], nPos[i*3+1], nPos[i*3+2]);
      for (let j = i + 1; j < 50; j++) {
        vecB.set(nPos[j*3], nPos[j*3+1], nPos[j*3+2]);
        if (vecA.distanceTo(vecB) < 5.0) {
          lineIndices.push(i, j);
        }
      }
    }

    return { 
      particlePositions: pPos,
      networkPositions: nPos,
      networkLines: new Uint16Array(lineIndices)
    };
  }, []);

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;

    // Visibility based on bootStage
    let targetScale = 0;
    let targetOpacity = 0;
    
    if (bootStage >= 2) {
      targetScale = 1;
      targetOpacity = 1;
    }
    
    // Animate scale up during boot
    if (group.current && !isTransitioning) {
      group.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.05);
    }

    // Subtle Core Rotations (Very slow, 1 rotation per 15-25s)
    if (ring1.current) {
      ring1.current.rotation.x = time * 0.05;
      ring1.current.rotation.y = time * 0.08;
    }
    if (ring2.current) {
      ring2.current.rotation.y = -time * 0.04;
      ring2.current.rotation.z = time * 0.06;
    }
    if (ring3.current) {
      ring3.current.rotation.x = -time * 0.03;
      ring3.current.rotation.z = -time * 0.07;
    }

    // Glass and Logo Float
    if (glassMesh.current && logoMesh.current) {
      const floatY = Math.sin(time * 0.5) * 0.1;
      glassMesh.current.position.y = floatY;
      logoMesh.current.position.y = floatY;
    }

    // Camera
    if (cameraGroup.current && !isTransitioning) {
      // Camera stays centered
      cameraGroup.current.position.x = 0;
      cameraGroup.current.position.y = 0;
      
      cameraGroup.current.lookAt(0, 0, 0);
    }

    // Cinematic Fly-Through Transition
    if (isTransitioning) {
      setExplosionProgress(p => p + delta * 1.5); // Speed of explosion
      
      // Camera zooms massively forward through the core
      state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, -10, 0.08);
      
      // Rings shatter outward
      if (ring1.current && ring2.current && ring3.current) {
         const explosion = Math.pow(explosionProgress, 2) * 5;
         ring1.current.scale.set(1 + explosion, 1 + explosion, 1 + explosion);
         ring2.current.scale.set(1 + explosion * 1.2, 1 + explosion * 1.2, 1 + explosion * 1.2);
         ring3.current.scale.set(1 + explosion * 0.8, 1 + explosion * 0.8, 1 + explosion * 0.8);
         
         (ring1.current.material as THREE.Material).opacity = Math.max(0, 1 - explosionProgress * 2);
         (ring2.current.material as THREE.Material).opacity = Math.max(0, 1 - explosionProgress * 2);
         (ring3.current.material as THREE.Material).opacity = Math.max(0, 1 - explosionProgress * 2);
      }

      // Logo fades and shatters
      if (logoMesh.current && glassMesh.current) {
         const logoExp = explosionProgress * 2;
         logoMesh.current.position.z -= delta * 5;
         (logoMesh.current.material as THREE.Material).opacity = Math.max(0, 1 - logoExp);
         (glassMesh.current.material as THREE.Material).opacity = Math.max(0, 1 - logoExp);
      }

      // Network lines shatter
      if (networkRef.current) {
        networkRef.current.scale.setScalar(1 + explosionProgress * 3);
        (networkRef.current.material as THREE.Material).opacity = Math.max(0, 0.3 - explosionProgress);
      }
    }
  });

  return (
    <>
      <ambientLight intensity={0.2} color="#0A1110" />
      <directionalLight position={[10, 10, 10]} intensity={1.5} color="#00D9FF" />
      <directionalLight position={[-10, -10, -10]} intensity={0.5} color="#67E8F9" />
      
      <group ref={cameraGroup}>
         <group ref={group} scale={0} position={[0, 0, -2]}>
            
            {/* Outer Gunmetal Rings */}
            <mesh ref={ring1}>
              <torusGeometry args={[3, 0.05, 16, 100]} />
              <meshStandardMaterial color="#030507" metalness={0.9} roughness={0.1} envMapIntensity={1} transparent />
            </mesh>
            <mesh ref={ring2}>
              <torusGeometry args={[3.5, 0.03, 16, 100]} />
              <meshStandardMaterial color="#0A1110" metalness={1} roughness={0.2} transparent />
            </mesh>
            <mesh ref={ring3}>
              <torusGeometry args={[4, 0.08, 16, 100]} />
              <meshStandardMaterial color="#070B0F" metalness={0.8} roughness={0.3} transparent />
            </mesh>

            {/* Inner Frosted Glass Pane */}
            <mesh ref={glassMesh}>
              <circleGeometry args={[2.5, 64]} />
              <meshPhysicalMaterial 
                color="#030507" 
                transmission={0.9} 
                opacity={1} 
                metalness={0} 
                roughness={0.2} 
                ior={1.5} 
                thickness={0.5}
                transparent
              />
            </mesh>

            {/* CYSCOM Logo Map */}
            <mesh ref={logoMesh} position={[0, 0, 0.1]}>
              <planeGeometry args={[3, 3]} />
              <meshBasicMaterial 
                map={logoTexture} 
                transparent 
                opacity={0.9} 
                color="#00D9FF"
                blending={THREE.AdditiveBlending}
              />
            </mesh>

            {/* Orbiting Cyber Network */}
            <lineSegments ref={networkRef} position={[0,0,-2]}>
              <bufferGeometry>
                <bufferAttribute attach="attributes-position" count={networkPositions.length / 3} args={[networkPositions, 3]} />
                <bufferAttribute attach="index" count={networkLines.length} args={[networkLines, 1]} />
              </bufferGeometry>
              <lineBasicMaterial color="#00D9FF" transparent opacity={0.3} depthWrite={false} blending={THREE.AdditiveBlending} />
            </lineSegments>

         </group>
      </group>

      {/* Atmospheric Dust */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={particlePositions.length / 3} args={[particlePositions, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.05} color="#00D9FF" transparent opacity={0.2} depthWrite={false} blending={THREE.AdditiveBlending} />
      </points>
    </>
  );
}
