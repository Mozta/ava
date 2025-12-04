// Cliente de ElevenLabs - Para Text-to-Speech usamos fetch directo
// El paquete @elevenlabs/client está enfocado en conversaciones

/**
 * Convierte texto a voz usando ElevenLabs API directamente
 * @param {string} text - Texto a convertir
 * @param {string} voiceId - ID de la voz (usa VITE_ELEVENLABS_VOICE_ID por defecto)
 * @returns {Promise<Blob>} Audio blob
 */
export const textToSpeech = async (text, voiceId = null) => {
  try {
    const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
    const defaultVoiceId = import.meta.env.VITE_ELEVENLABS_VOICE_ID;

    // Usar voiceId proporcionado o el del .env
    const finalVoiceId = voiceId || defaultVoiceId;

    if (!apiKey) {
      throw new Error("VITE_ELEVENLABS_API_KEY no está configurado en .env");
    }

    if (!finalVoiceId) {
      throw new Error("VITE_ELEVENLABS_VOICE_ID no está configurado en .env");
    }

    console.log("Generando audio con ElevenLabs:", text);

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${finalVoiceId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": apiKey,
        },
        body: JSON.stringify({
          text: text,
          model_id: "eleven_turbo_v2_5",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Error en ElevenLabs API: ${response.status}`);
    }

    const audioBlob = await response.blob();
    console.log("Audio generado exitosamente");
    return audioBlob;
  } catch (error) {
    console.error("Error en textToSpeech:", error);
    throw error;
  }
};

/**
 * Reproduce un blob de audio
 * @param {Blob} audioBlob - Blob de audio a reproducir
 * @returns {Promise<void>}
 */
export const playAudio = (audioBlob) => {
  return new Promise((resolve, reject) => {
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);

    audio.onended = () => {
      URL.revokeObjectURL(audioUrl);
      resolve();
    };

    audio.onerror = (error) => {
      URL.revokeObjectURL(audioUrl);
      reject(error);
    };

    audio.play().catch(reject);
  });
};

/**
 * Genera y reproduce audio directamente
 * @param {string} text - Texto a convertir y reproducir
 * @returns {Promise<void>}
 */
export const speak = async (text) => {
  const audioBlob = await textToSpeech(text);
  await playAudio(audioBlob);
};

// Mensajes predefinidos
export const PREDEFINED_MESSAGES = {
  greeting:
    "¡Hola! Soy AVA, tu asistente virtual inteligente. ¿En qué puedo ayudarte hoy?",
  greeting_detected: "¡Hola! Te he detectado. Es un placer verte.",
  listening: "Te escucho, adelante.",
  thinking: "Déjame pensar en eso...",
  error: "Lo siento, ha ocurrido un error. Por favor, inténtalo de nuevo.",
  goodbye: "Hasta luego, ha sido un placer ayudarte.",
};
