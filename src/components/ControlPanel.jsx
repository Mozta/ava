function ControlPanel({
  robotState,
  onStateChange,
  onToggleConversation,
  onGreeting,
  isInCall = false,
  isSpeaking = false,
  userName = "",
  onToggleUserName,
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
      icon: "◉",
      onClick: () => onStateChange("idle"),
      disabled: isInCall,
    },
    {
      id: "greeting",
      label: "SALUDO",
      color: "green",
      icon: "👋",
      onClick: handleGreeting,
      disabled: isSpeaking || isInCall,
    },
    {
      id: "listening",
      label: isInCall ? "DETENER" : "ESCUCHAR",
      color: isInCall ? "red" : "yellow",
      icon: isInCall ? "📞" : "🎤",
      onClick: handleToggleCall,
      disabled: false,
      active: isInCall,
    },
    {
      id: "thinking",
      label: "PROCESAR",
      color: "purple",
      icon: "⚡",
      onClick: () => onStateChange("thinking"),
      disabled: true,
    },
    {
      id: "talking",
      label: "HABLAR",
      color: "blue",
      icon: "💬",
      onClick: () => onStateChange("talking"),
      disabled: true,
      active: isSpeaking,
    },
  ];

  const colorClasses = {
    cyan: "border-cyan-500 text-cyan-400 hover:bg-cyan-500/20 hover:shadow-cyan",
    green:
      "border-green-500 text-green-400 hover:bg-green-500/20 hover:shadow-green",
    yellow:
      "border-yellow-500 text-yellow-400 hover:bg-yellow-500/20 hover:shadow-yellow",
    red: "border-red-500 text-red-400 hover:bg-red-500/20 hover:shadow-red",
    purple:
      "border-purple-500 text-purple-400 hover:bg-purple-500/20 hover:shadow-purple",
    blue: "border-blue-500 text-blue-400 hover:bg-blue-500/20 hover:shadow-blue",
  };

  return (
    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20">
      <div
        className="bg-slate-900/90 backdrop-blur-sm border-2 border-cyan-500/50 rounded-lg p-6"
        style={{ boxShadow: "0 0 30px rgba(34, 211, 238, 0.3)" }}
      >
        {/* Header */}
        <div className="text-center mb-4 border-b border-cyan-500/50 pb-3">
          <div className="text-cyan-400 font-bold text-sm tracking-wider flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
            CONTROL
            <button
              onClick={onToggleUserName}
              className="hover:text-cyan-300 transition-colors cursor-pointer"
              title={
                userName ? "Usuario activado" : "Click para activar usuario"
              }
            >
              PANEL
            </button>
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
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
                className={`
                  relative group px-6 py-3 border-2 rounded-lg font-mono text-sm font-bold
                  transition-all duration-300 min-w-[120px]
                  ${colorClasses[button.color]}
                  ${
                    isActive
                      ? `bg-${button.color}-500/30 shadow-lg`
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
                    className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full animate-pulse"
                    style={{ boxShadow: "0 0 10px rgba(34, 211, 238, 0.8)" }}
                  ></div>
                )}

                {/* Icon and label */}
                <div className="flex flex-col items-center gap-1">
                  <span className="text-lg">{button.icon}</span>
                  <span className="tracking-wider">{button.label}</span>
                </div>

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
        <div className="mt-4 pt-3 border-t border-cyan-500/50">
          <div className="text-xs font-mono text-cyan-300 text-center">
            CURRENT MODE:{" "}
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
