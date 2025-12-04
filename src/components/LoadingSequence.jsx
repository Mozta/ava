import { useState, useEffect } from "react";

function LoadingSequence({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [displayText, setDisplayText] = useState("");

  const loadingSteps = [
    "INICIALIZANDO SISTEMA AVA...",
    "CARGANDO MÓDULOS CORE...",
    "ESTABLECIENDO ENLACE NEURONAL...",
    "ACTIVANDO SENSORES VISUALES...",
    "SINCRONIZANDO PROTOCOLOS DE VOZ...",
    "CALIBRANDO MATRIZ DE RESPUESTA...",
    "SISTEMA OPERATIVO...",
  ];

  useEffect(() => {
    if (currentStep >= loadingSteps.length) {
      const timer = setTimeout(() => {
        onComplete();
      }, 500);
      return () => clearTimeout(timer);
    }

    const currentMessage = loadingSteps[currentStep];
    let charIndex = 0;

    const typingInterval = setInterval(() => {
      if (charIndex <= currentMessage.length) {
        setDisplayText(currentMessage.slice(0, charIndex));
        charIndex++;
      } else {
        clearInterval(typingInterval);
        setTimeout(() => {
          setCurrentStep((prev) => prev + 1);
        }, 300);
      }
    }, 30);

    return () => clearInterval(typingInterval);
  }, [currentStep, onComplete]);

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden">
      {/* Scanlines effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, cyan 2px, cyan 4px)",
          }}
        ></div>
      </div>

      {/* Animated grid background */}
      <div className="absolute inset-0 opacity-20">
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

      {/* Content */}
      <div className="relative z-10 text-center">
        <div className="mb-8">
          <div
            className="text-6xl font-bold text-cyan-400 mb-4 tracking-wider animate-pulse"
            style={{
              textShadow:
                "0 0 10px rgba(34, 211, 238, 0.8), 0 0 20px rgba(34, 211, 238, 0.6), 0 0 30px rgba(34, 211, 238, 0.4)",
            }}
          >
            A.V.A
          </div>
          <div className="text-xl text-cyan-300 tracking-widest">
            ASISTENTE VIRTUAL INTELIGENTE
          </div>
        </div>

        {/* Loading bar container */}
        <div className="w-96 mx-auto">
          <div className="h-1 bg-slate-800 rounded-full overflow-hidden mb-4 border border-cyan-500/30">
            <div
              className="h-full bg-linear-to-r from-cyan-500 to-cyan-300 transition-all duration-300 relative"
              style={{ width: `${(currentStep / loadingSteps.length) * 100}%` }}
            >
              <div className="absolute inset-0 animate-pulse bg-cyan-400/50"></div>
            </div>
          </div>

          {/* Loading text */}
          <div className="h-8 font-mono text-cyan-300 text-sm flex items-center justify-center">
            {displayText}
            <span className="inline-block w-2 h-4 bg-cyan-400 ml-1 animate-pulse"></span>
          </div>

          {/* Progress indicator */}
          <div className="text-xs text-cyan-500/70 mt-2 font-mono">
            [{currentStep}/{loadingSteps.length}] PROGRESS:{" "}
            {Math.round((currentStep / loadingSteps.length) * 100)}%
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoadingSequence;
