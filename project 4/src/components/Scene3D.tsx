import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, PerspectiveCamera, Environment, ContactShadows } from "@react-three/drei";
import { Mesh, Group, type BufferGeometry } from "three";

function GoldBarberChair({ mouse }: { mouse: { x: number; y: number } }) {
  const group = useRef<Group>(null!);

  useFrame(() => {
    if (group.current) {
      group.current.rotation.y += (mouse.x * 0.5 - group.current.rotation.y) * 0.05;
      group.current.rotation.x += (-mouse.y * 0.3 - group.current.rotation.x) * 0.05;
    }
  });

  return (
    <Float speed={0.5} rotationIntensity={0.1} floatIntensity={0.3}>
      <group ref={group} position={[0, -0.5, 0]}>
        <mesh position={[0, 0, 0]} castShadow>
          <cylinderGeometry args={[1.2, 1.4, 0.3, 32]} />
          <meshStandardMaterial color="#c8b04a" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.6, 0]} castShadow>
          <cylinderGeometry args={[0.9, 1.0, 0.8, 32]} />
          <meshStandardMaterial color="#111111" metalness={0.3} roughness={0.7} />
        </mesh>
        <mesh position={[0, 1.2, 0]} castShadow>
          <sphereGeometry args={[0.7, 32, 32]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.4} roughness={0.6} />
        </mesh>
        <mesh position={[0.7, 0.3, 0.7]} castShadow>
          <boxGeometry args={[0.1, 0.9, 0.1]} />
          <meshStandardMaterial color="#c8b04a" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[-0.7, 0.3, 0.7]} castShadow>
          <boxGeometry args={[0.1, 0.9, 0.1]} />
          <meshStandardMaterial color="#c8b04a" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>
    </Float>
  );
}

function Particles({ count = 200 }) {
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20 - 5;
    }
    return pos;
  }, [count]);

  const meshRef = useRef<Mesh>(null!);
  const geoRef = useRef<BufferGeometry>(null!);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry ref={geoRef}>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#c8b04a" transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

export default function Scene3D({ mouse }: { mouse: { x: number; y: number } }) {
  return (
    <Canvas shadows dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
      <PerspectiveCamera makeDefault position={[0, 2, 5]} fov={45} />
      <ambientLight intensity={0.3} />
      <spotLight position={[5, 8, 5]} angle={0.4} penumbra={0.8} intensity={2} color="#c8b04a" castShadow />
      <pointLight position={[-3, 2, -2]} intensity={0.8} color="#c8b04a" />
      <Environment preset="studio" />
      <ContactShadows position={[0, -0.8, 0]} opacity={0.4} scale={6} blur={2.5} />
      <GoldBarberChair mouse={mouse} />
      <Particles />
    </Canvas>
  );
}
