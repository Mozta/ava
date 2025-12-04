import { useState, useEffect } from "react";
import "./App.css";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import Robot3D from "./components/Robot3D";
import { useRobotState } from "./hooks/useRobotState";
import { useMediaPipe } from "./hooks/useMediaPipe";
import { useVoice } from "./hooks/useVoice";
import InitScreen from "./components/InitScreen";
import LoadingSequence from "./components/LoadingSequence";
import SystemStats from "./components/SystemStats";
import CameraPreview from "./components/CameraPreview";
import ControlPanel from "./components/ControlPanel";
import VoiceInterface from "./components/VoiceInterface";
import { PREDEFINED_MESSAGES } from "./utils/elevenLabsClient";

function App() {
  const { robotState, changeState } = useRobotState();
  const [appState, setAppState] = useState("init"); // 'init', 'loading', 'ready'
  const [cameraActive, setCameraActive] = useState(false);
  const [videoElement, setVideoElement] = useState(null);
  const [hasGreeted, setHasGreeted] = useState(false);

  // Hook de MediaPipe para detección facial
  const { faceDetected, facePosition, isInitialized, error } = useMediaPipe(
    videoElement,
    cameraActive
  );

  // Hook de voz para Text-to-Speech
  const {
    speak,
    stopSpeaking,
    isSpeaking,
    isGenerating,
    error: voiceError,
  } = useVoice();

  // Saludo automático cuando se detecta un rostro por primera vez
  useEffect(() => {
    if (faceDetected && robotState === "idle" && !hasGreeted && !isSpeaking) {
      console.log("¡Rostro detectado! Robot saludando...");
      setHasGreeted(true);

      changeState("greeting");

      // Hablar el saludo
      speak(PREDEFINED_MESSAGES.greeting_detected)
        .then(() => {
          changeState("idle");
        })
        .catch((err) => {
          console.error("Error en saludo:", err);
          changeState("idle");
        });
    }

    // Reset hasGreeted cuando no se detecta rostro por un tiempo
    if (!faceDetected) {
      const resetTimer = setTimeout(() => {
        setHasGreeted(false);
      }, 5000);
      return () => clearTimeout(resetTimer);
    }
  }, [faceDetected, robotState, hasGreeted, isSpeaking, speak, changeState]);

  // Sincronizar estado del robot con el estado de voz
  useEffect(() => {
    if (isSpeaking && robotState !== "greeting") {
      changeState("talking");
    } else if (!isSpeaking && robotState === "talking") {
      changeState("idle");
    }
  }, [isSpeaking, robotState, changeState]);

  const handleInitialize = () => {
    setAppState("loading");
  };

  const handleLoadingComplete = () => {
    setAppState("ready");
  };

  const toggleCamera = () => {
    setCameraActive(!cameraActive);
  };

  const handleVideoReady = (video) => {
    setVideoElement(video);
  };

  const handleSpeak = async (text, voiceId) => {
    try {
      changeState("thinking");
      await speak(text, voiceId);
    } catch (err) {
      console.error("Error hablando:", err);
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
      <ControlPanel robotState={robotState} onStateChange={changeState} />

      {/* Voice Interface - Bottom Left */}
      <VoiceInterface
        onSpeak={handleSpeak}
        isSpeaking={isSpeaking}
        isGenerating={isGenerating}
        error={voiceError}
      />

      {/* MediaPipe Status Indicator */}
      {cameraActive && (
        <div className="absolute top-4 left-4 z-20">
          <div
            className="bg-slate-900/90 backdrop-blur-sm border-2 border-cyan-500/50 rounded-lg p-3"
            style={{ boxShadow: "0 0 20px rgba(34, 211, 238, 0.3)" }}
          >
            <div className="text-xs font-mono text-cyan-300 mb-2">
              <div className="flex items-center gap-2 mb-1">
                <div
                  className={`w-2 h-2 rounded-full ${
                    isInitialized
                      ? "bg-green-400 animate-pulse"
                      : "bg-yellow-400 animate-pulse"
                  }`}
                ></div>
                <span>MediaPipe: {isInitialized ? "READY" : "LOADING..."}</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    faceDetected ? "bg-green-400 animate-pulse" : "bg-red-400"
                  }`}
                ></div>
                <span>Face: {faceDetected ? "DETECTED" : "SEARCHING..."}</span>
              </div>
            </div>
            {error && (
              <div className="text-xs font-mono text-red-400 mt-2">
                Error: {error}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Canvas 3D */}
      <div className="w-full h-screen">
        <Canvas shadows camera={{ position: [0, 1, 5], fov: 50 }}>
          {/* Iluminación */}
          <ambientLight intensity={0.4} />
          <directionalLight
            position={[5, 5, 5]}
            intensity={1.2}
            castShadow
            shadow-mapSize={[1024, 1024]}
          />
          <pointLight position={[-5, 5, -5]} intensity={0.8} color="#22d3ee" />
          <pointLight position={[5, 2, 5]} intensity={0.5} color="#06b6d4" />

          {/* Robot 3D */}
          <Robot3D
            robotState={robotState}
            facePosition={facePosition}
            faceDetected={faceDetected}
            isSpeaking={isSpeaking}
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
          <Environment preset="city" />
        </Canvas>
      </div>
    </div>
  );
}

export default App;
