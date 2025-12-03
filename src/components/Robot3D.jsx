import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useSpring, animated } from "@react-spring/three";

function Robot3D({ robotState = "idle" }) {
  const groupRef = useRef();
  const headRef = useRef();

  // Animación idle: movimiento sutil de flotación
  useFrame((state) => {
    if (robotState === "idle" && groupRef.current) {
      groupRef.current.position.y =
        Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      groupRef.current.rotation.y =
        Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
    }
  });

  // Animación de cabeza: parpadeo sutil
  useFrame((state) => {
    if (headRef.current) {
      const blink = Math.sin(state.clock.elapsedTime * 2) * 0.02;
      headRef.current.rotation.x = blink;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Cabeza del robot */}
      <group ref={headRef} position={[0, 1.2, 0]}>
        {/* Cabeza principal */}
        <mesh castShadow>
          <boxGeometry args={[0.8, 0.8, 0.8]} />
          <meshStandardMaterial
            color="#60a5fa"
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>

        {/* Antena */}
        <mesh position={[0, 0.5, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.3]} />
          <meshStandardMaterial
            color="#3b82f6"
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>

        {/* Esfera de antena */}
        <mesh position={[0, 0.7, 0]} castShadow>
          <sphereGeometry args={[0.1]} />
          <meshStandardMaterial
            color="#ef4444"
            emissive="#ef4444"
            emissiveIntensity={0.5}
          />
        </mesh>

        {/* Ojo izquierdo */}
        <mesh position={[-0.2, 0.1, 0.41]} castShadow>
          <sphereGeometry args={[0.12]} />
          <meshStandardMaterial
            color="#fff"
            emissive="#22d3ee"
            emissiveIntensity={0.8}
          />
        </mesh>

        {/* Ojo derecho */}
        <mesh position={[0.2, 0.1, 0.41]} castShadow>
          <sphereGeometry args={[0.12]} />
          <meshStandardMaterial
            color="#fff"
            emissive="#22d3ee"
            emissiveIntensity={0.8}
          />
        </mesh>

        {/* Boca */}
        <mesh position={[0, -0.2, 0.41]} castShadow>
          <boxGeometry args={[0.3, 0.08, 0.05]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
      </group>

      {/* Cuerpo */}
      <mesh position={[0, 0.3, 0]} castShadow>
        <boxGeometry args={[1, 1.2, 0.6]} />
        <meshStandardMaterial color="#3b82f6" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Panel del pecho */}
      <mesh position={[0, 0.4, 0.31]} castShadow>
        <boxGeometry args={[0.5, 0.5, 0.05]} />
        <meshStandardMaterial
          color="#1e293b"
          emissive="#22d3ee"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Brazo izquierdo */}
      <group position={[-0.65, 0.5, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.12, 0.12, 0.8]} />
          <meshStandardMaterial
            color="#60a5fa"
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
        {/* Mano */}
        <mesh position={[0, -0.5, 0]} castShadow>
          <sphereGeometry args={[0.15]} />
          <meshStandardMaterial
            color="#3b82f6"
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
      </group>

      {/* Brazo derecho */}
      <group position={[0.65, 0.5, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.12, 0.12, 0.8]} />
          <meshStandardMaterial
            color="#60a5fa"
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
        {/* Mano */}
        <mesh position={[0, -0.5, 0]} castShadow>
          <sphereGeometry args={[0.15]} />
          <meshStandardMaterial
            color="#3b82f6"
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
      </group>

      {/* Pierna izquierda */}
      <group position={[-0.25, -0.5, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.15, 0.15, 0.8]} />
          <meshStandardMaterial
            color="#60a5fa"
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
        {/* Pie */}
        <mesh position={[0, -0.5, 0.1]} castShadow>
          <boxGeometry args={[0.2, 0.1, 0.3]} />
          <meshStandardMaterial
            color="#3b82f6"
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
      </group>

      {/* Pierna derecha */}
      <group position={[0.25, -0.5, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.15, 0.15, 0.8]} />
          <meshStandardMaterial
            color="#60a5fa"
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
        {/* Pie */}
        <mesh position={[0, -0.5, 0.1]} castShadow>
          <boxGeometry args={[0.2, 0.1, 0.3]} />
          <meshStandardMaterial
            color="#3b82f6"
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
      </group>
    </group>
  );
}

export default Robot3D;
