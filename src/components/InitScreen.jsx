function InitScreen({ onInitialize }) {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-10">
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

      {/* Glowing circle background */}
      <div className="absolute inset-0 flex items-center justify-center opacity-30">
        <div className="w-96 h-96 rounded-full bg-cyan-500/20 blur-3xl animate-pulse"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center">
        {/* Title with glitch effect */}
        <div className="mb-12">
          <div className="relative">
            <h1
              className="text-8xl font-bold text-cyan-400 tracking-wider mb-4"
              style={{
                textShadow:
                  "0 0 10px rgba(34, 211, 238, 0.8), 0 0 20px rgba(34, 211, 238, 0.6), 0 0 40px rgba(34, 211, 238, 0.4), 0 0 80px rgba(34, 211, 238, 0.2)",
              }}
            >
              A.V.A
            </h1>
            {/* Glitch overlay */}
            <div
              className="absolute inset-0 text-8xl font-bold text-cyan-300 opacity-50 animate-pulse"
              style={{ clipPath: "polygon(0 0, 100% 0, 100% 45%, 0 45%)" }}
            >
              A.V.A
            </div>
          </div>

          <div className="text-2xl text-cyan-300 tracking-widest mb-2">
            ASISTENTE VIRTUAL INTELIGENTE
          </div>
          <div className="text-sm text-cyan-500/70 font-mono">
            Powered by Neural Network Technology
          </div>
        </div>

        {/* Decorative lines */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <div className="w-24 h-px bg-linear-to-r from-transparent to-cyan-500"></div>
          <div className="w-3 h-3 border-2 border-cyan-400 rotate-45"></div>
          <div className="w-24 h-px bg-linear-to-l from-transparent to-cyan-500"></div>
        </div>

        {/* Initialize button */}
        <button
          onClick={onInitialize}
          className="group relative px-12 py-4 text-xl font-bold text-cyan-400 border-2 border-cyan-500 rounded-lg overflow-hidden transition-all duration-300 hover:text-slate-900"
          style={{
            boxShadow: "0 0 20px rgba(34, 211, 238, 0.4)",
          }}
        >
          {/* Button background effect */}
          <div className="absolute inset-0 bg-cyan-500 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>

          {/* Button text */}
          <span className="relative z-10 tracking-wider">
            INICIALIZAR SISTEMA
          </span>

          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-300"></div>
          <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-300"></div>
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyan-300"></div>
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-300"></div>
        </button>

        {/* Version info */}
        <div className="mt-12 text-xs text-cyan-500/50 font-mono">
          VERSION 1.0.7 | BUILD 2025.12.03
        </div>
      </div>

      {/* Animated corner accents */}
      <div className="absolute top-8 left-8 w-16 h-16 border-t-2 border-l-2 border-cyan-500/50 animate-pulse"></div>
      <div className="absolute top-8 right-8 w-16 h-16 border-t-2 border-r-2 border-cyan-500/50 animate-pulse"></div>
      <div className="absolute bottom-8 left-8 w-16 h-16 border-b-2 border-l-2 border-cyan-500/50 animate-pulse"></div>
      <div className="absolute bottom-8 right-8 w-16 h-16 border-b-2 border-r-2 border-cyan-500/50 animate-pulse"></div>
    </div>
  );
}

export default InitScreen;
