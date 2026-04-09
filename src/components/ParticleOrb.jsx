import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  PARTICLE_COLORS,
  PARTICLE_COUNT,
  PARTICLE_SETTINGS,
} from "../config/particleConfig";

// Genera posiciones en una esfera
function randomOnSphere(radius) {
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(2 * Math.random() - 1);
  return [
    radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.sin(phi) * Math.sin(theta),
    radius * Math.cos(phi),
  ];
}

// Pre-computa una tabla de ruido para evitar Math.random() en el loop
function buildNoiseTable(size) {
  const table = new Float32Array(size);
  for (let i = 0; i < size; i++) {
    table[i] = (Math.random() - 0.5) * 2; // -1 a 1
  }
  return table;
}

// Genera las posiciones target para la formación de cara (talking)
function computeFaceTargets(count, settings) {
  const { faceFormation, orbRadius } = settings;
  const targets = new Float32Array(count * 3);

  const eyeCount = Math.floor(count * faceFormation.eyeParticleRatio);
  const mouthCount = Math.floor(count * faceFormation.mouthParticleRatio);

  let idx = 0;

  // Ojo izquierdo — disco denso mirando al frente
  for (let i = 0; i < eyeCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const r = Math.random() * faceFormation.eyeRadius;
    targets[idx * 3] = -faceFormation.eyeSeparation + Math.cos(angle) * r;
    targets[idx * 3 + 1] = faceFormation.eyeHeight + Math.sin(angle) * r;
    targets[idx * 3 + 2] = orbRadius * 0.85 + (Math.random() - 0.5) * 0.04;
    idx++;
  }

  // Ojo derecho — disco denso mirando al frente
  for (let i = 0; i < eyeCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const r = Math.random() * faceFormation.eyeRadius;
    targets[idx * 3] = faceFormation.eyeSeparation + Math.cos(angle) * r;
    targets[idx * 3 + 1] = faceFormation.eyeHeight + Math.sin(angle) * r;
    targets[idx * 3 + 2] = orbRadius * 0.85 + (Math.random() - 0.5) * 0.04;
    idx++;
  }

  // Boca — arco sonriente con grosor
  for (let i = 0; i < mouthCount; i++) {
    const t = (i / mouthCount) * Math.PI;
    const x = Math.cos(t) * faceFormation.mouthWidth;
    const curve = -Math.sin(t) * faceFormation.mouthCurve;
    const y = faceFormation.mouthHeight + curve + (Math.random() - 0.5) * 0.04;
    const z = orbRadius * 0.85 + (Math.random() - 0.5) * 0.04;
    targets[idx * 3] = x;
    targets[idx * 3 + 1] = y;
    targets[idx * 3 + 2] = z;
    idx++;
  }

  // Resto de partículas — halo difuso detrás de la cara
  for (let i = idx; i < count; i++) {
    const [x, y, z] = randomOnSphere(orbRadius * (0.6 + Math.random() * 0.5));
    targets[i * 3] = x;
    targets[i * 3 + 1] = y;
    targets[i * 3 + 2] = -Math.abs(z) * 0.7;
  }

  return targets;
}

function ParticleOrb({
  robotState = "idle",
  facePosition = null,
  faceDetected = false,
  isSpeaking = false,
}) {
  const pointsRef = useRef();
  const glowRef = useRef();
  const groupRef = useRef();
  const stateRef = useRef({
    currentState: "idle",
    prevState: "idle",
    transitionProgress: 1,
    greetingTimer: 0,
    greetingPhase: 0,
  });

  const settings = PARTICLE_SETTINGS;

  // Pre-computar posiciones base, normales y distancias (una sola vez)
  const { basePositions, normals, distances } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const norms = new Float32Array(PARTICLE_COUNT * 3);
    const dists = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const [x, y, z] = randomOnSphere(settings.orbRadius);
      const i3 = i * 3;
      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;

      // Pre-computar distancia y normal (evita sqrt en el loop)
      const dist = Math.sqrt(x * x + y * y + z * z) || 0.001;
      dists[i] = dist;
      norms[i3] = x / dist;
      norms[i3 + 1] = y / dist;
      norms[i3 + 2] = z / dist;
    }

    return {
      basePositions: positions,
      normals: norms,
      distances: dists,
    };
  }, [settings.orbRadius]);

  // Glitch offsets como ref mutable (se modifica en useFrame)
  const glitchOffsetsRef = useRef(new Float32Array(PARTICLE_COUNT * 3));

  // Tabla de ruido pre-computada para glitches
  const noiseTable = useMemo(() => buildNoiseTable(4096), []);
  const noiseIndexRef = useRef(0);

  // Targets para la cara (talking)
  const faceTargets = useMemo(
    () => computeFaceTargets(PARTICLE_COUNT, settings),
    [settings]
  );

  // Constantes de face formation pre-computadas
  const faceConstants = useMemo(() => {
    const eyeCount = Math.floor(PARTICLE_COUNT * settings.faceFormation.eyeParticleRatio);
    return {
      eyeCount,
      mouthStart: eyeCount * 2,
      mouthEnd: eyeCount * 2 + Math.floor(PARTICLE_COUNT * settings.faceFormation.mouthParticleRatio),
      eyeCenterY: settings.faceFormation.eyeHeight,
    };
  }, [settings]);

  // Color actual interpolado
  const colorRef = useRef(new THREE.Color(PARTICLE_COLORS.idle.primary));
  const targetColorRef = useRef(new THREE.Color(PARTICLE_COLORS.idle.primary));

  // Detectar cambio de estado
  useEffect(() => {
    const st = stateRef.current;
    if (robotState !== st.currentState) {
      st.prevState = st.currentState;
      st.currentState = robotState;
      st.transitionProgress = 0;

      if (robotState === "greeting") {
        st.greetingTimer = 0;
        st.greetingPhase = 1;
      }

      const colors = PARTICLE_COLORS[robotState] || PARTICLE_COLORS.idle;
      targetColorRef.current.set(colors.primary);
    }
  }, [robotState]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;

    const positions = pointsRef.current.geometry.attributes.position.array;
    const glitchOffsets = glitchOffsetsRef.current;
    const t = state.clock.elapsedTime;
    const st = stateRef.current;

    // Avanzar transición
    if (st.transitionProgress < 1) {
      st.transitionProgress = Math.min(
        1,
        st.transitionProgress + settings.transitionSpeed
      );
    }

    // Greeting timer
    if (st.greetingPhase > 0) {
      st.greetingTimer += delta;
      if (st.greetingTimer > settings.greetingDuration) {
        st.greetingPhase = 0;
      }
    }

    // Interpolar color
    colorRef.current.lerp(targetColorRef.current, 0.05);
    pointsRef.current.material.color.copy(colorRef.current);

    // Escala según estado
    let stateScale = 1;
    if (st.currentState === "listening") {
      stateScale = settings.listeningScale;
    }

    // Greeting: expansión y contracción
    let greetingMultiplier = 1;
    if (st.greetingPhase > 0) {
      const progress = st.greetingTimer / settings.greetingDuration;
      greetingMultiplier =
        1 +
        (settings.greetingExpansion - 1) *
          Math.sin(progress * Math.PI) *
          (1 - progress * 0.5);
    }

    const totalScale = stateScale * greetingMultiplier;
    const isThinking = st.currentState === "thinking";
    const isTalking = st.currentState === "talking" || isSpeaking;
    const isTransitioning = st.transitionProgress < 1;

    // Pre-computar constantes de talking fuera del loop
    let talkLerp = 0;
    let blinkAmount = 1;
    if (isTalking) {
      talkLerp = st.transitionProgress;
      const blinkCycle = Math.floor(t * 0.4) % 6;
      blinkAmount =
        blinkCycle === 0
          ? Math.max(0.2, 1 - Math.abs(Math.sin(t * 12)) * 1.5)
          : 1;
    }

    // Pre-computar sin/cos comunes para thinking
    let thinkSin3 = 0;
    if (isThinking) {
      thinkSin3 = t * 3;
    }

    // Noise index para glitches
    let ni = noiseIndexRef.current;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;

      // Usar normales y distancias pre-computadas (sin sqrt)
      const breathOffset =
        Math.sin(t * settings.breathSpeed + distances[i] * 3) *
        settings.breathIntensity;

      let tx = basePositions[i3] + normals[i3] * breathOffset;
      let ty = basePositions[i3 + 1] + normals[i3 + 1] * breathOffset;
      let tz = basePositions[i3 + 2] + normals[i3 + 2] * breathOffset;

      // Aplicar escala
      tx *= totalScale;
      ty *= totalScale;
      tz *= totalScale;

      // Estado: thinking — órbita caótica
      if (isThinking) {
        const angle = t * settings.thinkingRotationSpeed + i * 0.01;
        const chaos = Math.sin(thinkSin3 + i * 0.5) * settings.thinkingChaos;
        tx += Math.cos(angle) * chaos;
        ty += Math.sin(angle * 1.3) * chaos;
        tz += Math.sin(angle * 0.7) * chaos;
      }

      // Estado: talking — formación de ojos y boca
      if (isTalking) {
        const faceX = faceTargets[i3];
        let faceY = faceTargets[i3 + 1];
        const faceZ = faceTargets[i3 + 2];

        // Animación de boca
        if (i >= faceConstants.mouthStart && i < faceConstants.mouthEnd) {
          faceY +=
            Math.sin(t * 14 + i * 0.5) * 0.07 +
            Math.sin(t * 22) * 0.04;
        }

        // Animación de ojos (parpadeo)
        if (i < faceConstants.mouthStart) {
          faceY = faceConstants.eyeCenterY + (faceY - faceConstants.eyeCenterY) * blinkAmount;
        }

        tx = tx + (faceX - tx) * talkLerp;
        ty = ty + (faceY - ty) * talkLerp;
        tz = tz + (faceZ - tz) * talkLerp;
      }

      // Micro-glitches durante transiciones (usando noise table)
      if (isTransitioning) {
        if (noiseTable[(ni++) & 4095] > 0.96) {
          glitchOffsets[i3] = noiseTable[(ni++) & 4095] * settings.glitchIntensity;
          glitchOffsets[i3 + 1] = noiseTable[(ni++) & 4095] * settings.glitchIntensity;
          glitchOffsets[i3 + 2] = noiseTable[(ni++) & 4095] * settings.glitchIntensity;
        } else {
          glitchOffsets[i3] *= 0.9;
          glitchOffsets[i3 + 1] *= 0.9;
          glitchOffsets[i3 + 2] *= 0.9;
        }
        tx += glitchOffsets[i3];
        ty += glitchOffsets[i3 + 1];
        tz += glitchOffsets[i3 + 2];
      }

      // Suavizar hacia posición target
      positions[i3] += (tx - positions[i3]) * 0.08;
      positions[i3 + 1] += (ty - positions[i3 + 1]) * 0.08;
      positions[i3 + 2] += (tz - positions[i3 + 2]) * 0.08;
    }

    noiseIndexRef.current = ni & 4095;

    pointsRef.current.geometry.attributes.position.needsUpdate = true;

    // Sincronizar glow layer con posiciones actuales
    if (glowRef.current) {
      const glowPositions = glowRef.current.geometry.attributes.position.array;
      for (let i = 0; i < positions.length; i++) {
        glowPositions[i] = positions[i];
      }
      glowRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // Head tracking — rotar todo el grupo
    if (groupRef.current) {
      const smoothing = settings.trackingSmoothing;

      if (faceDetected && facePosition) {
        const targetY = facePosition.x * 0.5;
        const targetX = facePosition.y * 0.3;
        groupRef.current.rotation.y +=
          (targetY - groupRef.current.rotation.y) * smoothing;
        groupRef.current.rotation.x +=
          (targetX - groupRef.current.rotation.x) * smoothing;
      } else {
        const idleY = Math.sin(t * settings.idleRotationSpeed) * 0.2;
        const idleX = Math.sin(t * 0.1) * 0.05;
        groupRef.current.rotation.y +=
          (idleY - groupRef.current.rotation.y) * smoothing;
        groupRef.current.rotation.x +=
          (idleX - groupRef.current.rotation.x) * smoothing;
      }

      groupRef.current.position.y = Math.sin(t * 0.5) * 0.1;
    }
  });

  // Posiciones iniciales para ambos geometries
  const initialPositions = useMemo(() => {
    return new Float32Array(basePositions);
  }, [basePositions]);

  const glowInitialPositions = useMemo(() => {
    return new Float32Array(basePositions);
  }, [basePositions]);

  return (
    <group ref={groupRef} position={[0, 0.5, 0]}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={PARTICLE_COUNT}
            array={initialPositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={settings.size}
          color={PARTICLE_COLORS.idle.primary}
          transparent
          opacity={0.7}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Glow interior — ahora sincronizado con las posiciones */}
      <points ref={glowRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={PARTICLE_COUNT}
            array={glowInitialPositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={settings.size * 3}
          color={PARTICLE_COLORS.idle.glow}
          transparent
          opacity={0.15}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

export default ParticleOrb;
