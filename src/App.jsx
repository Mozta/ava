import { useState } from "react";
import "./App.css";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import Robot3D from "./components/Robot3D";
import { useRobotState } from "./hooks/useRobotState";
import InitScreen from "./components/InitScreen";
import LoadingSequence from "./components/LoadingSequence";
import SystemStats from "./components/SystemStats";
import CameraPreview from "./components/CameraPreview";
import ControlPanel from "./components/ControlPanel";

function App() {
  const { robotState, changeState } = useRobotState();
  const [appState, setAppState] = useState('init'); // 'init', 'loading', 'ready'
  const [cameraActive, setCameraActive] = useState(false);

  const handleInitialize = () => {
    setAppState('loading');
  };

  const handleLoadingComplete = () => {
    setAppState('ready');
  };

  const toggleCamera = () => {
    setCameraActive(!cameraActive);
  };

  // Render init screen
  if (appState === 'init') {
    return (
      <div className="min-h-screen bg-slate-950">
        <InitScreen onInitialize={handleInitialize} />
      </div>
    );
  }

  // Render loading sequence
  if (appState === 'loading') {
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
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(cyan 1px, transparent 1px), linear-gradient(90deg, cyan 1px, transparent 1px)',
          backgroundSize: '50px 50px',
          animation: 'gridMove 20s linear infinite'
        }}></div>
      </div>

      {/* Scanlines effect */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, cyan 2px, cyan 4px)'
        }}></div>
      </div>

      {/* System Stats - Top Right */}
      <SystemStats robotState={robotState} cameraActive={cameraActive} />

      {/* Camera Preview - Bottom Right */}
      <CameraPreview isActive={cameraActive} onToggle={toggleCamera} />

      {/* Control Panel - Bottom Center */}
      <ControlPanel robotState={robotState} onStateChange={changeState} />

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
          <Robot3D robotState={robotState} />

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
          <gridHelper args={[10, 20, '#22d3ee', '#0e7490']} position={[0, -0.99, 0]} />

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
