import { useState, useCallback, useRef } from "react";
import { textToSpeech, playAudio } from "../utils/elevenLabsClient";

export function useVoice() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const audioRef = useRef(null);

  // Detener audio actual
  const stopSpeaking = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setIsSpeaking(false);
  }, []);

  // Generar y reproducir texto
  const speak = useCallback(
    async (text, voiceId = "pNInz6obpgDQGcFmaJgB") => {
      try {
        // Detener cualquier audio previo
        stopSpeaking();

        setIsGenerating(true);
        setError(null);

        console.log("Generando voz para:", text);

        // Generar audio con ElevenLabs
        const audioBlob = await textToSpeech(text, voiceId);

        setIsGenerating(false);
        setIsSpeaking(true);

        // Crear y reproducir audio
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audioRef.current = audio;

        return new Promise((resolve, reject) => {
          audio.onended = () => {
            URL.revokeObjectURL(audioUrl);
            setIsSpeaking(false);
            audioRef.current = null;
            resolve();
          };

          audio.onerror = (err) => {
            URL.revokeObjectURL(audioUrl);
            setIsSpeaking(false);
            setError("Error reproduciendo audio");
            audioRef.current = null;
            reject(err);
          };

          audio.play().catch((err) => {
            URL.revokeObjectURL(audioUrl);
            setIsSpeaking(false);
            setError("Error iniciando reproducción");
            audioRef.current = null;
            reject(err);
          });
        });
      } catch (err) {
        console.error("Error en speak:", err);
        setIsGenerating(false);
        setIsSpeaking(false);
        setError(err.message || "Error generando voz");
        throw err;
      }
    },
    [stopSpeaking]
  );

  return {
    speak,
    stopSpeaking,
    isSpeaking,
    isGenerating,
    error,
  };
}
