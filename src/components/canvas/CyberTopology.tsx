"use client";

import { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export function CyberTopology() {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const packetsRef = useRef<THREE.Points>(null);
  const gridRef = useRef<THREE.GridHelper>(null);
  const cameraGroup = useRef<THREE.Group>(null);
  const scanLineRef = useRef<THREE.Mesh>(null);

  // Track target Y for camera based on scroll
  const targetCameraY = useRef(0);
  // Track mouse
  const mouse = useRef(new THREE.Vector2(0, 0));

  useEffect(() => {
    const handleScroll = () => {
      const docHeight = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const progress = Math.max(0, Math.min(1, window.scrollY / docHeight));
      // Fly-through range: Scene moves UP by 45 units to reveal lower nodes
      targetCameraY.current = progress * 45;
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    
    // Initial call
    setTimeout(handleScroll, 100);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const { nodePositions, originalPositions, nodeColors, nodeSizes, lines, packets, packetColors } = useMemo(() => {
    const allPositions: THREE.Vector3[] = [];
    const sizesArray: number[] = [];
    const colorArray: number[] = [];
    
    const dimGrey = new THREE.Color("#4A5568");
    const softBlue = new THREE.Color("#005C6B");
    const electricCyan = new THREE.Color("#00D9FF");
    const cyscomGreen = new THREE.Color("#67E8F9");

    // Helper to add a cluster
    const addCluster = (center: THREE.Vector3, radius: number, count: number, isHighPriority = false) => {
      // Hub
      allPositions.push(center);
      sizesArray.push(0.35);
      const hubColor = isHighPriority ? cyscomGreen : electricCyan;
      colorArray.push(hubColor.r, hubColor.g, hubColor.b);

      for (let i = 0; i < count; i++) {
        const p = new THREE.Vector3(
          center.x + (Math.random() - 0.5) * radius * 2,
          center.y + (Math.random() - 0.5) * radius * 2,
          center.z + (Math.random() - 0.5) * radius * 2
        );
        allPositions.push(p);
        sizesArray.push(Math.random() > 0.8 ? 0.2 : 0.1);

        const rand = Math.random();
        let col = dimGrey;
        if (isHighPriority && rand > 0.9) col = cyscomGreen;
        else if (rand > 0.8) col = electricCyan;
        else if (rand > 0.5) col = softBlue;

        colorArray.push(col.r, col.g, col.b);
      }
    };

    // Hero Section (Y ≈ 0) - Widen to fill screen
    addCluster(new THREE.Vector3(0, 0, 0), 8, 80, true);
    addCluster(new THREE.Vector3(-14, 4, -5), 7, 50);
    addCluster(new THREE.Vector3(14, -2, -8), 7, 50);
    addCluster(new THREE.Vector3(-22, -4, -12), 8, 40);
    addCluster(new THREE.Vector3(22, 6, -10), 8, 40);

    // Process Section (Y ≈ -10) - Sparse but wide
    addCluster(new THREE.Vector3(-12, -10, -3), 6, 25);
    addCluster(new THREE.Vector3(12, -12, -6), 6, 25);
    addCluster(new THREE.Vector3(-20, -14, -10), 7, 20);
    addCluster(new THREE.Vector3(20, -8, -12), 7, 20);

    // Departments (Y ≈ -20) - 5 Distinct Clusters spread far apart
    addCluster(new THREE.Vector3(0, -20, 2), 4, 30, true); // Technical
    addCluster(new THREE.Vector3(-12, -18, -4), 4, 25); // Web
    addCluster(new THREE.Vector3(12, -18, -4), 4, 25); // Design
    addCluster(new THREE.Vector3(-22, -22, -8), 5, 20); // Events
    addCluster(new THREE.Vector3(22, -22, -8), 5, 20); // Social

    // Community (Y ≈ -30) - Dense & Active, covering edges
    addCluster(new THREE.Vector3(0, -30, -2), 9, 80);
    addCluster(new THREE.Vector3(-16, -28, -10), 8, 50);
    addCluster(new THREE.Vector3(16, -32, -8), 8, 50);
    addCluster(new THREE.Vector3(-26, -30, -15), 10, 40);
    addCluster(new THREE.Vector3(26, -28, -15), 10, 40);

    // CTA (Y ≈ -40) - Converging from far sides
    addCluster(new THREE.Vector3(0, -40, 0), 6, 40, true);
    addCluster(new THREE.Vector3(-14, -42, -5), 5, 30);
    addCluster(new THREE.Vector3(14, -38, -5), 5, 30);

    // --- Build buffers ---
    const posArray = new Float32Array(allPositions.length * 3);
    const originalPosArray = new Float32Array(allPositions.length * 3);
    
    allPositions.forEach((v, i) => {
      posArray[i * 3] = v.x;
      posArray[i * 3 + 1] = v.y;
      posArray[i * 3 + 2] = v.z;
      
      originalPosArray[i * 3] = v.x;
      originalPosArray[i * 3 + 1] = v.y;
      originalPosArray[i * 3 + 2] = v.z;
    });

    const lineIndices: number[] = [];
    const validConnections: {start: number, end: number}[] = [];
    
    // Connect nodes locally
    for (let i = 0; i < allPositions.length; i++) {
      for (let j = i + 1; j < allPositions.length; j++) {
        const dist = allPositions[i].distanceTo(allPositions[j]);
        if (dist < 6.5) { // Increased distance to connect wider nodes
          lineIndices.push(i, j);
          validConnections.push({start: i, end: j});
        }
      }
    }

    // Connect vertical regions to ensure continuous flow
    for (let i = 0; i < allPositions.length; i++) {
      for (let j = i + 1; j < allPositions.length; j++) {
        const dist = allPositions[i].distanceTo(allPositions[j]);
        if (dist > 6.5 && dist < 16 && Math.random() > 0.95) {
          lineIndices.push(i, j);
          validConnections.push({start: i, end: j});
        }
      }
    }

    // Data Packets
    const numPackets = 180; // More packets across the huge world
    const packetData = [];
    const pColors = new Float32Array(numPackets * 3);

    for(let i=0; i<numPackets; i++) {
       const conn = validConnections[Math.floor(Math.random() * validConnections.length)];
       const isGreen = Math.random() > 0.9;
       packetData.push({
         conn: conn,
         progress: Math.random(),
         speed: 0.05 + Math.random() * 0.2, // Slower
         isGreen
       });
       const col = isGreen ? cyscomGreen : electricCyan;
       pColors[i*3] = col.r;
       pColors[i*3+1] = col.g;
       pColors[i*3+2] = col.b;
    }

    return { 
      nodePositions: posArray,
      originalPositions: originalPosArray,
      nodeColors: new Float32Array(colorArray),
      nodeSizes: new Float32Array(sizesArray),
      lines: new Uint16Array(lineIndices),
      validConnections,
      packets: packetData,
      packetColors: pColors
    };
  }, []);

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;

    // Smooth camera Y interpolation
    if (cameraGroup.current) {
      cameraGroup.current.position.y = THREE.MathUtils.lerp(
        cameraGroup.current.position.y,
        targetCameraY.current,
        delta * 3
      );

      // Passive Parallax based on mouse (moves the group slightly opposite to mouse)
      cameraGroup.current.position.x = THREE.MathUtils.lerp(
        cameraGroup.current.position.x,
        mouse.current.x * 1.5,
        delta * 2
      );
    }

    // 1. Drifting Nodes & Mouse Interaction
    if (pointsRef.current && linesRef.current) {
      const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
      
      // Calculate mouse in 3D local space
      const mouseWorld = new THREE.Vector3(
        mouse.current.x * 10,
        mouse.current.y * 10 - targetCameraY.current,
        0
      );

      for(let i=0; i<posAttr.count; i++) {
        const ox = originalPositions[i*3];
        const oy = originalPositions[i*3+1];
        const oz = originalPositions[i*3+2];

        // Organic drift
        let nx = ox + Math.sin(time * 0.2 + i * 0.1) * 0.4;
        let ny = oy + Math.cos(time * 0.3 + i * 0.2) * 0.4;
        let nz = oz + Math.sin(time * 0.1 + i * 0.3) * 0.4;

        // Subtle mouse repulsion
        const dx = nx - mouseWorld.x;
        const dy = ny - mouseWorld.y;
        const distSq = dx*dx + dy*dy;
        if (distSq < 25) { // Within radius
          const repulsion = (25 - distSq) * 0.02;
          nx += dx * repulsion;
          ny += dy * repulsion;
        }

        posAttr.array[i*3] = nx;
        posAttr.array[i*3+1] = ny;
        posAttr.array[i*3+2] = nz;
      }
      
      posAttr.needsUpdate = true;
      (linesRef.current.geometry.attributes.position as any).array = posAttr.array;
      linesRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // 2. Data Packets
    if (packetsRef.current && pointsRef.current) {
      const packetPosAttr = packetsRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const nodePosAttr = pointsRef.current.geometry.attributes.position.array;

      for(let i=0; i<packets.length; i++) {
        const p = packets[i];
        p.progress += delta * p.speed;
        
        if (p.progress >= 1) {
          p.progress = 0;
          // Loop on same connection to save CPU, or we could pick a new one.
          // Let's just swap direction for organic feel.
          const temp = p.conn.start;
          p.conn.start = p.conn.end;
          p.conn.end = temp;
        }

        const sx = nodePosAttr[p.conn.start*3];
        const sy = nodePosAttr[p.conn.start*3+1];
        const sz = nodePosAttr[p.conn.start*3+2];

        const ex = nodePosAttr[p.conn.end*3];
        const ey = nodePosAttr[p.conn.end*3+1];
        const ez = nodePosAttr[p.conn.end*3+2];

        packetPosAttr.array[i*3] = sx + (ex - sx) * p.progress;
        packetPosAttr.array[i*3+1] = sy + (ey - sy) * p.progress;
        packetPosAttr.array[i*3+2] = sz + (ez - sz) * p.progress;
      }
      packetPosAttr.needsUpdate = true;
    }

    // 3. Scan Line Effect
    if (scanLineRef.current) {
      // Moves downwards repeatedly
      scanLineRef.current.position.y = (time * 1.5) % 20; 
      // This will map to local space, so we offset by camera
      if (cameraGroup.current) {
        scanLineRef.current.position.y = cameraGroup.current.position.y + 10 - ((time * 2) % 30);
      }
    }
    
    // 4. Perspective Grid Scroll
    if (gridRef.current && cameraGroup.current) {
      gridRef.current.position.y = cameraGroup.current.position.y;
    }
  });

  return (
    <group ref={cameraGroup}>
      {/* Background Perspective Grid */}
      <gridHelper 
        ref={gridRef}
        args={[200, 80, '#005C6B', '#111A24']} 
        position={[0, 0, -30]} 
        rotation={[Math.PI / 2, 0, 0]} 
      />

      {/* The main topology group slightly pushed back */}
      <group position={[0, 0, -8]}>
        
        {/* Nodes */}
        <points ref={pointsRef}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" count={nodePositions.length / 3} args={[nodePositions, 3]} />
            <bufferAttribute attach="attributes-color" count={nodeColors.length / 3} args={[nodeColors, 3]} />
            <bufferAttribute attach="attributes-size" count={nodeSizes.length} args={[nodeSizes, 1]} />
          </bufferGeometry>
          <pointsMaterial
            vertexColors
            transparent
            opacity={0.8}
            sizeAttenuation
            map={createCircleTexture()}
            alphaTest={0.01}
            depthWrite={false}
          />
        </points>
        
        {/* Data Packets */}
        <points ref={packetsRef}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" count={packets.length} args={[new Float32Array(packets.length * 3), 3]} />
            <bufferAttribute attach="attributes-color" count={packetColors.length / 3} args={[packetColors, 3]} />
          </bufferGeometry>
          <pointsMaterial
            vertexColors
            size={0.4}
            transparent
            opacity={1}
            sizeAttenuation
            map={createCircleTexture()}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </points>

        {/* Connections */}
        <lineSegments ref={linesRef}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" count={nodePositions.length / 3} args={[nodePositions, 3]} />
            <bufferAttribute attach="index" count={lines.length} args={[lines, 1]} />
          </bufferGeometry>
          <lineBasicMaterial
            color="#2A3542" // Very subtle dark grey/blue line
            transparent
            opacity={0.15}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </lineSegments>

        {/* Scan Effect - Giant thin plane that moves down */}
        <mesh ref={scanLineRef} position={[0, 0, 0]}>
          <planeGeometry args={[100, 0.5]} />
          <meshBasicMaterial 
            color="#00D9FF" 
            transparent 
            opacity={0.02} 
            blending={THREE.AdditiveBlending} 
            depthWrite={false} 
          />
        </mesh>
      </group>
    </group>
  );
}

function createCircleTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  const context = canvas.getContext('2d');
  if (context) {
    const gradient = context.createRadialGradient(16, 16, 0, 16, 16, 16);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.2, 'rgba(255,255,255,0.8)');
    gradient.addColorStop(0.5, 'rgba(255,255,255,0.2)');
    gradient.addColorStop(1, 'rgba(0,0,0,0)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, 32, 32);
  }
  return new THREE.CanvasTexture(canvas);
}
