import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { ScreenUI } from './ScreenUI';

export function DetailedMacbook({ isEntered, onEnter, ...props }: any) {
  const group = useRef<THREE.Group>(null);
  const hinge = useRef<THREE.Group>(null);

  // Materials
  const aluminium = new THREE.MeshStandardMaterial({
    color: '#b0b5b9',
    metalness: 0.8,
    roughness: 0.2,
  });
  
  const bezelMaterial = new THREE.MeshStandardMaterial({
    color: '#050505',
    metalness: 0.5,
    roughness: 0.3,
  });
  
  const screenGlass = new THREE.MeshStandardMaterial({
    color: '#000000',
    metalness: 0.9,
    roughness: 0.1,
  });

  const keyboardWell = new THREE.MeshStandardMaterial({
    color: '#a0a5a9',
    metalness: 0.7,
    roughness: 0.4,
  });

  const keyMaterial = new THREE.MeshStandardMaterial({
    color: '#151515',
    metalness: 0.2,
    roughness: 0.6,
  });

  const trackpadMaterial = new THREE.MeshStandardMaterial({
    color: '#a0a5a9',
    metalness: 0.8,
    roughness: 0.2,
  });

  useFrame((state, delta) => {
    if (hinge.current) {
      // Open lid to 100 degrees initially, flatten to 90 when entered
      const targetAngle = isEntered ? -Math.PI / 2 : -Math.PI * 0.55;
      hinge.current.rotation.x = THREE.MathUtils.damp(
        hinge.current.rotation.x,
        targetAngle,
        isEntered ? 6 : 4,
        delta
      );
    }

    if (group.current) {
      if (!isEntered) {
        // Floating animation like Pratik's portfolio
        const t = state.clock.getElapsedTime();
        const targetRotX = Math.cos(t / 2) / 20 + 0.15;
        const targetRotY = Math.sin(t / 4) / 15 + state.pointer.x * 0.1;
        const targetRotZ = Math.sin(t / 8) / 20;
        
        group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, targetRotX, 2, delta);
        group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, targetRotY, 2, delta);
        group.current.rotation.z = THREE.MathUtils.damp(group.current.rotation.z, targetRotZ, 2, delta);
        group.current.position.y = THREE.MathUtils.damp(group.current.position.y, (-1.5 + Math.sin(t / 2)) / 3, 2, delta);
      } else {
        // Flatten rotation for perfectly straight zoom
        group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, 0, 4, delta);
        group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, 0, 4, delta);
        group.current.rotation.z = THREE.MathUtils.damp(group.current.rotation.z, 0, 4, delta);
        group.current.position.y = THREE.MathUtils.damp(group.current.position.y, -1.8, 4, delta);
      }
    }
  });

  return (
    <group ref={group} {...props} dispose={null}>
      {/* --- LID (HINGE) --- */}
      <group ref={hinge} position={[0, -0.05, -3]} rotation={[-Math.PI * 0.55, 0, 0]}>
        {/* Lid Back */}
        <RoundedBox args={[9.5, 6.2, 0.1]} radius={0.2} smoothness={4} position={[0, 3.1, -0.05]}>
          <primitive object={aluminium} attach="material" />
        </RoundedBox>
        
        {/* Bezel */}
        <RoundedBox args={[9.3, 6.0, 0.05]} radius={0.15} smoothness={4} position={[0, 3.1, 0.02]}>
          <primitive object={bezelMaterial} attach="material" />
        </RoundedBox>
        
        {/* Screen Area (Glossy) */}
        <mesh position={[0, 3.1, 0.05]}>
          <planeGeometry args={[9.0, 5.7]} />
          <primitive object={screenGlass} attach="material" />
          
          {/* HTML Overlay */}
          <Html className="screen" transform position={[0, 0, 0.01]} scale={0.0098} occlude="blending">
            <div 
              className="wrapper" 
              style={{ width: '914px', height: '580px', overflow: 'hidden', borderRadius: '4px' }}
              onPointerDown={(e) => e.stopPropagation()}
            >
              <ScreenUI onEnter={onEnter} isEntering={isEntered} />
            </div>
          </Html>
        </mesh>
      </group>

      {/* --- BASE --- */}
      <group position={[0, -0.1, 0]}>
        {/* Main Base Chassis */}
        <RoundedBox args={[9.5, 0.2, 6.4]} radius={0.2} smoothness={4} position={[0, 0, -0.2]}>
          <primitive object={aluminium} attach="material" />
        </RoundedBox>
        
        {/* Keyboard Well */}
        <RoundedBox args={[8.8, 0.05, 3.2]} radius={0.1} smoothness={4} position={[0, 0.1, -1.2]}>
          <primitive object={keyboardWell} attach="material" />
        </RoundedBox>
        
        {/* Mock Keyboard (A dark textured plane or grid of boxes) */}
        {/* Since creating 60+ individual keys procedurally adds boilerplate, we can use a stylized flat mesh for the keys block */}
        <RoundedBox args={[8.6, 0.08, 3.0]} radius={0.05} smoothness={2} position={[0, 0.1, -1.2]}>
          <primitive object={keyMaterial} attach="material" />
        </RoundedBox>
        
        {/* Trackpad */}
        <RoundedBox args={[3.5, 0.05, 2.2]} radius={0.1} smoothness={4} position={[0, 0.1, 1.7]}>
          <primitive object={trackpadMaterial} attach="material" />
        </RoundedBox>
      </group>
    </group>
  );
}
