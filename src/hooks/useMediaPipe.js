import { useState, useEffect, useRef, useCallback } from "react";
import { FaceDetector, FilesetResolver } from "@mediapipe/tasks-vision";

export function useMediaPipe(videoElement, isActive) {
  const [faceDetected, setFaceDetected] = useState(false);
  const [facePosition, setFacePosition] = useState({ x: 0, y: 0, z: 0 });
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState(null);

  const faceDetectorRef = useRef(null);
  const animationFrameRef = useRef(null);
  const lastDetectionTimeRef = useRef(0);

  // Inicializar MediaPipe
  useEffect(() => {
    let mounted = true;

    const initializeMediaPipe = async () => {
      try {
        console.log("Inicializando MediaPipe Face Detector...");

        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );

        const detector = await FaceDetector.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite",
            delegate: "GPU",
          },
          runningMode: "VIDEO",
          minDetectionConfidence: 0.5,
        });

        if (mounted) {
          faceDetectorRef.current = detector;
          setIsInitialized(true);
          console.log("MediaPipe Face Detector inicializado correctamente");
        }
      } catch (err) {
        console.error("Error inicializando MediaPipe:", err);
        if (mounted) {
          setError(err.message);
        }
      }
    };

    initializeMediaPipe();

    return () => {
      mounted = false;
      if (faceDetectorRef.current) {
        faceDetectorRef.current.close();
      }
    };
  }, []);

  // Detectar rostro en el video
  const detectFace = useCallback(() => {
    if (
      !isActive ||
      !isInitialized ||
      !videoElement ||
      !faceDetectorRef.current
    ) {
      return;
    }

    try {
      const now = performance.now();

      // Limitar a ~30 FPS para detección
      if (now - lastDetectionTimeRef.current < 33) {
        animationFrameRef.current = requestAnimationFrame(detectFace);
        return;
      }

      lastDetectionTimeRef.current = now;

      // Verificar que el video esté listo
      if (videoElement.readyState === videoElement.HAVE_ENOUGH_DATA) {
        const detections = faceDetectorRef.current.detectForVideo(
          videoElement,
          now
        );

        if (detections.detections && detections.detections.length > 0) {
          const face = detections.detections[0];
          const boundingBox = face.boundingBox;

          // Calcular posición normalizada del rostro
          const centerX =
            (boundingBox.originX + boundingBox.width / 2) /
            videoElement.videoWidth;
          const centerY =
            (boundingBox.originY + boundingBox.height / 2) /
            videoElement.videoHeight;
          const size = boundingBox.width / videoElement.videoWidth;

          // Convertir a coordenadas 3D para el robot
          // X: -1 (izquierda) a 1 (derecha)
          // Y: -1 (abajo) a 1 (arriba)
          // Z: basado en el tamaño del rostro (profundidad aproximada)
          const x = (centerX - 0.5) * 2;
          const y = -(centerY - 0.5) * 2;
          const z = size * 5; // Escalar para mejor visualización

          setFacePosition({ x, y, z });
          setFaceDetected(true);
        } else {
          setFaceDetected(false);
        }
      }

      animationFrameRef.current = requestAnimationFrame(detectFace);
    } catch (err) {
      console.error("Error en detección:", err);
    }
  }, [isActive, isInitialized, videoElement]);

  // Iniciar/detener detección
  useEffect(() => {
    if (isActive && isInitialized && videoElement) {
      detectFace();
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isActive, isInitialized, videoElement, detectFace]);

  return {
    faceDetected,
    facePosition,
    isInitialized,
    error,
  };
}
