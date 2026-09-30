import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Ocean = () => {
  const meshRef = useRef();

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColorTop: { value: new THREE.Color('#00E5FF') }, // Cyan highlights
    uColorBottom: { value: new THREE.Color('#030712') }, // Deep dark navy
  }), []);

  const vertexShader = `
    uniform float uTime;
    varying float vElevation;
    void main() {
      vec4 modelPosition = modelMatrix * vec4(position, 1.0);
      
      // Wave effect combinations
      float elevation = sin(modelPosition.x * 0.8 + uTime * 0.5) * 
                        sin(modelPosition.z * 0.8 + uTime * 0.4) * 0.6;
                        
      elevation += sin(modelPosition.x * 2.0 - uTime * 1.2) * 0.15;
      elevation += cos(modelPosition.z * 1.5 + uTime * 0.8) * 0.15;
                        
      modelPosition.y += elevation;
      vElevation = elevation;
      
      vec4 viewPosition = viewMatrix * modelPosition;
      vec4 projectedPosition = projectionMatrix * viewPosition;
      gl_Position = projectedPosition;
    }
  `;

  const fragmentShader = `
    uniform vec3 uColorTop;
    uniform vec3 uColorBottom;
    varying float vElevation;
    void main() {
      // Mix colors based on wave height
      float mixStrength = (vElevation + 0.6) / 1.2;
      mixStrength = smoothstep(0.0, 1.0, mixStrength);
      vec3 color = mix(uColorBottom, uColorTop, mixStrength * 0.35); // Subtle cyan highlights
      gl_FragColor = vec4(color, 1.0);
    }
  `;

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.material.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
      <planeGeometry args={[100, 100, 128, 128]} />
      <shaderMaterial 
        vertexShader={vertexShader} 
        fragmentShader={fragmentShader} 
        uniforms={uniforms}
        wireframe={false}
      />
    </mesh>
  );
};

export default function WaterBackground() {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: -1, // Keep it strictly behind everything
      pointerEvents: 'none',
      background: 'linear-gradient(180deg, #020617 0%, #06102b 100%)' // Fallback/Deep ocean
    }}>
      <Canvas camera={{ position: [0, 1.5, 8], fov: 60 }}>
        <fog attach="fog" args={['#020617', 5, 25]} />
        <ambientLight intensity={0.5} />
        <Ocean />
      </Canvas>
    </div>
  );
}
