import { useState, useRef, useCallback, useEffect } from "react";
import { Conversation } from "@elevenlabs/client";

/**
 * Hook para manejar conversaciones de voz completas con ElevenLabs
 * Incluye captura de micrófono y reproducción de audio automática
 */
export function useElevenLabsConversation() {
  const [isConnected, setIsConnected] = useState(false);
  const [isAgentSpeaking, setIsAgentSpeaking] = useState(false);
  const [error, setError] = useState(null);
  const [conversationId, setConversationId] = useState(null);
  const [mode, setMode] = useState("idle"); // 'idle', 'listening', 'speaking'

  const conversationRef = useRef(null);

  // Conectar al agente y comenzar conversación
  const startConversation = useCallback(async () => {
    try {
      console.log("🎯 startConversation llamado");
      const agentId = import.meta.env.VITE_ELEVENLABS_AGENT_ID;

      console.log("🤖 Agent ID:", agentId ? "✓ Presente" : "✗ Faltante");

      if (!agentId) {
        throw new Error("Agent ID de ElevenLabs no configurado");
      }

      // Solicitar permisos de micrófono primero
      console.log("🎤 Solicitando permisos de micrófono...");
      await navigator.mediaDevices.getUserMedia({ audio: true });

      // Crear instancia de conversación
      console.log("📡 Iniciando sesión con ElevenLabs...");
      const conversation = await Conversation.startSession({
        agentId: agentId,
        onConnect: () => {
          console.log("✅ Conectado a ElevenLabs");
          setIsConnected(true);
          setError(null);
        },
        onDisconnect: () => {
          console.log("❌ Desconectado de ElevenLabs");
          setIsConnected(false);
          setIsAgentSpeaking(false);
          setMode("idle");
        },
        onMessage: (message) => {
          console.log("📝 Mensaje:", message);
        },
        onError: (error) => {
          console.error("❌ Error en conversación:", error);
          setError(error.message || "Error desconocido");
          setIsConnected(false);
          setIsAgentSpeaking(false);
        },
        onModeChange: ({ mode: newMode }) => {
          console.log("🔄 Modo cambiado a:", newMode);
          setMode(newMode);

          // Actualizar estado de si el agente está hablando
          if (newMode === "speaking") {
            setIsAgentSpeaking(true);
          } else {
            setIsAgentSpeaking(false);
          }
        },
        onUserTranscript: (transcript) => {
          console.log("👤 Usuario:", transcript);
        },
        onAgentResponse: (response) => {
          console.log("🤖 Agente:", response);
        },
      });

      conversationRef.current = conversation;
      const convId = conversation.getId();
      setConversationId(convId);
      console.log("✅ Conversación iniciada, ID:", convId);
    } catch (err) {
      console.error("❌ Error iniciando conversación:", err);

      if (err.name === "NotAllowedError") {
        setError("Por favor, permite el acceso al micrófono");
      } else {
        setError(err.message || "Error al iniciar la conversación");
      }

      setIsConnected(false);
      setIsAgentSpeaking(false);
    }
  }, []);

  // Terminar conversación
  const endConversation = useCallback(async () => {
    try {
      console.log("📴 Terminando conversación...");

      if (conversationRef.current) {
        await conversationRef.current.endSession();
        conversationRef.current = null;
      }

      setIsConnected(false);
      setIsAgentSpeaking(false);
      setMode("idle");
      setConversationId(null);
      console.log("✅ Conversación terminada");
    } catch (err) {
      console.error("❌ Error terminando conversación:", err);
    }
  }, []);

  // Limpiar recursos al desmontar
  useEffect(() => {
    return () => {
      if (conversationRef.current) {
        conversationRef.current.endSession();
      }
    };
  }, []);

  return {
    isConnected,
    isAgentSpeaking,
    conversationId,
    mode,
    error,
    startConversation,
    endConversation,
  };
}
