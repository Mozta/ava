import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useSpring, animated } from "@react-spring/three";

function Robot3D({
  robotState = "idle",
  facePosition = null,
  faceDetected = false,
  isSpeaking = false,
}) {
  const groupRef = useRef();
  const headRef = useRef();
  const mouthRef = useRef();
  const leftEyeRef = useRef();
  const rightEyeRef = useRef();
  const antennaRef = useRef();
  const leftArmRef = useRef();
  const rightArmRef = useRef();
  const bodyRef = useRef();

  // Animación idle: movimiento sutil de flotación
  useFrame((state) => {
    if (robotState === "idle" && groupRef.current) {
      const t = state.clock.elapsedTime;
      groupRef.current.position.y = Math.sin(t * 0.5) * 0.1;
      groupRef.current.rotation.y = Math.sin(t * 0.3) * 0.05;
      groupRef.current.rotation.z = Math.sin(t * 0.4) * 0.02;
    }
  });

  // Animación de cabeza: seguir al usuario o parpadeo sutil
  useFrame((state) => {
    if (headRef.current) {
      const t = state.clock.elapsedTime;
      
      if (isSpeaking || robotState === "talking") {
        // Movimiento más expresivo al hablar
        const nod = Math.sin(t * 4) * 0.08; // Asentimiento
        const tilt = Math.sin(t * 3) * 0.05; // Inclinación lateral
        
        if (faceDetected && facePosition) {
          const targetRotationY = facePosition.x * 0.5 + tilt;
          const targetRotationX = facePosition.y * 0.3 + nod;
          headRef.current.rotation.y += (targetRotationY - headRef.current.rotation.y) * 0.15;
          headRef.current.rotation.x += (targetRotationX - headRef.current.rotation.x) * 0.15;
        } else {
          headRef.current.rotation.x += (nod - headRef.current.rotation.x) * 0.15;
          headRef.current.rotation.z += (tilt - headRef.current.rotation.z) * 0.15;
        }
      } else if (faceDetected && facePosition) {
        // Seguir la posición del rostro detectado suavemente
        const targetRotationY = facePosition.x * 0.5;
        const targetRotationX = facePosition.y * 0.3;
        headRef.current.rotation.y += (targetRotationY - headRef.current.rotation.y) * 0.1;
        headRef.current.rotation.x += (targetRotationX - headRef.current.rotation.x) * 0.1;
      } else {
        // Movimiento sutil cuando no hay rostro detectado
        const blink = Math.sin(t * 2) * 0.02;
        headRef.current.rotation.x += (blink - headRef.current.rotation.x) * 0.1;
        headRef.current.rotation.y += (0 - headRef.current.rotation.y) * 0.1;
        headRef.current.rotation.z += (0 - headRef.current.rotation.z) * 0.1;
      }
    }
  });

  // Efecto de saludo cuando se detecta un rostro por primera vez
  useEffect(() => {
    if (faceDetected && robotState === "idle") {
      // Aquí podríamos cambiar el estado a 'greeting' automáticamente
      console.log("¡Rostro detectado! El robot puede saludar.");
    }
  }, [faceDetected, robotState]);

  // Animación de boca cuando habla
  useFrame((state) => {
    if (mouthRef.current) {
      const t = state.clock.elapsedTime;
      if (isSpeaking || robotState === "talking") {
        // Movimiento de boca más realista con múltiples frecuencias
        const mouthMovement = Math.abs(Math.sin(t * 20)) * 0.2 + Math.abs(Math.sin(t * 35)) * 0.1;
        const mouthWidth = 1 + Math.sin(t * 15) * 0.15;
        mouthRef.current.scale.y = 1 + mouthMovement;
        mouthRef.current.scale.x = mouthWidth;
      } else {
        // Resetear escala de boca
        mouthRef.current.scale.y += (1 - mouthRef.current.scale.y) * 0.15;
        mouthRef.current.scale.x += (1 - mouthRef.current.scale.x) * 0.15;
      }
    }
  });

  // Animación de ojos: parpadeo y expresividad
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    if (leftEyeRef.current && rightEyeRef.current) {
      // Parpadeo ocasional
      const blinkCycle = Math.floor(t * 0.5) % 5;
      const blink = blinkCycle === 0 ? Math.max(0, 1 - Math.abs(Math.sin(t * 20)) * 2) : 1;
      
      leftEyeRef.current.scale.y = blink;
      rightEyeRef.current.scale.y = blink;
      
      // Brillo más intenso al hablar
      if (isSpeaking || robotState === "talking") {
        const intensity = 0.8 + Math.sin(t * 10) * 0.3;
        leftEyeRef.current.material.emissiveIntensity = intensity;
        rightEyeRef.current.material.emissiveIntensity = intensity;
      } else {
        leftEyeRef.current.material.emissiveIntensity += (0.8 - leftEyeRef.current.material.emissiveIntensity) * 0.1;
        rightEyeRef.current.material.emissiveIntensity += (0.8 - rightEyeRef.current.material.emissiveIntensity) * 0.1;
      }
    }
  });

  // Animación de antena pulsante
  useFrame((state) => {
    if (antennaRef.current) {
      const t = state.clock.elapsedTime;
      if (isSpeaking || robotState === "talking") {
        const pulse = 1 + Math.sin(t * 8) * 0.4;
        antennaRef.current.material.emissiveIntensity = pulse;
      } else {
        antennaRef.current.material.emissiveIntensity += (0.5 - antennaRef.current.material.emissiveIntensity) * 0.1;
      }
    }
  });

  // Animación de brazos y cuerpo al hablar
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    if (leftArmRef.current && rightArmRef.current && bodyRef.current) {
      if (isSpeaking || robotState === "talking") {
        // Gestos con los brazos al hablar
        const leftGesture = Math.sin(t * 2.5) * 0.3;
        const rightGesture = Math.sin(t * 2.5 + Math.PI) * 0.3;
        
        leftArmRef.current.rotation.z = leftGesture;
        rightArmRef.current.rotation.z = -rightGesture;
        
        // Movimiento sutil del cuerpo
        const bodyMove = Math.sin(t * 3) * 0.03;
        bodyRef.current.rotation.y = bodyMove;
        bodyRef.current.position.y = 0.3 + Math.sin(t * 4) * 0.02;
      } else {
        // Volver a posición neutral
        leftArmRef.current.rotation.z += (0 - leftArmRef.current.rotation.z) * 0.1;
        rightArmRef.current.rotation.z += (0 - rightArmRef.current.rotation.z) * 0.1;
        bodyRef.current.rotation.y += (0 - bodyRef.current.rotation.y) * 0.1;
        bodyRef.current.position.y += (0.3 - bodyRef.current.position.y) * 0.1;
      }
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
        <mesh ref={antennaRef} position={[0, 0.7, 0]} castShadow>
          <sphereGeometry args={[0.1]} />
          <meshStandardMaterial
            color="#ef4444"
            emissive="#ef4444"
            emissiveIntensity={0.5}
          />
        </mesh>

        {/* Ojo izquierdo */}
        <mesh ref={leftEyeRef} position={[-0.2, 0.1, 0.41]} castShadow>
          <sphereGeometry args={[0.12]} />
          <meshStandardMaterial
            color="#fff"
            emissive="#22d3ee"
            emissiveIntensity={0.8}
          />
        </mesh>

        {/* Ojo derecho */}
        <mesh ref={rightEyeRef} position={[0.2, 0.1, 0.41]} castShadow>
          <sphereGeometry args={[0.12]} />
          <meshStandardMaterial
            color="#fff"
            emissive="#22d3ee"
            emissiveIntensity={0.8}
          />
        </mesh>

        {/* Boca */}
        <mesh ref={mouthRef} position={[0, -0.2, 0.41]} castShadow>
          <boxGeometry args={[0.3, 0.08, 0.05]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
      </group>

      {/* Cuerpo */}
      <mesh ref={bodyRef} position={[0, 0.3, 0]} castShadow>
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
      <group ref={leftArmRef} position={[-0.65, 0.5, 0]}>
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
      <group ref={rightArmRef} position={[0.65, 0.5, 0]}>
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
