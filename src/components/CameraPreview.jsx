import { useRef, useEffect, useState } from "react";

function CameraPreview({ isActive, onToggle, onVideoReady, faceDetected }) {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isActive) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => stopCamera();
  }, [isActive]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 320, height: 240 },
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        // Notificar cuando el video esté listo
        videoRef.current.onloadeddata = () => {
          if (onVideoReady) {
            onVideoReady(videoRef.current);
          }
        };
      }
      setError(null);
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Camera access denied");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  return (
    <div className="absolute bottom-4 right-4 z-20">
      <div
        className="bg-slate-900/90 backdrop-blur-sm border-2 border-cyan-500/50 rounded-lg overflow-hidden"
        style={{ boxShadow: "0 0 20px rgba(34, 211, 238, 0.3)" }}
      >
        {/* Header */}
        <div className="bg-slate-800/80 px-3 py-2 border-b border-cyan-500/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                isActive ? "bg-red-500 animate-pulse" : "bg-slate-600"
              }`}
            ></div>
            <span className="text-xs font-mono text-cyan-300 font-bold">
              VISUAL FEED
            </span>
          </div>
          <button
            onClick={onToggle}
            className="text-[10px] font-mono text-cyan-400 hover:text-cyan-300 transition-colors px-2 py-1 border border-cyan-500/50 rounded hover:bg-cyan-500/10"
          >
            {isActive ? "OFF" : "ON"}
          </button>
        </div>

        {/* Video preview */}
        <div className="relative w-80 h-60 bg-slate-950 flex items-center justify-center">
          {isActive && !error ? (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              {/* Overlay scanlines */}
              <div
                className="absolute inset-0 pointer-events-none opacity-20"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(0deg, transparent, transparent 2px, cyan 2px, cyan 3px)",
                }}
              ></div>
              {/* Corner brackets */}
              <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-cyan-400"></div>
              <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-cyan-400"></div>
              <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-cyan-400"></div>
              <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-cyan-400"></div>

              {/* Face detection indicator */}
              {faceDetected && (
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
                  <div
                    className="bg-green-500/80 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-2"
                    style={{ boxShadow: "0 0 10px rgba(34, 197, 94, 0.8)" }}
                  >
                    <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
                    <span className="text-xs font-mono text-white font-bold">
                      FACE DETECTED
                    </span>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center p-4">
              <div className="text-cyan-500/50 text-sm font-mono">
                {error || "CAMERA OFFLINE"}
              </div>
              <div className="text-cyan-500/30 text-xs font-mono mt-2">
                {error ? "ACCESS DENIED" : "PRESS ON TO ACTIVATE"}
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        {isActive && !error && (
          <div className="bg-slate-800/80 px-3 py-1 border-t border-cyan-500/50">
            <div className="text-[10px] font-mono text-cyan-400 flex justify-between">
              <span>RES: 320x240</span>
              <span>FPS: 30</span>
              <span className="animate-pulse">● REC</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CameraPreview;
