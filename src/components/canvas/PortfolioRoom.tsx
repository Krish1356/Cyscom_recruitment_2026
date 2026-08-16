import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, PresentationControls, ContactShadows } from '@react-three/drei'
import { Model as ComputerSetup } from './ComputerSetup'
import { Model as EnvironmentModel } from './EnvironmentModel'
import { Model as DecorModel } from './DecorModel'

export function PortfolioRoom({ onTransitionComplete }: { onTransitionComplete: () => void }) {
  return (
    <div className="absolute inset-0 z-50 bg-[#151515] overflow-hidden select-none">
      <Canvas camera={{ position: [-3, 1.5, 4], fov: 45 }} dpr={[1, 2]}>
        <Suspense fallback={null}>
          <ambientLight intensity={1.5} />
          <directionalLight position={[10, 10, 5]} intensity={1.5} />
          <OrbitControls makeDefault />
          
          <PresentationControls
            global
            rotation={[0, 0, 0]}
            polar={[-0.1, 0.1]}
            azimuth={[-0.5, 0.5]}
            snap
          >
            <group position={[0, -1.2, 0]} rotation={[0, -Math.PI / 4, 0]}>
              <ComputerSetup onTransitionComplete={onTransitionComplete} />
              <EnvironmentModel />
              <DecorModel />
            </group>
          </PresentationControls>
          
          <ContactShadows position={[0, -2.5, 0]} opacity={0.6} scale={20} blur={2.5} far={4} />
        </Suspense>
      </Canvas>
    </div>
  )
}
