import { useState } from "react";

/**
 * Hook para manejar los estados del robot
 * Estados: idle, greeting, listening, thinking, talking
 */
export function useRobotState() {
  const [robotState, setRobotState] = useState("idle");

  const changeState = (newState) => {
    console.log(`Robot state changed: ${robotState} -> ${newState}`);
    setRobotState(newState);
  };

  return {
    robotState,
    changeState,
    isIdle: robotState === "idle",
    isGreeting: robotState === "greeting",
    isListening: robotState === "listening",
    isThinking: robotState === "thinking",
    isTalking: robotState === "talking",
  };
}
