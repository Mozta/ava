# 🤖 AVA - Asistente Virtual Avanzado

<div align="center">
  <img src="https://img.shields.io/badge/React-19.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Three.js-0.181.2-000000?style=for-the-badge&logo=three.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind-4.1.17-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-7.2.4-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
</div>

## 📖 Descripción

**AVA (Asistente Virtual Avanzado)** es un proyecto de asistente virtual inteligente con interfaz 3D, desarrollado para la **Universidad Iberoamericana**. El sistema integra:

- 🎨 **Robot 3D interactivo** con animaciones fluidas
- 👁️ **Detección facial** con MediaPipe para seguimiento en tiempo real
- 🗣️ **Text-to-Speech** con voces personalizadas de ElevenLabs
- 🎤 **Conversaciones de voz** con agente conversacional de IA
- 💻 **UI Cyberpunk/Sci-Fi** con efectos visuales avanzados

---

## 🎯 Características Principales

### ✅ **Fase 1: Robot 3D**

- Robot animado con Three.js y React Three Fiber
- Animaciones de idle (flotación y rotación)
- Iluminación dinámica con efectos cyberpunk
- Grid floor con efectos de neón

### ✅ **Fase 2: Detección Facial con MediaPipe**

- Integración de MediaPipe Face Detection
- El robot sigue los movimientos del rostro del usuario
- Detección en tiempo real con indicadores visuales
- Sistema de tracking 3D (X, Y, Z)

### ✅ **Fase 3: Text-to-Speech con ElevenLabs**

- Voz personalizada configurada
- Mensajes predefinidos (saludo automático al detectar rostro)
- Reproducción de audio sincronizada con animaciones
- Sistema de estados del robot (idle, greeting, listening, talking)

### ⚠️ **Fase 4: Conversación de Voz (En desarrollo)**

- Integración con ElevenLabs Conversational AI
- Agente configurado con RAG (Universidad Iberoamericana)
- Captura de micrófono para interacción continua
- Sistema de estados de conversación

---

## 🏗️ Arquitectura del Proyecto

```
ava-project/
├── src/
│   ├── components/
│   │   ├── Robot3D.jsx              # Robot 3D con animaciones
│   │   ├── InitScreen.jsx           # Pantalla de inicio
│   │   ├── LoadingSequence.jsx      # Secuencia de carga animada
│   │   ├── SystemStats.jsx          # Panel de estadísticas del sistema
│   │   ├── CameraPreview.jsx        # Vista previa de cámara con MediaPipe
│   │   └── ControlPanel.jsx         # Panel de control con botones
│   ├── hooks/
│   │   ├── useRobotState.js         # Gestión de estados del robot
│   │   ├── useMediaPipe.js          # Detección facial con MediaPipe
│   │   ├── useVoice.js              # Text-to-Speech
│   │   └── useElevenLabsConversation.js  # Conversaciones con IA
│   ├── utils/
│   │   └── elevenLabsClient.js      # Cliente de ElevenLabs API
│   ├── App.jsx                      # Componente principal
│   └── main.jsx                     # Entry point
├── public/
├── .env                             # Variables de entorno
└── package.json
```

---

## 🚀 Instalación y Configuración

### **1. Requisitos Previos**

- Node.js 18+
- npm o yarn
- Cuenta de ElevenLabs (API Key y Agent ID)

### **2. Clonar el repositorio**

```bash
git clone https://github.com/Mozta/ava-project.git
cd ava-project
```

### **3. Instalar dependencias**

```bash
npm install
```

### **4. Configurar variables de entorno**

Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_ELEVENLABS_API_KEY=tu_api_key_aqui
VITE_ELEVENLABS_AGENT_ID=tu_agent_id_aqui
VITE_ELEVENLABS_VOICE_ID=tu_voice_id_aqui
```

### **5. Ejecutar en desarrollo**

```bash
npm run dev
```

El proyecto estará disponible en `http://localhost:5173`

---

## 🎮 Uso del Sistema

### **Pantalla de Inicio**

1. Al abrir la aplicación, verás la pantalla de inicio con el botón **"INICIALIZAR SISTEMA"**
2. Click para comenzar la secuencia de carga

### **Secuencia de Carga**

- Sistema inicializando módulos (UI, 3D Engine, MediaPipe, Audio)
- Carga automática en 3-4 segundos

### **Interfaz Principal**

#### **Panel de Control (Bottom Center)**

- **IDLE**: Estado de reposo
- **SALUDO**: Robot saluda con voz
- **ESCUCHAR**: Iniciar/detener conversación de voz
- **PROCESAR**: Estado de procesamiento (automático)
- **HABLAR**: Estado cuando habla (automático)

#### **System Stats (Top Right)**

- Estado de cámara
- Detección facial
- Sistema de voz
- Core de IA

#### **Camera Preview (Bottom Right)**

- Vista en vivo de la cámara
- Indicador de rostro detectado
- Toggle on/off

#### **System Status (Top Left)**

- Estado de conversación (activa/inactiva)
- ID de conversación
- Estado de micrófono
- Modo actual (listening/speaking)

---

## 🛠️ Tecnologías Utilizadas

| Tecnología                  | Versión | Propósito                    |
| --------------------------- | ------- | ---------------------------- |
| **React**                   | 19.2.0  | Framework UI                 |
| **Vite**                    | 7.2.4   | Build tool y dev server      |
| **Three.js**                | 0.181.2 | Renderizado 3D               |
| **@react-three/fiber**      | 9.4.2   | React renderer para Three.js |
| **@react-three/drei**       | 10.7.7  | Helpers de Three.js          |
| **@react-spring/three**     | 10.0.3  | Animaciones 3D               |
| **@mediapipe/tasks-vision** | 0.10.22 | Detección facial             |
| **@elevenlabs/client**      | 0.12.0  | SDK de ElevenLabs            |
| **Tailwind CSS**            | 4.1.17  | Estilos y UI                 |

---

## 🎨 Diseño y Estilo

### **Tema Visual: Cyberpunk/Sci-Fi**

- Colores primarios: Cyan (#22d3ee), Blue (#06b6d4)
- Fondo: Slate oscuro (#0a0e1a, #0f172a)
- Efectos:
  - Grid animado de fondo
  - Scanlines overlay
  - Box shadows con glow cyan
  - Bordes con efecto neón
  - Animaciones de pulse

### **Componentes UI**

- Paneles semi-transparentes con backdrop blur
- Bordes con gradientes y brillos
- Indicadores animados (puntos de estado)
- Botones con corner accents
- Barras de progreso con animación

---

## 📊 Estados del Robot

| Estado        | Descripción                | Trigger                         |
| ------------- | -------------------------- | ------------------------------- |
| **idle**      | Reposo, flotando y rotando | Default                         |
| **greeting**  | Saludando al usuario       | Rostro detectado / Botón SALUDO |
| **listening** | Escuchando al usuario      | Conversación activa             |
| **thinking**  | Procesando información     | (Automático)                    |
| **talking**   | Hablando al usuario        | Reproduciendo audio             |

---

## 🔧 Hooks Personalizados

### **`useRobotState`**

Gestiona los estados del robot y transiciones entre ellos.

### **`useMediaPipe`**

- Inicializa MediaPipe Face Detector
- Detecta rostros en tiempo real
- Calcula posición 3D del rostro
- Retorna coordenadas normalizadas

### **`useVoice`**

- Genera audio con ElevenLabs TTS
- Reproduce audio con control de estado
- Maneja errores de reproducción
- Stop/pause de audio

### **`useElevenLabsConversation`**

- Conecta con ElevenLabs Conversational AI
- Maneja WebSocket de conversación
- Estados de conexión y conversación
- Callbacks de eventos (onConnect, onDisconnect, onMessage)

---

## 🐛 Troubleshooting

### **El robot no aparece**

- Verifica que Three.js esté cargando correctamente
- Revisa la consola del navegador

### **No se detecta el rostro**

- Permite acceso a la cámara cuando el navegador lo solicite
- Verifica que la cámara esté activa (toggle en Camera Preview)
- Asegúrate de tener buena iluminación

### **No se reproduce el audio**

- Verifica las variables de entorno de ElevenLabs
- Revisa que el API Key sea válido
- Comprueba la consola para errores de API

### **Conversación no conecta**

- Este feature está en desarrollo (Fase 4)
- Verifica el Agent ID en `.env`
- Revisa permisos de micrófono

---

## 🚧 Desarrollo Futuro

### **Fase 5: IA Conversacional Completa**

- Integración con GPT/Claude para procesamiento de lenguaje
- Sistema de contexto y memoria
- Respuestas personalizadas por estudiante
- Base de conocimiento expandida

### **Mejoras Planificadas**

- [ ] Expresiones faciales del robot
- [ ] Gestos con las manos
- [ ] Sistema de emociones
- [ ] Dashboard de administración
- [ ] Analytics de conversaciones
- [ ] Modo multi-usuario

---

## 👥 Contribuciones

Este proyecto fue desarrollado como sistema de asistente virtual para la Universidad Iberoamericana.

---

## 📄 Licencia

Este proyecto está bajo licencia privada de la Universidad Iberoamericana.

---

## 🙏 Agradecimientos

- **ElevenLabs** por el sistema de voz de IA
- **MediaPipe** por la tecnología de detección facial
- **Three.js community** por el ecosistema 3D
- **Universidad Iberoamericana** por el soporte del proyecto

---

<div align="center">
  <p>Hecho con ❤️ para Universidad Iberoamericana</p>
  <p>© 2024 AVA Project - Todos los derechos reservados</p>
</div>
