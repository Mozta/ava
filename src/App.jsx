import "./App.css";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import Robot3D from "./components/Robot3D";
import { useRobotState } from "./hooks/useRobotState";

function App() {
  const { robotState, changeState } = useRobotState();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-6 z-10">
        <h1 className="text-4xl font-bold text-center text-cyan-400 drop-shadow-lg">
          AVA - Asistente Virtual Inteligente
        </h1>
        <p className="text-center text-gray-300 mt-2">
          Estado:{" "}
          <span className="text-cyan-300 font-semibold">{robotState}</span>
        </p>
      </div>

      {/* Canvas 3D */}
      <div className="w-full h-screen">
        <Canvas shadows camera={{ position: [0, 1, 5], fov: 50 }}>
          {/* Iluminación */}
          <ambientLight intensity={0.5} />
          <directionalLight
            position={[5, 5, 5]}
            intensity={1}
            castShadow
            shadow-mapSize={[1024, 1024]}
          />
          <pointLight position={[-5, 5, -5]} intensity={0.5} color="#60a5fa" />

          {/* Robot 3D */}
          <Robot3D robotState={robotState} />

          {/* Suelo con sombras */}
          <mesh
            receiveShadow
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, -1, 0]}
          >
            <planeGeometry args={[10, 10]} />
            <meshStandardMaterial
              color="#1e293b"
              metalness={0.3}
              roughness={0.7}
            />
          </mesh>

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

      {/* Panel de control */}
      <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
        <div className="max-w-2xl mx-auto bg-slate-800/80 backdrop-blur-sm rounded-lg p-4 shadow-xl">
          <div className="flex gap-3 justify-center flex-wrap">
            <button
              onClick={() => changeState("idle")}
              className="px-6 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-semibold transition-colors"
            >
              Idle
            </button>
            <button
              onClick={() => changeState("greeting")}
              className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-colors"
            >
              Saludar
            </button>
            <button
              onClick={() => changeState("listening")}
              className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-semibold transition-colors"
            >
              Escuchando
            </button>
            <button
              onClick={() => changeState("thinking")}
              className="px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-semibold transition-colors"
            >
              Pensando
            </button>
            <button
              onClick={() => changeState("talking")}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors"
            >
              Hablando
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
