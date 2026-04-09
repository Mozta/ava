// Configuración de colores y comportamiento del orbe de partículas
// Modifica este archivo para personalizar la apariencia del orbe

export const PARTICLE_COLORS = {
  idle: {
    primary: "#22d3ee", // cyan
    glow: "#06b6d4",
  },
  listening: {
    primary: "#3b82f6", // azul
    glow: "#2563eb",
  },
  thinking: {
    primary: "#a855f7", // violeta
    glow: "#7c3aed",
  },
  talking: {
    primary: "#ffffff", // blanco
    glow: "#e0f2fe",
  },
  greeting: {
    primary: "#67e8f9", // cyan brillante
    glow: "#22d3ee",
  },
};

export const PARTICLE_COUNT = 1800;

export const PARTICLE_SETTINGS = {
  // Tamaño base de cada partícula
  size: 0.025,

  // Radio del orbe en estado idle
  orbRadius: 1.2,

  // Intensidad de la "respiración" (oscilación idle)
  breathIntensity: 0.08,
  breathSpeed: 0.6,

  // Velocidad de rotación idle
  idleRotationSpeed: 0.15,

  // Transiciones entre estados
  transitionSpeed: 0.03, // qué tan rápido migran las partículas (0-1)
  glitchProbability: 0.02, // probabilidad de glitch por partícula por frame
  glitchIntensity: 0.4, // desplazamiento máximo del glitch

  // Head tracking
  trackingSmoothing: 0.08, // suavizado del seguimiento facial

  // Estado: listening (compresión)
  listeningScale: 0.75,

  // Estado: thinking (giro caótico)
  thinkingRotationSpeed: 1.5,
  thinkingChaos: 0.15,

  // Estado: talking (formación de cara)
  faceFormation: {
    eyeRadius: 0.22, // radio del disco de cada ojo
    eyeSeparation: 0.5, // distancia horizontal entre ojos
    eyeHeight: 0.25, // altura de los ojos respecto al centro
    mouthWidth: 0.85, // ancho del arco de la boca
    mouthHeight: -0.35, // altura de la boca respecto al centro
    mouthCurve: 0.10, // curvatura del arco de la boca
    mouthParticleRatio: 0.14, // 14% de partículas forman la boca
    eyeParticleRatio: 0.08, // 8% de partículas forman cada ojo (16% total)
  },

  // Estado: greeting (onda expansiva)
  greetingExpansion: 2.2, // multiplicador del radio
  greetingDuration: 1.5, // segundos de la expansión
};
