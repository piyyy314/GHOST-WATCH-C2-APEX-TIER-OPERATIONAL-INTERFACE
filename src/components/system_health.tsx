import React, { useState, useEffect } from 'react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid 
} from 'recharts';
import { 
  Activity, Cpu, HardDrive, Server, Zap, RefreshCw, 
  CheckCircle2, AlertTriangle, ShieldCheck, Gauge
} from 'lucide-react';

interface MetricPoint {
  time: string;
  cpu: number;
  ram: number;
  disk: number;
  cryptoLoad: number;
}

export const SystemHealthWidget: React.FC = () => {
  const [data, setData] = useState<MetricPoint[]>(() => {
    const initial: MetricPoint[] = [];
    const now = Date.now();
    for (let i = 14; i >= 0; i--) {
      const d = new Date(now - i * 2000);
      const time = d.toTimeString().slice(0, 8);
      initial.push({
        time,
        cpu: Math.floor(28 + Math.random() * 18),
        ram: Math.floor(45 + Math.random() * 8),
        disk: Math.floor(32 + Math.random() * 6),
        cryptoLoad: Math.floor(15 + Math.random() * 20)
      });
    }
    return initial;
  });

  const [isLiveStreaming, setIsLiveStreaming] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(2000); // 2s
  const [activeMetricTab, setActiveMetricTab] = useState<'ALL' | 'CPU' | 'RAM' | 'DISK'>('ALL');
  const [isSpikingCrypto, setIsSpikingCrypto] = useState(false);

  // Live real-time streaming effect
  useEffect(() => {
    if (!isLiveStreaming) return;

    const timer = setInterval(() => {
      const d = new Date();
      const time = d.toTimeString().slice(0, 8);

      setData((prev) => {
        const last = prev[prev.length - 1] || { cpu: 35, ram: 50, disk: 34, cryptoLoad: 20 };
        
        // Random walk with mean reversion
        const cpuDrift = (Math.random() - 0.5) * 8;
        const targetCpu = isSpikingCrypto ? 88 : 34;
        const nextCpu = Math.max(12, Math.min(98, Math.round(last.cpu * 0.7 + targetCpu * 0.3 + cpuDrift)));

        const ramDrift = (Math.random() - 0.5) * 3;
        const nextRam = Math.max(30, Math.min(85, Math.round(last.ram * 0.85 + 50 * 0.15 + ramDrift)));

        const diskDrift = (Math.random() - 0.5) * 2;
        const nextDisk = Math.max(25, Math.min(70, Math.round(last.disk * 0.9 + 36 * 0.1 + diskDrift)));

        const nextCrypto = isSpikingCrypto ? Math.floor(82 + Math.random() * 15) : Math.floor(14 + Math.random() * 16);

        const newPoint: MetricPoint = {
          time,
          cpu: nextCpu,
          ram: nextRam,
          disk: nextDisk,
          cryptoLoad: nextCrypto
        };

        return [...prev.slice(1), newPoint];
      });
    }, refreshInterval);

    return () => clearInterval(timer);
  }, [isLiveStreaming, refreshInterval, isSpikingCrypto]);

  const currentMetrics = data[data.length - 1] || { cpu: 32, ram: 48, disk: 33, cryptoLoad: 18 };

  const handleTriggerQuantumLoad = () => {
    setIsSpikingCrypto(true);
    setTimeout(() => {
      setIsSpikingCrypto(false);
    }, 6000);
  };

  return (
    <div className="border border-slate-900 bg-slate-950 p-4 rounded-lg font-mono flex flex-col gap-3">
      {/* Widget Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-900 pb-2.5">
        <div className="flex items-center gap-2">
          <Activity className="w-4.5 h-4.5 text-cyan-400 animate-pulse" />
          <h4 className="font-display font-bold text-xs text-slate-100 uppercase tracking-widest flex items-center gap-2">
            Real-Time System Health &amp; Hardware Telemetry
          </h4>
          <span className="px-1.5 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-[9px] text-emerald-300 font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            LIVE SENSORS
          </span>
        </div>

        {/* Streaming controls */}
        <div className="flex items-center gap-2 text-[10px]">
          <button
            onClick={() => setIsLiveStreaming(!isLiveStreaming)}
            className={`px-2 py-1 rounded border font-bold cursor-pointer transition-colors ${
              isLiveStreaming ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/40' : 'bg-slate-900 text-slate-400 border-slate-800'
            }`}
          >
            {isLiveStreaming ? '⏸ Pause Stream' : '▶ Resume Stream'}
          </button>

          <button
            onClick={handleTriggerQuantumLoad}
            disabled={isSpikingCrypto}
            className="px-2 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded font-bold cursor-pointer transition-colors"
            title="Simulate heavy ML-KEM lattice key encapsulation operations"
          >
            <Zap className="w-3 h-3 inline mr-1" />
            {isSpikingCrypto ? 'PQC Burst Active...' : 'Simulate PQC Load Spike'}
          </button>
        </div>
      </div>

      {/* Primary KPI Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        {/* CPU */}
        <div className="bg-slate-900/40 p-2.5 rounded border border-slate-900 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[10px] text-slate-400">
            <span className="flex items-center gap-1"><Cpu className="w-3.5 h-3.5 text-cyan-400" /> CPU CORES</span>
            <span className="text-[9px] text-slate-500">16T @ 3.8GHz</span>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className={`text-xl font-bold font-mono ${currentMetrics.cpu > 80 ? 'text-rose-400' : currentMetrics.cpu > 60 ? 'text-amber-400' : 'text-cyan-400'}`}>
              {currentMetrics.cpu}%
            </span>
            <span className="text-[9px] text-slate-500">Nominal</span>
          </div>
          <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden mt-1.5">
            <div 
              className={`h-full transition-all duration-500 ${currentMetrics.cpu > 80 ? 'bg-rose-500' : 'bg-cyan-400'}`} 
              style={{ width: `${currentMetrics.cpu}%` }} 
            />
          </div>
        </div>

        {/* RAM */}
        <div className="bg-slate-900/40 p-2.5 rounded border border-slate-900 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[10px] text-slate-400">
            <span className="flex items-center gap-1"><Server className="w-3.5 h-3.5 text-emerald-400" /> RAM ENCLAVE</span>
            <span className="text-[9px] text-slate-500">64 GB ECC DDR5</span>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-bold text-emerald-400 font-mono">
              {currentMetrics.ram}%
            </span>
            <span className="text-[9px] text-slate-500">({(64 * currentMetrics.ram / 100).toFixed(1)} GB used)</span>
          </div>
          <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden mt-1.5">
            <div 
              className="h-full bg-emerald-400 transition-all duration-500" 
              style={{ width: `${currentMetrics.ram}%` }} 
            />
          </div>
        </div>

        {/* DISK */}
        <div className="bg-slate-900/40 p-2.5 rounded border border-slate-900 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[10px] text-slate-400">
            <span className="flex items-center gap-1"><HardDrive className="w-3.5 h-3.5 text-amber-400" /> DISK I/O</span>
            <span className="text-[9px] text-slate-500">NVMe FIPS-140-3</span>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-bold text-amber-400 font-mono">
              {currentMetrics.disk}%
            </span>
            <span className="text-[9px] text-slate-500">2.1 TB Free</span>
          </div>
          <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden mt-1.5">
            <div 
              className="h-full bg-amber-400 transition-all duration-500" 
              style={{ width: `${currentMetrics.disk}%` }} 
            />
          </div>
        </div>

        {/* QUANTUM CRYPTO LOAD */}
        <div className="bg-slate-900/40 p-2.5 rounded border border-slate-900 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[10px] text-slate-400">
            <span className="flex items-center gap-1"><Zap className="w-3.5 h-3.5 text-fuchsia-400" /> PQC ENGINE</span>
            <span className="text-[9px] text-fuchsia-300">FIPS 203 Core</span>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className={`text-xl font-bold font-mono ${currentMetrics.cryptoLoad > 70 ? 'text-fuchsia-400 animate-pulse' : 'text-slate-300'}`}>
              {currentMetrics.cryptoLoad}%
            </span>
            <span className="text-[9px] text-slate-500">Active</span>
          </div>
          <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden mt-1.5">
            <div 
              className="h-full bg-fuchsia-500 transition-all duration-500" 
              style={{ width: `${currentMetrics.cryptoLoad}%` }} 
            />
          </div>
        </div>
      </div>

      {/* Recharts Area Graph Display */}
      <div className="bg-slate-950 border border-slate-900 rounded p-3 flex flex-col gap-2">
        <div className="flex items-center justify-between text-[10px]">
          <div className="flex items-center gap-3">
            <span className="text-slate-400 font-bold uppercase tracking-wider">Live Utilization Curves:</span>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-cyan-400"><span className="w-2 h-0.5 bg-cyan-400 inline-block" /> CPU</span>
              <span className="flex items-center gap-1 text-emerald-400"><span className="w-2 h-0.5 bg-emerald-400 inline-block" /> RAM</span>
              <span className="flex items-center gap-1 text-amber-400"><span className="w-2 h-0.5 bg-amber-400 inline-block" /> DISK</span>
              <span className="flex items-center gap-1 text-fuchsia-400"><span className="w-2 h-0.5 bg-fuchsia-400 inline-block" /> PQC</span>
            </div>
          </div>
          <span className="text-slate-600 font-mono text-[9px]">Sampling: {refreshInterval / 1000}s rolling window</span>
        </div>

        <div className="w-full h-44">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="colorRam" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="colorDisk" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="colorPqc" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#d946ef" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#d946ef" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
              <XAxis dataKey="time" stroke="#475569" fontSize={9} tickLine={false} />
              <YAxis domain={[0, 100]} stroke="#475569" fontSize={9} tickLine={false} unit="%" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#020617', 
                  borderColor: '#1e293b', 
                  borderRadius: '4px',
                  fontSize: '10px',
                  fontFamily: 'monospace'
                }} 
              />
              <Area type="monotone" dataKey="cpu" stroke="#06b6d4" strokeWidth={1.5} fillOpacity={1} fill="url(#colorCpu)" name="CPU" />
              <Area type="monotone" dataKey="ram" stroke="#10b981" strokeWidth={1.5} fillOpacity={1} fill="url(#colorRam)" name="RAM" />
              <Area type="monotone" dataKey="disk" stroke="#f59e0b" strokeWidth={1.2} fillOpacity={1} fill="url(#colorDisk)" name="Disk" />
              <Area type="monotone" dataKey="cryptoLoad" stroke="#d946ef" strokeWidth={1.2} strokeDasharray="3 2" fillOpacity={1} fill="url(#colorPqc)" name="PQC Lattice" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
