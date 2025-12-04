import { useState, useEffect } from 'react';

function SystemStats({ robotState, cameraActive = false }) {
  const [stats, setStats] = useState({
    cpu: 0,
    memory: 0,
    neuralLink: 0,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setStats({
        cpu: Math.floor(Math.random() * 30) + 40,
        memory: Math.floor(Math.random() * 20) + 60,
        neuralLink: robotState === 'idle' ? Math.floor(Math.random() * 10) + 85 : Math.floor(Math.random() * 10) + 90,
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [robotState]);

  const StatusIndicator = ({ active, label }) => (
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${active ? 'bg-cyan-400 animate-pulse' : 'bg-red-500'}`}
           style={active ? { boxShadow: '0 0 10px rgba(34, 211, 238, 0.8)' } : {}}></div>
      <span className="text-xs font-mono">{label}</span>
    </div>
  );

  const StatBar = ({ label, value, color = 'cyan' }) => (
    <div className="mb-2">
      <div className="flex justify-between text-xs font-mono mb-1">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-1 bg-slate-800 rounded-full overflow-hidden border border-cyan-500/30">
        <div 
          className={`h-full bg-${color}-400 transition-all duration-500`}
          style={{ 
            width: `${value}%`,
            boxShadow: `0 0 10px rgba(34, 211, 238, 0.6)`
          }}
        ></div>
      </div>
    </div>
  );

  return (
    <div className="absolute top-4 right-4 z-20">
      <div className="bg-slate-900/90 backdrop-blur-sm border-2 border-cyan-500/50 rounded-lg p-4 min-w-[280px]"
           style={{ boxShadow: '0 0 20px rgba(34, 211, 238, 0.3)' }}>
        {/* Header */}
        <div className="border-b border-cyan-500/50 pb-2 mb-3">
          <div className="text-cyan-400 font-bold text-sm tracking-wider flex items-center gap-2">
            <div className="w-3 h-3 border-2 border-cyan-400 rotate-45"></div>
            AVA SYSTEM V.1.0.7
          </div>
          <div className="text-[10px] text-cyan-300/70 font-mono mt-1">
            {new Date().toLocaleTimeString('es-ES')}
          </div>
        </div>

        {/* Status indicators */}
        <div className="space-y-2 mb-3 text-cyan-300">
          <StatusIndicator active={cameraActive} label="CÁMARA" />
          <StatusIndicator active={robotState !== 'idle'} label="ENLACE NEURONAL" />
          <StatusIndicator active={true} label="AUDIO SYSTEM" />
          <StatusIndicator active={stats.neuralLink > 80} label="AI CORE" />
        </div>

        {/* Divider */}
        <div className="border-t border-cyan-500/30 my-3"></div>

        {/* System stats */}
        <div className="text-cyan-300">
          <div className="text-xs font-mono mb-2 text-cyan-400">SYSTEM STATS</div>
          <StatBar label="CPU" value={stats.cpu} />
          <StatBar label="MEMORY" value={stats.memory} />
          <StatBar label="NEURAL LINK" value={stats.neuralLink} color="green" />
        </div>

        {/* State indicator */}
        <div className="mt-3 pt-3 border-t border-cyan-500/30">
          <div className="text-xs font-mono text-cyan-300">
            STATUS: <span className="text-cyan-400 font-bold uppercase animate-pulse">{robotState}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SystemStats;
