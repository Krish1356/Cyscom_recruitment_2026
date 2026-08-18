"use client";

import { Canvas } from "@react-three/fiber";
import { CyberTopology } from "./CyberTopology";

export default function CyberTopologyCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0, 15], fov: 45 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <CyberTopology />
    </Canvas>
  );
}
