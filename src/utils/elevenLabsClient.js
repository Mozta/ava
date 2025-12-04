import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

// Cliente de ElevenLabs
let elevenLabsClient = null;

const initializeElevenLabs = () => {
  if (!elevenLabsClient) {
    const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
    if (!apiKey) {
      throw new Error("VITE_ELEVENLABS_API_KEY no está configurado en .env");
    }
    elevenLabsClient = new ElevenLabsClient({ apiKey });
  }
  return elevenLabsClient;
};

/**
 * Convierte texto a voz usando ElevenLabs
 * @param {string} text - Texto a convertir
 * @param {string} voiceId - ID de la voz (default: voz masculina profesional)
 * @returns {Promise<Blob>} Audio blob
 */
export const textToSpeech = async (text, voiceId = "pNInz6obpgDQGcFmaJgB") => {
  try {
    const client = initializeElevenLabs();

    console.log("Generando audio con ElevenLabs:", text);

    // Usar la API correcta de text-to-speech
    const audio = await client.textToSpeech.convert(voiceId, {
      text: text,
      model_id: "eleven_turbo_v2_5",
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75,
        style: 0.5,
        use_speaker_boost: true,
      },
    });

    // Convertir el stream a blob
    const chunks = [];
    for await (const chunk of audio) {
      chunks.push(chunk);
    }

    const audioBlob = new Blob(chunks, { type: "audio/mpeg" });
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
 * @param {string} voiceId - ID de la voz
 * @returns {Promise<void>}
 */
export const speak = async (text, voiceId) => {
  const audioBlob = await textToSpeech(text, voiceId);
  await playAudio(audioBlob);
};

/**
 * Obtiene lista de voces disponibles
 * @returns {Promise<Array>}
 */
export const getVoices = async () => {
  try {
    const client = initializeElevenLabs();
    const voices = await client.voices.getAll();
    return voices.voices;
  } catch (error) {
    console.error("Error obteniendo voces:", error);
    throw error;
  }
};

// Voces predefinidas en español
export const SPANISH_VOICES = {
  MALE: "pNInz6obpgDQGcFmaJgB", // Adam - voz masculina
  FEMALE: "EXAVITQu4vr4xnSDxMaL", // Bella - voz femenina
  MALE_YOUNG: "yoZ06aMxZJJ28mfd3POQ", // Sam - voz joven masculina
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
