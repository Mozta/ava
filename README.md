# AVA - Asistente Virtual Avanzado

<div align="center">
  <img src="https://img.shields.io/badge/React-19.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Three.js-0.181.2-000000?style=for-the-badge&logo=three.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind-4.1.17-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-7.2.4-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
</div>

## Descripcion

**AVA (Asistente Virtual Avanzado)** es un asistente virtual inteligente con interfaz 3D, desarrollado para la **Universidad Iberoamericana**. El sistema integra:

- **Orbe de particulas 3D** con animaciones fluidas y formacion de expresiones faciales
- **Deteccion facial** con MediaPipe para seguimiento en tiempo real
- **Text-to-Speech** con voces personalizadas de ElevenLabs
- **Conversaciones de voz en modo live** con agente conversacional de IA
- **UI Cyberpunk/Sci-Fi** con efectos visuales avanzados

---

## Caracteristicas Principales

### Fase 1: Orbe de Particulas 3D

- Nube de ~1800 particulas formando un orbe etereo con Three.js y React Three Fiber
- Animaciones por estado: respiracion (idle), compresion (listening), orbita caotica (thinking), formacion de ojos y boca (talking), onda expansiva (greeting)
- Colores configurables por estado desde archivo de configuracion
- Transiciones graduales con micro-glitches entre estados
- Iluminacion dinamica con efectos cyberpunk

### Fase 2: Deteccion Facial con MediaPipe

- Integracion de MediaPipe Face Detection
- El orbe rota siguiendo los movimientos del rostro del usuario (head tracking)
- Deteccion en tiempo real con indicadores visuales
- Sistema de tracking 3D (X, Y, Z)

### Fase 3: Text-to-Speech con ElevenLabs

- Voz personalizada configurada
- Mensajes predefinidos (saludo automatico al detectar rostro)
- Reproduccion de audio sincronizada con animaciones del orbe
- Sistema de estados (idle, greeting, listening, thinking, talking)

### Fase 4: Conversacion de Voz (Modo Live)

- Integracion con ElevenLabs Conversational AI
- Agente configurado con RAG (Universidad Iberoamericana)
- Captura de microfono para interaccion continua
- Sistema de estados de conversacion

---

## Arquitectura del Proyecto

```
ava-project/
├── src/
│   ├── components/
│   │   ├── ParticleOrb.jsx           # Orbe de particulas 3D con animaciones
│   │   ├── InitScreen.jsx            # Pantalla de inicio
│   │   ├── LoadingSequence.jsx        # Secuencia de carga animada
│   │   ├── SystemStats.jsx            # Panel de estadisticas del sistema
│   │   ├── CameraPreview.jsx          # Vista previa de camara con MediaPipe
│   │   └── ControlPanel.jsx           # Panel de control lateral
│   ├── config/
│   │   └── particleConfig.js          # Colores, cantidad y comportamiento de particulas
│   ├── hooks/
│   │   ├── useRobotState.js           # Gestion de estados del orbe
│   │   ├── useMediaPipe.js            # Deteccion facial con MediaPipe
│   │   ├── useVoice.js                # Text-to-Speech
│   │   └── useElevenLabsConversation.js  # Conversaciones con IA
│   ├── utils/
│   │   └── elevenLabsClient.js        # Cliente de ElevenLabs API
│   ├── App.jsx                        # Componente principal
│   └── main.jsx                       # Entry point
├── public/
├── .env                               # Variables de entorno
└── package.json
```

---

## Instalacion y Configuracion

### 1. Requisitos Previos

- Node.js 18+
- npm o yarn
- Cuenta de ElevenLabs (API Key y Agent ID)

### 2. Clonar el repositorio

```bash
git clone https://github.com/Mozta/ava-project.git
cd ava-project
```

### 3. Instalar dependencias

```bash
npm install
```

### 4. Configurar variables de entorno

Crea un archivo `.env` en la raiz del proyecto:

```env
VITE_ELEVENLABS_API_KEY=tu_api_key_aqui
VITE_ELEVENLABS_AGENT_ID=tu_agent_id_aqui
VITE_ELEVENLABS_VOICE_ID=tu_voice_id_aqui
```

### 5. Ejecutar en desarrollo

```bash
npm run dev
```

El proyecto estara disponible en `http://localhost:5173`

---

## Uso del Sistema

### Pantalla de Inicio

1. Al abrir la aplicacion, veras la pantalla de inicio con el boton **"INICIALIZAR SISTEMA"**
2. Click para comenzar la secuencia de carga

### Interfaz Principal

#### Panel de Control (Lateral izquierdo)

- **IDLE**: Estado de reposo
- **CAMARA**: Activar/desactivar camara y deteccion facial
- **SALUDO**: El orbe saluda con voz y onda expansiva
- **MODO LIVE**: Iniciar/detener conversacion de voz en tiempo real

#### System Stats (Superior derecho)

- Estado de camara y deteccion facial
- Sistema de voz y Core de IA

#### Camera Preview (Inferior derecho)

- Vista en vivo de la camara
- Indicador de rostro detectado

#### System Status (Superior izquierdo)

- Estado de conversacion (activa/inactiva)
- Estado de microfono y modo actual

---

## Tecnologias Utilizadas

| Tecnologia                  | Version | Proposito                    |
| --------------------------- | ------- | ---------------------------- |
| **React**                   | 19.2.0  | Framework UI                 |
| **Vite**                    | 7.2.4   | Build tool y dev server      |
| **Three.js**                | 0.181.2 | Renderizado 3D               |
| **@react-three/fiber**      | 9.4.2   | React renderer para Three.js |
| **@react-three/drei**       | 10.7.7  | Helpers de Three.js          |
| **@react-spring/three**     | 10.0.3  | Animaciones 3D               |
| **@mediapipe/tasks-vision** | 0.10.22 | Deteccion facial             |
| **@elevenlabs/client**      | 0.12.0  | SDK de ElevenLabs            |
| **Tailwind CSS**            | 4.1.17  | Estilos y UI                 |

---

## Estados del Orbe

| Estado        | Comportamiento                                          | Trigger                         |
| ------------- | ------------------------------------------------------- | ------------------------------- |
| **idle**      | Orbe esferico, particulas respirando                    | Default                         |
| **greeting**  | Onda expansiva y contraccion                            | Rostro detectado / Boton SALUDO |
| **listening** | Orbe se comprime, como prestando atencion               | Modo live activo                |
| **thinking**  | Particulas orbitan caoticamente                         | Procesando (automatico)         |
| **talking**   | Particulas forman ojos y boca, boca ondula con la voz   | Reproduciendo audio             |

---

## Configuracion de Particulas

El archivo `src/config/particleConfig.js` permite personalizar:

- **Colores por estado**: cyan (idle), azul (listening), violeta (thinking), blanco (talking), cyan brillante (greeting)
- **Cantidad de particulas**: 1800 por defecto
- **Comportamiento**: velocidad de respiracion, intensidad de glitch, velocidad de transicion, parametros de formacion facial, etc.

---

## Contribuciones

Este proyecto fue desarrollado como sistema de asistente virtual para la Universidad Iberoamericana.

## Licencia

Este proyecto esta bajo licencia privada de la Universidad Iberoamericana.

---

<div align="center">
  <p>Hecho para Universidad Iberoamericana</p>
</div>
