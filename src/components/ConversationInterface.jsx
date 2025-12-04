import { useState, forwardRef, useImperativeHandle } from "react";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition";

const ConversationInterface = forwardRef(
  ({ onSendMessage, isSpeaking, isProcessing }, ref) => {
    const {
      isListening,
      transcript,
      interimTranscript,
      error: speechError,
      isSupported,
      startListening,
      stopListening,
      resetTranscript,
    } = useSpeechRecognition();

    const [conversationHistory, setConversationHistory] = useState([]);

    // Exponer métodos para ser llamados desde el padre
    useImperativeHandle(ref, () => ({
      startListening: handleStartListening,
      stopListening: handleStopAndSend,
      isListening,
    }));

    const handleStartListening = () => {
      resetTranscript();
      startListening();
    };

    const handleStopAndSend = async () => {
      stopListening();

      // Esperar un poco para asegurar que el transcript final se procese
      setTimeout(() => {
        if (transcript.trim()) {
          const userMessage = transcript.trim();

          // Agregar mensaje del usuario al historial
          setConversationHistory((prev) => [
            ...prev,
            {
              role: "user",
              content: userMessage,
              timestamp: new Date().toLocaleTimeString(),
            },
          ]);

          // Enviar mensaje al agente
          onSendMessage(userMessage);

          resetTranscript();
        }
      }, 500);
    };

    const handleManualSend = () => {
      if (transcript.trim() && !isListening) {
        const userMessage = transcript.trim();

        setConversationHistory((prev) => [
          ...prev,
          {
            role: "user",
            content: userMessage,
            timestamp: new Date().toLocaleTimeString(),
          },
        ]);

        onSendMessage(userMessage);
        resetTranscript();
      }
    };

    // Agregar respuesta del asistente al historial (se puede llamar desde el padre)
    const addAssistantMessage = (message) => {
      setConversationHistory((prev) => [
        ...prev,
        {
          role: "assistant",
          content: message,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    };

    return (
      <div className="absolute top-24 left-4 z-20 w-[420px]">
        <div
          className="bg-slate-900/90 backdrop-blur-sm border-2 border-cyan-500/50 rounded-lg overflow-hidden"
          style={{ boxShadow: "0 0 20px rgba(34, 211, 238, 0.3)" }}
        >
          {/* Header */}
          <div className="bg-slate-800/80 px-4 py-3 border-b border-cyan-500/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    isListening
                      ? "bg-red-500 animate-pulse"
                      : isSpeaking
                      ? "bg-green-400 animate-pulse"
                      : isProcessing
                      ? "bg-yellow-400 animate-pulse"
                      : "bg-cyan-400"
                  }`}
                ></div>
                <span className="text-sm font-mono text-cyan-300 font-bold">
                  CONVERSACIÓN
                </span>
              </div>
              {isListening && (
                <span className="text-xs font-mono text-red-400 animate-pulse">
                  ● ESCUCHANDO
                </span>
              )}
            </div>
          </div>

          {/* Conversation History */}
          <div className="p-4 max-h-64 overflow-y-auto space-y-3">
            {conversationHistory.length === 0 ? (
              <div className="text-center text-cyan-500/50 text-sm font-mono py-8">
                Presiona el micrófono para iniciar una conversación
              </div>
            ) : (
              conversationHistory.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      msg.role === "user"
                        ? "bg-cyan-500/20 border border-cyan-500/50"
                        : "bg-slate-800 border border-cyan-500/30"
                    }`}
                  >
                    <div className="text-xs font-mono text-cyan-400 mb-1">
                      {msg.role === "user" ? "TÚ" : "AVA"} • {msg.timestamp}
                    </div>
                    <div className="text-sm text-cyan-100 font-mono">
                      {msg.content}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Current Transcript */}
          {(transcript || interimTranscript) && (
            <div className="px-4 pb-3 border-t border-cyan-500/30">
              <div className="bg-slate-800/50 rounded p-3 mt-3">
                <div className="text-xs font-mono text-cyan-400 mb-1">
                  TRANSCRIPCIÓN:
                </div>
                <div className="text-sm text-cyan-100 font-mono">
                  {transcript}
                  <span className="text-cyan-500/70">{interimTranscript}</span>
                  <span className="inline-block w-2 h-4 bg-cyan-400 ml-1 animate-pulse"></span>
                </div>
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="p-4 border-t border-cyan-500/50 bg-slate-800/50">
            {!isSupported ? (
              <div className="text-xs font-mono text-red-400 text-center">
                Speech recognition no soportado en este navegador
              </div>
            ) : (
              <div className="flex gap-2">
                {!isListening ? (
                  <button
                    onClick={handleStartListening}
                    disabled={isSpeaking || isProcessing}
                    className="flex-1 py-3 px-4 bg-cyan-500 hover:bg-cyan-600 disabled:bg-slate-700 disabled:text-slate-500 text-white font-mono text-sm font-bold rounded transition-all duration-300 flex items-center justify-center gap-2"
                    style={{
                      boxShadow:
                        isSpeaking || isProcessing
                          ? "none"
                          : "0 0 15px rgba(34, 211, 238, 0.5)",
                    }}
                  >
                    🎤 HABLAR
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleStopAndSend}
                      className="flex-1 py-3 px-4 bg-green-500 hover:bg-green-600 text-white font-mono text-sm font-bold rounded transition-all duration-300 flex items-center justify-center gap-2 animate-pulse"
                      style={{ boxShadow: "0 0 15px rgba(34, 197, 94, 0.5)" }}
                    >
                      ⏹️ ENVIAR
                    </button>
                    <button
                      onClick={stopListening}
                      className="py-3 px-4 bg-red-500 hover:bg-red-600 text-white font-mono text-sm font-bold rounded transition-all duration-300"
                    >
                      ✕
                    </button>
                  </>
                )}
              </div>
            )}

            {transcript && !isListening && (
              <button
                onClick={handleManualSend}
                className="w-full mt-2 py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-mono text-xs font-bold rounded transition-all duration-300"
              >
                ENVIAR TRANSCRIPCIÓN
              </button>
            )}

            {speechError && (
              <div className="mt-2 text-xs font-mono text-red-400 text-center">
                Error: {speechError}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="px-4 pb-3 border-t border-cyan-500/30">
            <div className="text-[10px] font-mono text-cyan-500/70 text-center">
              Pregunta sobre la Universidad Iberoamericana
            </div>
          </div>
        </div>
      </div>
    );
  }
);

ConversationInterface.displayName = "ConversationInterface";

export default ConversationInterface;
