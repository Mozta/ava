import { useState, useEffect, useCallback } from "react";
import "./App.css";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import ParticleOrb from "./components/ParticleOrb";
import { useRobotState } from "./hooks/useRobotState";
import { useMediaPipe } from "./hooks/useMediaPipe";
import { useVoice } from "./hooks/useVoice";
import { useElevenLabsConversation } from "./hooks/useElevenLabsConversation";
import InitScreen from "./components/InitScreen";
import LoadingSequence from "./components/LoadingSequence";
import SystemStats from "./components/SystemStats";
import CameraPreview from "./components/CameraPreview";
import ControlPanel from "./components/ControlPanel";
import { PREDEFINED_MESSAGES } from "./utils/elevenLabsClient";

function App() {
  const { robotState, changeState } = useRobotState();
  const [appState, setAppState] = useState("init"); // 'init', 'loading', 'ready'
  const [cameraActive, setCameraActive] = useState(false);
  const [videoElement, setVideoElement] = useState(null);
  const [hasGreeted, setHasGreeted] = useState(false);
  const [userName, setUserName] = useState("");

  // Hook de MediaPipe para detección facial
  const { faceDetected, facePosition, isInitialized, error } = useMediaPipe(
    videoElement,
    cameraActive
  );

  // Hook del agente conversacional de ElevenLabs
  const {
    isConnected: agentConnected,
    isAgentSpeaking,
    conversationId,
    mode,
    error: agentError,
    startConversation,
    endConversation,
  } = useElevenLabsConversation();

  // Hook de voz para Text-to-Speech
  const {
    speak,
    isSpeaking,
  } = useVoice();

  // Saludo automático cuando se detecta un rostro por primera vez
  // Saludo automático cuando se detecta un rostro por primera vez
  useEffect(() => {
    if (!faceDetected) {
      const resetTimer = setTimeout(() => {
        setHasGreeted(false);
      }, 5000);
      return () => clearTimeout(resetTimer);
    }
  }, [faceDetected]);

  // Ejecutar saludo cuando se detecta rostro por primera vez
  const greetingTriggered = faceDetected && robotState === "idle" && !hasGreeted && !isSpeaking;

  useEffect(() => {
    if (!greetingTriggered) return;

    let cancelled = false;
    // Use microtask to avoid synchronous setState warning in effect
    queueMicrotask(() => {
      if (cancelled) return;
      setHasGreeted(true);
      changeState("greeting");
    });

    const greetingMessage = userName
      ? `¡Hola ${userName}! Es un placer verte de nuevo.`
      : PREDEFINED_MESSAGES.greeting_detected;

    speak(greetingMessage)
      .then(() => { if (!cancelled) changeState("idle"); })
      .catch(() => { if (!cancelled) changeState("idle"); });

    return () => { cancelled = true; };
  }, [greetingTriggered]); // eslint-disable-line react-hooks/exhaustive-deps

  // Sincronizar estado del robot — prioridad: greeting > talking > listening > idle
  useEffect(() => {
    // No interrumpir greeting
    if (robotState === "greeting") return;

    if (isSpeaking || isAgentSpeaking) {
      changeState("talking");
    } else if (agentConnected) {
      changeState("listening");
    } else if (robotState === "talking" || robotState === "listening") {
      changeState("idle");
    }
  }, [isSpeaking, isAgentSpeaking, agentConnected, robotState, changeState]);

  const handleInitialize = () => {
    setAppState("loading");
  };

  const handleLoadingComplete = () => {
    setAppState("ready");
  };

  const toggleCamera = () => {
    setCameraActive(!cameraActive);
  };

  const handleVideoReady = useCallback((video) => {
    setVideoElement(video);
  }, []);

  // Toggle nombre de usuario
  const toggleUserName = () => {
    if (userName === "") {
      setUserName("Dr. Alejandro Guevara Sanginés");
      console.log("👤 Usuario activado: Dr. Alejandro Guevara Sanginés");
    } else {
      setUserName("");
      console.log("👤 Usuario desactivado");
    }
  };

  // Manejar toggle de conversación (iniciar/colgar)
  const handleToggleConversation = async () => {
    console.log("🔘 Botón ESCUCHAR presionado");
    console.log("📊 Estado actual - agentConnected:", agentConnected);

    try {
      if (agentConnected) {
        // Colgar la conversación
        console.log("📴 Colgando conversación...");
        endConversation();
      } else {
        // Iniciar conversación
        console.log("📞 Iniciando conversación...");
        await startConversation();
        console.log("✅ startConversation completado");
      }
    } catch (err) {
      console.error("❌ Error en conversación:", err);
      changeState("idle");
    }
  };

  // Render init screen
  if (appState === "init") {
    return (
      <div className="min-h-screen bg-slate-950">
        <InitScreen onInitialize={handleInitialize} />
      </div>
    );
  }

  // Render loading sequence
  if (appState === "loading") {
    return (
      <div className="min-h-screen bg-slate-950">
        <LoadingSequence onComplete={handleLoadingComplete} />
      </div>
    );
  }

  // Main application
  return (
    <div className="relative min-h-screen bg-slate-950 overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(cyan 1px, transparent 1px), linear-gradient(90deg, cyan 1px, transparent 1px)",
            backgroundSize: "50px 50px",
            animation: "gridMove 20s linear infinite",
          }}
        ></div>
      </div>

      {/* Scanlines effect */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, cyan 2px, cyan 4px)",
          }}
        ></div>
      </div>

      {/* System Stats - Top Right */}
      <SystemStats
        robotState={robotState}
        cameraActive={cameraActive}
        faceDetected={faceDetected}
        isSpeaking={isSpeaking}
      />

      {/* Camera Preview - Bottom Right */}
      <CameraPreview
        isActive={cameraActive}
        onToggle={toggleCamera}
        onVideoReady={handleVideoReady}
        faceDetected={faceDetected}
      />

      {/* Control Panel - Bottom Center */}
      <ControlPanel
        robotState={robotState}
        onStateChange={changeState}
        onToggleConversation={handleToggleConversation}
        onGreeting={async () => {
          changeState("greeting");
          try {
            const greetingMessage = userName
              ? `¡Hola ${userName}! Es un placer verte de nuevo.`
              : PREDEFINED_MESSAGES.greeting_detected;
            await speak(greetingMessage);
          } catch (err) {
            console.error("Error en saludo:", err);
          }
          changeState("idle");
        }}
        isInCall={agentConnected}
        isSpeaking={isSpeaking || isAgentSpeaking}
        userName={userName}
        onToggleUserName={toggleUserName}
        cameraActive={cameraActive}
        onToggleCamera={toggleCamera}
      />

      {/* System Status Panel - Top Left */}
      <div className="absolute top-4 left-4 z-20">
        <div
          className="bg-slate-900/90 backdrop-blur-sm border-2 border-cyan-500/50 rounded-lg p-4 w-[220px]"
          style={{ boxShadow: "0 0 20px rgba(34, 211, 238, 0.3)" }}
        >
          {/* Header */}
          <div className="text-center mb-3 pb-2 border-b border-cyan-500/50">
            <div className="text-cyan-400 font-bold text-xs tracking-wider">
              SYSTEM STATUS
            </div>
          </div>

          <div className="text-xs font-mono text-cyan-300 space-y-2">
            {/* Conversation Status */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div
                  className={`w-2 h-2 rounded-full ${
                    agentConnected ? "bg-green-400 animate-pulse" : "bg-red-400"
                  }`}
                ></div>
                <span className="font-semibold">
                  Conversación: {agentConnected ? "ACTIVA" : "INACTIVA"}
                </span>
              </div>
              {conversationId && (
                <div className="text-xs text-cyan-400/70 ml-4">
                  ID: {conversationId.slice(0, 12)}...
                </div>
              )}
              {agentConnected && (
                <div className="text-xs text-green-400 ml-4">
                  🎤 Micrófono activo
                </div>
              )}
              {isAgentSpeaking && (
                <div className="text-xs text-blue-400 animate-pulse ml-4">
                  🔊 Agente hablando...
                </div>
              )}
              {mode && mode !== "idle" && (
                <div className="text-xs text-yellow-400 ml-4">
                  Modo: {mode === "listening" ? "Escuchando" : "Hablando"}
                </div>
              )}
            </div>

            {/* MediaPipe Status */}
            {cameraActive && (
              <div className="pt-2 border-t border-cyan-500/30">
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      isInitialized
                        ? "bg-green-400 animate-pulse"
                        : "bg-yellow-400 animate-pulse"
                    }`}
                  ></div>
                  <span className="font-semibold">
                    MediaPipe: {isInitialized ? "READY" : "LOADING..."}
                  </span>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      faceDetected ? "bg-green-400 animate-pulse" : "bg-red-400"
                    }`}
                  ></div>
                  <span>
                    Rostro: {faceDetected ? "DETECTADO" : "BUSCANDO..."}
                  </span>
                </div>
              </div>
            )}

            {/* Error Display */}
            {(error || agentError) && (
              <div className="text-xs font-mono text-red-400 mt-2 pt-2 border-t border-red-500/30">
                ⚠️ {error || agentError}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Canvas 3D */}
      <div className="w-full h-screen">
        <Canvas
          shadows
          camera={{ position: [0, 1, 5], fov: 50 }}
          gl={{ antialias: true, stencil: false, depth: true }}
          dpr={[1, 2]}
        >
          {/* Iluminación */}
          <ambientLight intensity={0.4} />
          <directionalLight
            position={[5, 5, 5]}
            intensity={1.2}
            castShadow
            shadow-mapSize={[512, 512]}
          />
          <pointLight position={[-5, 5, -5]} intensity={0.8} color="#22d3ee" />

          {/* Orbe de partículas */}
          <ParticleOrb
            robotState={robotState}
            facePosition={facePosition}
            faceDetected={faceDetected}
            isSpeaking={isSpeaking || isAgentSpeaking}
          />

          {/* Suelo con efecto cyberpunk */}
          <mesh
            receiveShadow
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, -1, 0]}
          >
            <planeGeometry args={[10, 10]} />
            <meshStandardMaterial
              color="#0a0e1a"
              metalness={0.8}
              roughness={0.4}
            />
          </mesh>

          {/* Grid lines on floor */}
          <gridHelper
            args={[10, 20, "#22d3ee", "#0e7490"]}
            position={[0, -0.99, 0]}
          />

          {/* Controles de órbita */}
          <OrbitControls
            enableZoom={true}
            enablePan={false}
            minDistance={3}
            maxDistance={8}
            maxPolarAngle={Math.PI / 2}
          />

          {/* Entorno para reflejos */}
          <Environment preset="night" intensity={0.3} />
        </Canvas>
      </div>
    </div>
  );
}

export default App;
