import { useState, useRef, useCallback } from "react";
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

/**
 * Hook para manejar conversaciones con el agente de ElevenLabs usando WebSocket
 */
export function useElevenLabsAgent() {
  const [isConnected, setIsConnected] = useState(false);
  const [isAgentSpeaking, setIsAgentSpeaking] = useState(false);
  const [error, setError] = useState(null);
  const [conversationId, setConversationId] = useState(null);

  const wsRef = useRef(null);
  const audioContextRef = useRef(null);
  const audioQueueRef = useRef([]);
  const isPlayingRef = useRef(false);

  // Inicializar AudioContext
  const initAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext ||
        window.webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  // Reproducir audio del agente
  const playAudioChunk = useCallback(
    async (audioData) => {
      try {
        const audioContext = initAudioContext();
        const audioBuffer = await audioContext.decodeAudioData(audioData);

        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);

        return new Promise((resolve) => {
          source.onended = resolve;
          source.start(0);
        });
      } catch (err) {
        console.error("Error reproduciendo audio:", err);
      }
    },
    [initAudioContext]
  );

  // Procesar cola de audio
  const processAudioQueue = useCallback(async () => {
    if (isPlayingRef.current || audioQueueRef.current.length === 0) {
      return;
    }

    isPlayingRef.current = true;
    setIsAgentSpeaking(true);

    while (audioQueueRef.current.length > 0) {
      const audioChunk = audioQueueRef.current.shift();
      await playAudioChunk(audioChunk);
    }

    isPlayingRef.current = false;
    setIsAgentSpeaking(false);
  }, [playAudioChunk]);

  // Conectar al agente
  const connect = useCallback(async () => {
    try {
      const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
      const agentId = import.meta.env.VITE_ELEVENLABS_AGENT_ID;

      if (!apiKey || !agentId) {
        throw new Error("Credenciales de ElevenLabs no configuradas");
      }

      const client = new ElevenLabsClient({ apiKey });

      // Obtener signed URL para WebSocket
      const response = await client.conversationalAi.getSignedUrl({
        agentId: agentId,
      });

      const signedUrl = response.signed_url;
      console.log("Conectando al agente via WebSocket...");

      // Crear conexión WebSocket
      const ws = new WebSocket(signedUrl);
      ws.binaryType = "arraybuffer";

      ws.onopen = () => {
        console.log("WebSocket conectado al agente");
        setIsConnected(true);
        setError(null);
      };

      ws.onmessage = (event) => {
        try {
          if (typeof event.data === "string") {
            const message = JSON.parse(event.data);
            console.log("Mensaje del agente:", message);

            if (message.type === "conversation_initiation_metadata") {
              setConversationId(message.conversation_id);
            }
          } else if (event.data instanceof ArrayBuffer) {
            // Audio chunk recibido
            audioQueueRef.current.push(event.data);
            processAudioQueue();
          }
        } catch (err) {
          console.error("Error procesando mensaje:", err);
        }
      };

      ws.onerror = (err) => {
        console.error("WebSocket error:", err);
        setError("Error de conexión con el agente");
        setIsConnected(false);
      };

      ws.onclose = () => {
        console.log("WebSocket desconectado");
        setIsConnected(false);
      };

      wsRef.current = ws;
    } catch (err) {
      console.error("Error conectando al agente:", err);
      setError(err.message);
    }
  }, [processAudioQueue]);

  // Enviar mensaje de texto al agente
  const sendText = useCallback((text) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      console.error("WebSocket no está conectado");
      return;
    }

    const message = {
      type: "user_text",
      text: text,
    };

    console.log("Enviando texto al agente:", text);
    wsRef.current.send(JSON.stringify(message));
  }, []);

  // Enviar audio al agente (para conversación por voz)
  const sendAudio = useCallback((audioData) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      console.error("WebSocket no está conectado");
      return;
    }

    wsRef.current.send(audioData);
  }, []);

  // Desconectar
  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    audioQueueRef.current = [];
    setIsConnected(false);
    setConversationId(null);
  }, []);

  return {
    isConnected,
    isAgentSpeaking,
    conversationId,
    error,
    connect,
    disconnect,
    sendText,
    sendAudio,
  };
}
