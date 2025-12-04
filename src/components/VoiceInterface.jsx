import { useState } from "react";

function VoiceInterface({ onSpeak, isSpeaking, isGenerating, error }) {
  const [inputText, setInputText] = useState("");
  const [selectedVoice, setSelectedVoice] = useState("pNInz6obpgDQGcFmaJgB");

  const handleSpeak = () => {
    if (inputText.trim() && !isSpeaking && !isGenerating) {
      onSpeak(inputText, selectedVoice);
    }
  };

  const handleQuickMessage = (message) => {
    if (!isSpeaking && !isGenerating) {
      onSpeak(message, selectedVoice);
    }
  };

  const quickMessages = [
    {
      label: "Saludo",
      text: "¡Hola! Soy AVA, tu asistente virtual inteligente.",
    },
    {
      label: "Bienvenida",
      text: "Bienvenido, es un placer verte. ¿En qué puedo ayudarte hoy?",
    },
    { label: "Escuchando", text: "Te escucho, adelante con tu pregunta." },
    { label: "Procesando", text: "Déjame pensar en eso un momento." },
  ];

  return (
    <div className="absolute bottom-24 left-4 z-20 w-96">
      <div
        className="bg-slate-900/90 backdrop-blur-sm border-2 border-cyan-500/50 rounded-lg overflow-hidden"
        style={{ boxShadow: "0 0 20px rgba(34, 211, 238, 0.3)" }}
      >
        {/* Header */}
        <div className="bg-slate-800/80 px-4 py-3 border-b border-cyan-500/50">
          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${
                isSpeaking
                  ? "bg-green-400 animate-pulse"
                  : isGenerating
                  ? "bg-yellow-400 animate-pulse"
                  : "bg-cyan-400"
              }`}
            ></div>
            <span className="text-sm font-mono text-cyan-300 font-bold">
              VOICE INTERFACE
            </span>
            {isSpeaking && (
              <span className="text-xs font-mono text-green-400 ml-auto animate-pulse">
                SPEAKING...
              </span>
            )}
            {isGenerating && (
              <span className="text-xs font-mono text-yellow-400 ml-auto animate-pulse">
                GENERATING...
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Voice selector */}
          <div className="mb-3">
            <label className="text-xs font-mono text-cyan-300 block mb-2">
              VOICE TYPE
            </label>
            <select
              value={selectedVoice}
              onChange={(e) => setSelectedVoice(e.target.value)}
              className="w-full bg-slate-800 border border-cyan-500/50 rounded px-3 py-2 text-sm font-mono text-cyan-300 focus:outline-none focus:border-cyan-400"
              disabled={isSpeaking || isGenerating}
            >
              <option value="pNInz6obpgDQGcFmaJgB">MALE (Adam)</option>
              <option value="EXAVITQu4vr4xnSDxMaL">FEMALE (Bella)</option>
              <option value="yoZ06aMxZJJ28mfd3POQ">YOUNG MALE (Sam)</option>
            </select>
          </div>

          {/* Text input */}
          <div className="mb-3">
            <label className="text-xs font-mono text-cyan-300 block mb-2">
              TEXT MESSAGE
            </label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSpeak();
                }
              }}
              placeholder="Escribe lo que AVA debe decir..."
              className="w-full bg-slate-800 border border-cyan-500/50 rounded px-3 py-2 text-sm font-mono text-cyan-300 focus:outline-none focus:border-cyan-400 resize-none"
              rows="3"
              disabled={isSpeaking || isGenerating}
            />
          </div>

          {/* Speak button */}
          <button
            onClick={handleSpeak}
            disabled={!inputText.trim() || isSpeaking || isGenerating}
            className="w-full py-2 px-4 bg-cyan-500 hover:bg-cyan-600 disabled:bg-slate-700 disabled:text-slate-500 text-white font-mono text-sm font-bold rounded transition-all duration-300 mb-3"
            style={{
              boxShadow:
                !inputText.trim() || isSpeaking || isGenerating
                  ? "none"
                  : "0 0 15px rgba(34, 211, 238, 0.5)",
            }}
          >
            {isGenerating
              ? "GENERANDO..."
              : isSpeaking
              ? "HABLANDO..."
              : "HABLAR"}
          </button>

          {/* Quick messages */}
          <div className="mb-3">
            <label className="text-xs font-mono text-cyan-300 block mb-2">
              QUICK MESSAGES
            </label>
            <div className="grid grid-cols-2 gap-2">
              {quickMessages.map((msg, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickMessage(msg.text)}
                  disabled={isSpeaking || isGenerating}
                  className="py-2 px-3 bg-slate-800 hover:bg-cyan-500/20 border border-cyan-500/50 hover:border-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-cyan-300 font-mono text-xs rounded transition-all duration-200"
                >
                  {msg.label}
                </button>
              ))}
            </div>
          </div>

          {/* Error display */}
          {error && (
            <div className="mt-3 p-2 bg-red-500/20 border border-red-500/50 rounded">
              <div className="text-xs font-mono text-red-400">
                ERROR: {error}
              </div>
            </div>
          )}

          {/* Info */}
          <div className="mt-3 pt-3 border-t border-cyan-500/30">
            <div className="text-[10px] font-mono text-cyan-500/70 text-center">
              Press ENTER to speak • SHIFT+ENTER for new line
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VoiceInterface;
