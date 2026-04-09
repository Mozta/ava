# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AVA (Asistente Virtual Avanzado) is an interactive 3D AI assistant built for Universidad Iberoamericana. It features a particle orb (cloud of ~1800 points) as its visual representation, combined with ElevenLabs voice/conversational AI, MediaPipe face detection, and a cyberpunk-themed UI.

## Commands

- `npm run dev` — Start dev server (localhost:5173)
- `npm run build` — Production build
- `npm run lint` — ESLint
- `npm run preview` — Preview production build

No test framework is configured.

## Tech Stack

- **React 19** + **Vite 7** — UI and build
- **Three.js** via @react-three/fiber and @react-three/drei — 3D particle rendering
- **@react-spring/three** — Spring-based 3D animations
- **ElevenLabs SDK** — Text-to-speech and conversational AI agent
- **MediaPipe** (@mediapipe/tasks-vision) — Real-time face detection/tracking
- **Tailwind CSS 4** — Styling (dark cyberpunk theme with cyan accents)

## Architecture

### Application States

App.jsx manages three sequential states: `init` → `loading` → `ready`. InitScreen and LoadingSequence handle the boot sequence; the main interface renders in `ready`.

### Custom Hooks (src/hooks/)

All major features are encapsulated in hooks consumed by App.jsx:

- **useRobotState** — State machine for orb animations: idle, greeting, listening, thinking, talking
- **useMediaPipe** — Face detection via camera; provides face position (X, Y, Z) for head tracking
- **useVoice** — ElevenLabs TTS playback
- **useElevenLabsConversation** — Full voice conversation with ElevenLabs Conversation SDK
- **useElevenLabsAgent** — WebSocket-based agent communication with audio queue
- **useSpeechRecognition** — Web Speech API wrapper (Spanish language)

### Particle Orb (src/components/ParticleOrb.jsx)

Cloud of ~1800 particles forming an ethereal orb. Animated via useFrame with distinct behaviors per state: breathing sphere (idle), compression (listening), chaotic orbit (thinking), face formation with eyes and mouth (talking), shockwave expansion (greeting). Tracks detected face position for rotation. Transitions between states include gradual migration with random micro-glitches.

### Particle Configuration (src/config/particleConfig.js)

Centralized config file for colors per state, particle count, sizes, speeds, face formation parameters, and transition behavior. Edit this file to customize the orb appearance.

### Data Flow

User interaction (ControlPanel) → App.jsx callbacks → hook state changes → ParticleOrb reacts via useFrame → UI panels update via React re-render.

## Environment Variables

Required in `.env` (prefixed with `VITE_` for Vite exposure):

- `VITE_ELEVENLABS_API_KEY`
- `VITE_ELEVENLABS_AGENT_ID`
- `VITE_ELEVENLABS_VOICE_ID`
- `VITE_OPENAI_API_KEY` (backup)

## Language

The application UI and voice interactions are in **Spanish**. Commit messages and code comments are also primarily in Spanish.
