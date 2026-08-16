"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox, Html, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { ScreenUI } from "./ScreenUI";

interface ProceduralLaptopProps {
  onEnter: () => void;
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
  isEntered: boolean;
}

export function ProceduralLaptop({ onEnter, isOpen, setIsOpen, isEntered }: ProceduralLaptopProps) {
  const group = useRef<THREE.Group>(null);
  const hinge = useRef<THREE.Group>(null);
  
  const [isEntering, setIsEntering] = useState(false);

  // Materials
  const materials = useMemo(() => {
    return {
      aluminum: new THREE.MeshStandardMaterial({
        color: "#9ca3af", // Graphite / Silver
        roughness: 0.3,
        metalness: 0.8,
      }),
      darkAluminum: new THREE.MeshStandardMaterial({
        color: "#4b5563",
        roughness: 0.4,
        metalness: 0.6,
      }),
      screenBezel: new THREE.MeshStandardMaterial({
        color: "#000000",
        roughness: 0.2,
        metalness: 0.1,
      }),
      screenGlass: new THREE.MeshPhysicalMaterial({
        color: "#000000",
        roughness: 0.05,
        metalness: 0.1,
        transmission: 0.9,
        transparent: true,
      }),
      keyboardBase: new THREE.MeshStandardMaterial({
        color: "#111827",
        roughness: 0.8,
        metalness: 0.1,
      }),
      keyCap: new THREE.MeshStandardMaterial({
        color: "#1f2937",
        roughness: 0.6,
        metalness: 0.1,
      }),
      trackpad: new THREE.MeshStandardMaterial({
        color: "#8c93a0",
        roughness: 0.2,
        metalness: 0.7,
      }),
    };
  }, []);

  // Keyboard generation
  const keys = useMemo(() => {
    const keysArray = [];
    const rows = 6;
    const cols = 15;
    const keyWidth = 0.55;
    const keyHeight = 0.55;
    const spacing = 0.08;
    
    const startX = -((cols * (keyWidth + spacing)) / 2) + keyWidth / 2;
    const startZ = -((rows * (keyHeight + spacing)) / 2) + keyHeight / 2;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        // Simple cutout for spacebar area
        if (r === 0 && c > 4 && c < 10) continue; 
        if (r === 0 && c === 4) {
          keysArray.push({
            position: [startX + c * (keyWidth + spacing) + (keyWidth + spacing) * 2.5, 0.02, startZ + r * (keyHeight + spacing)],
            size: [keyWidth * 6 + spacing * 5, 0.04, keyHeight]
          });
          continue;
        }

        keysArray.push({
          position: [startX + c * (keyWidth + spacing), 0.02, startZ + r * (keyHeight + spacing)],
          size: [keyWidth, 0.04, keyHeight]
        });
      }
    }
    return keysArray;
  }, []);

  // Animation logic
  useFrame((state, delta) => {
    if (hinge.current) {
      // If entered, flatten the screen perfectly (-Math.PI/2) for the camera to push into
      let targetAngle = isOpen ? -Math.PI * 0.55 : -0.1;
      if (isEntered) targetAngle = -Math.PI / 2;
      
      hinge.current.rotation.x = THREE.MathUtils.damp(
        hinge.current.rotation.x,
        targetAngle,
        isEntered ? 6 : 4, // Faster damp when entering
        delta
      );
    }

    if (group.current) {
      if (!isEntered) {
        // Parallax effect based on pointer
        const targetRotationX = (state.pointer.y * Math.PI) / 30;
        const targetRotationY = (state.pointer.x * Math.PI) / 15;
        group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, targetRotationX, 2, delta);
        group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, targetRotationY, 2, delta);
      } else {
        // Flatten rotation for perfectly straight zoom
        group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, 0, 4, delta);
        group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, 0, 4, delta);
      }
    }
  });

  const handleEnter = () => {
    setIsEntering(true);
    onEnter();
  };

  return (
    <group ref={group} onClick={() => !isOpen && setIsOpen(true)}>
      {/* Laptop Base Group */}
      <group position={[0, 0, 0]}>
        
        {/* Main Base Chassis */}
        <RoundedBox args={[14, 0.4, 9.5]} radius={0.15} position={[0, -0.2, 0]} material={materials.aluminum} receiveShadow castShadow />
        
        {/* Keyboard Deck Recess */}
        <RoundedBox args={[12.5, 0.1, 4.5]} radius={0.05} position={[0, 0, -1.2]} material={materials.keyboardBase} />
        
        {/* Keys */}
        <group position={[0, 0, -1.2]}>
          {keys.map((k, i) => (
             <RoundedBox key={i} args={k.size as any} radius={0.01} position={k.position as any} material={materials.keyCap} castShadow />
          ))}
        </group>

        {/* Trackpad Recess */}
        <RoundedBox args={[5.5, 0.05, 3.2]} radius={0.1} position={[0, 0, 2.8]} material={materials.trackpad} />

      </group>

      {/* Hinge & Lid Group */}
      <group ref={hinge} position={[0, 0, -4.7]}>
        
        {/* Hinge Cylinder */}
        <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={materials.darkAluminum}>
          <cylinderGeometry args={[0.15, 0.15, 11, 32]} />
        </mesh>

        {/* Lid Group */}
        {/* Move the lid forward relative to the hinge so it pivots correctly */}
        <group position={[0, 0, 4.7]}>
          
          {/* Lid Chassis */}
          <RoundedBox args={[14, 0.25, 9.5]} radius={0.15} position={[0, 0.125 + 0.2, 0]} material={materials.aluminum} castShadow />
          
          {/* Screen Bezel */}
          <RoundedBox args={[13.6, 0.05, 9.1]} radius={0.1} position={[0, 0.125 + 0.32, 0]} material={materials.screenBezel} />

          {/* Screen Glass */}
          <mesh position={[0, 0.125 + 0.346, 0]}>
            <planeGeometry args={[13.2, 8.6]} />
            <meshStandardMaterial color="#000" roughness={0.1} metalness={0.9} />
          </mesh>

          {/* HTML Screen UI */}
          <Html
            transform
            distanceFactor={1.4}
            position={[0, 0.125 + 0.347, 0]}
            rotation={[-Math.PI / 2, 0, 0]} // Rotate to face out of the lid
            occlude="blending"
          >
            <div 
              style={{
                width: "1024px",
                height: "640px",
                background: "#000",
                display: isOpen ? "block" : "none", // Hide UI when mostly closed for perf/looks
              }}
            >
              <ScreenUI onEnter={handleEnter} isEntering={isEntering} />
            </div>
          </Html>

        </group>
      </group>

    </group>
  );
}
