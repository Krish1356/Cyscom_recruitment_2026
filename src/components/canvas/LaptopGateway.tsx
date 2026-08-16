"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, ContactShadows, Preload } from "@react-three/drei";
import { Suspense, useState, useRef } from "react";
import * as THREE from "three";
import { DetailedMacbook } from "./DetailedMacbook";

interface LaptopGatewayProps {
  onTransitionComplete: () => void;
}

function CameraRig({ isEntered }: { isEntered: boolean }) {
  const { camera } = useThree();
  const vec = new THREE.Vector3();
  const lookAtVec = new THREE.Vector3();
  
  useFrame((state, delta) => {
    if (isEntered) {
      // Cinematic push-in: move camera directly into the laptop screen
      // The screen center for the DetailedMacbook model is roughly [0, 1.3, -2.9] when flattened.
      vec.set(0, 1.3, -2.5); // Push exactly to the screen surface
      lookAtVec.set(0, 1.3, -3.0); 
      
      camera.position.lerp(vec, delta * 3);
      const currentQuat = camera.quaternion.clone();
      camera.lookAt(lookAtVec);
      const targetQuat = camera.quaternion.clone();
      camera.quaternion.copy(currentQuat);
      camera.quaternion.slerp(targetQuat, delta * 4);

    } else {
      // Default view: let the Macbook component handle its own floating rotation,
      // just keep the camera steady in front.
      vec.set(0, 3, 11);
      camera.position.lerp(vec, delta * 2);
      
      const currentQuat = camera.quaternion.clone();
      camera.lookAt(0, 0, 0);
      const targetQuat = camera.quaternion.clone();
      camera.quaternion.copy(currentQuat);
      camera.quaternion.slerp(targetQuat, delta * 2);
    }
  });

  return null;
}

export function LaptopGateway({ onTransitionComplete }: LaptopGatewayProps) {
  // Start the laptop open by default
  const [isOpen, setIsOpen] = useState(true);
  const [isEntered, setIsEntered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleEnter = () => {
    setIsEntered(true);
    // After 1.5 seconds of camera push-in, complete the transition
    setTimeout(() => {
      onTransitionComplete();
    }, 1500);
  };

  return (
    <div ref={containerRef} className="absolute inset-0 z-50 bg-[#000000] overflow-hidden">
      
      <Canvas camera={{ position: [0, 0, 15], fov: 45 }} dpr={[1, 2]}>
        <Suspense fallback={null}>
          <Environment preset="city" />
          
          <group position={[0, -1, 0]}>
            <DetailedMacbook onEnter={handleEnter} isEntered={isEntered} />
            <ContactShadows position={[0, -0.4, 0]} opacity={0.6} scale={20} blur={2.5} far={4} />
          </group>

          <CameraRig isEntered={isEntered} />
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
}
