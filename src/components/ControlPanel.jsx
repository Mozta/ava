function ControlPanel({
  robotState,
  onStateChange,
  onToggleConversation,
  onGreeting,
  isInCall = false,
  isSpeaking = false,
  userName = "",
  onToggleUserName,
  cameraActive = false,
  onToggleCamera,
}) {
  const handleGreeting = () => {
    if (onGreeting) {
      onGreeting();
    } else {
      onStateChange("greeting");
    }
  };

  const handleToggleCall = () => {
    if (onToggleConversation) {
      onToggleConversation();
    }
  };

  const buttons = [
    {
      id: "idle",
      label: "IDLE",
      color: "cyan",
      icon: null,
      onClick: () => onStateChange("idle"),
      disabled: isInCall,
    },
    {
      id: "camera",
      label: cameraActive ? "CÁMARA ON" : "CÁMARA OFF",
      color: cameraActive ? "green" : "purple",
      icon: null,
      onClick: onToggleCamera,
      disabled: false,
      active: cameraActive,
    },
    {
      id: "greeting",
      label: "SALUDO",
      color: "green",
      icon: null,
      onClick: handleGreeting,
      disabled: isSpeaking || isInCall,
    },
    {
      id: "listening",
      label: isInCall ? "DETENER" : "MODO LIVE",
      color: isInCall ? "red" : "yellow",
      icon: null,
      onClick: handleToggleCall,
      disabled: false,
      active: isInCall,
    },
  ];

  const colorClasses = {
    cyan: "border-cyan-500 text-cyan-400 hover:bg-cyan-500/20",
    green: "border-green-500 text-green-400 hover:bg-green-500/20",
    yellow: "border-yellow-500 text-yellow-400 hover:bg-yellow-500/20",
    red: "border-red-500 text-red-400 hover:bg-red-500/20",
    purple: "border-purple-500 text-purple-400 hover:bg-purple-500/20",
    blue: "border-blue-500 text-blue-400 hover:bg-blue-500/20",
  };

  // Clases estáticas para fondo activo (Tailwind JIT no soporta interpolación)
  const activeColorClasses = {
    cyan: "bg-cyan-500/30",
    green: "bg-green-500/30",
    yellow: "bg-yellow-500/30",
    red: "bg-red-500/30",
    purple: "bg-purple-500/30",
    blue: "bg-blue-500/30",
  };

  return (
    <div className="absolute left-4 top-1/2 -translate-y-1/2 z-20">
      <div
        className="bg-slate-900/90 backdrop-blur-sm border-2 border-cyan-500/50 rounded-lg p-3 w-[220px]"
        style={{ boxShadow: "0 0 30px rgba(34, 211, 238, 0.3)" }}
      >
        {/* Header */}
        <div className="text-center mb-3 border-b border-cyan-500/50 pb-2">
          <button
            onClick={onToggleUserName}
            className="text-cyan-400 font-bold text-xs tracking-wider w-full text-center hover:text-cyan-300 transition-colors cursor-pointer"
            title={
              userName ? "Usuario activado" : "Click para activar usuario"
            }
          >
            CONTROL
          </button>
        </div>

        {/* Buttons - vertical */}
        <div className="flex flex-col gap-2">
          {buttons.map((button) => {
            const isActive =
              button.active !== undefined
                ? button.active
                : robotState === button.id;
            const isDisabled = button.disabled || false;

            return (
              <button
                key={button.id}
                onClick={button.onClick}
                disabled={isDisabled}
                aria-label={button.label}
                aria-pressed={isActive}
                className={`
                  relative group px-3 py-2.5 border-2 rounded-lg font-mono text-xs font-bold
                  transition-all duration-300 w-full focus:outline-none focus:ring-2 focus:ring-cyan-400/60
                  ${colorClasses[button.color]}
                  ${
                    isActive
                      ? `${activeColorClasses[button.color]} shadow-lg`
                      : "bg-slate-800/50"
                  }
                  ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}
                `}
                style={
                  isActive && !isDisabled
                    ? {
                        boxShadow: `0 0 20px rgba(34, 211, 238, 0.6), inset 0 0 20px rgba(34, 211, 238, 0.2)`,
                      }
                    : {}
                }
              >
                {/* Active indicator */}
                {isActive && !isDisabled && (
                  <div
                    className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-cyan-400 rounded-full animate-pulse"
                    style={{ boxShadow: "0 0 10px rgba(34, 211, 238, 0.8)" }}
                  ></div>
                )}

                {/* Label */}
                <span className="tracking-wider text-[10px] text-center w-full">{button.label}</span>

                {/* Corner accents */}
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l opacity-50 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute top-0 right-0 w-2 h-2 border-t border-r opacity-50 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l opacity-50 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r opacity-50 group-hover:opacity-100 transition-opacity"></div>
              </button>
            );
          })}
        </div>

        {/* Status bar */}
        <div className="mt-2 pt-2 border-t border-cyan-500/50">
          <div className="text-[10px] font-mono text-cyan-300 text-center">
            <span className="text-cyan-400 font-bold uppercase">
              {robotState}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ControlPanel;
