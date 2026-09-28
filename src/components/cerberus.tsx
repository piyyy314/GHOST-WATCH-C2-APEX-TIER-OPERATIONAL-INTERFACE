import React, { useState } from 'react';
import { BSAUProfile, RiskLevel } from '../types';
import { ShieldAlert, User, Activity, CheckCircle2, AlertOctagon, Terminal, Play, Sparkles } from 'lucide-react';

interface CerberusProps {
  profiles: BSAUProfile[];
  onTriggerLureForOperator: (operatorName: string) => void;
  onUpdateRisk: (profileId: string, riskValue: RiskLevel, newScore: number) => void;
}

export const CerberusScanner: React.FC<CerberusProps> = ({
  profiles,
  onTriggerLureForOperator,
  onUpdateRisk,
}) => {
  const [selectedProfileId, setSelectedProfileId] = useState(profiles[1]?.id || '');
  const [isScanning, setIsScanning] = useState(false);
  const [scanLogs, setScanLogs] = useState<string[]>([]);
  const [scanComplete, setScanComplete] = useState(false);

  const selectedProfile = profiles.find(p => p.id === selectedProfileId);

  const getRiskColor = (risk: RiskLevel) => {
    switch (risk) {
      case RiskLevel.LOW:
        return 'text-emerald-400 border-emerald-500/30 bg-emerald-950/20';
      case RiskLevel.MID:
        return 'text-amber-400 border-amber-500/30 bg-amber-950/20';
      case RiskLevel.HIGH:
        return 'text-orange-400 border-orange-500/30 bg-orange-950/20';
      case RiskLevel.CRITICAL:
        return 'text-rose-400 border-rose-500/30 bg-rose-950/20 animate-pulse';
      default:
        return 'text-slate-400 border-slate-800 bg-slate-900/40';
    }
  };

  const executeBehavioralScan = () => {
    if (!selectedProfile) return;
    setIsScanning(true);
    setScanComplete(false);
    setScanLogs([`[BSAU] [CERBERUS] Initiating precise neural signature audit for user '${selectedProfile.operatorName}'...`]);

    setTimeout(() => {
      setScanLogs(prev => [
        ...prev,
        `[BSAU] Analyzing command history logs: captured ${selectedProfile.fileAccessCount} database operations.`,
        `[BSAU] Mapping lateral node traversals: clock speed calculated at ${selectedProfile.lateralSpeed}.`
      ]);
    }, 1000);

    setTimeout(() => {
      const entropySigma = selectedProfile.behaviorScore < 60 ? "HIGH EXTENDED DEVIATION" : "NORMALISED UNIFORM PATTERN";
      setScanLogs(prev => [
        ...prev,
        `[BSAU] Running signature alignment: standard cryptographic keystroke match ... OK`,
        `[BSAU] Checking WE-FORGE file access templates: ${entropySigma} detected.`
      ]);
    }, 2500);

    setTimeout(() => {
      // If we are scanning LAE_Node_09, we might notice it's highly malicious
      const recommendation = selectedProfile.behaviorScore < 50
        ? "CRITICAL INCIDENT PROTOCOLS RECOMMENDED: Launch structured Barium Meal Lure and inject synthetic delays."
        : "No active anomaly signatures detected. Maintain scheduled monitoring.";
      
      setScanLogs(prev => [
        ...prev,
        `[BSAU] Completed detailed behavioral profile mapping.`,
        `[BSAU] RECOMMENDATION: ${recommendation}`
      ]);
      setIsScanning(false);
      setScanComplete(true);

      // Dynamically make it even more critical if they scanned the compromised node
      if (selectedProfile.id === "BSAU-092") {
        onUpdateRisk("BSAU-092", RiskLevel.CRITICAL, 14);
      }
    }, 4500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-mono">
      {/* Operator Roster list */}
      <div className="lg:col-span-5 flex flex-col gap-4">
        <div className="border border-slate-800 bg-slate-950 p-4 rounded">
          <div className="flex items-center gap-2 border-b border-slate-900 pb-2 mb-3">
            <ShieldAlert className="w-4.5 h-4.5 text-rose-500 animate-pulse" />
            <h3 className="font-display font-medium text-slate-200 text-xs tracking-widest uppercase">
              BSAU Operator Directory
            </h3>
          </div>

          <p className="text-[10px] text-slate-500 leading-relaxed mb-4">
            Behavioral Study and Analysis Units analyze operational keystroke velocity, data manipulation frequency, and lateral migration speeds to identify potential inside threat vectors.
          </p>

          <div className="flex flex-col gap-2.5">
            {profiles.map((prof) => (
              <div
                key={prof.id}
                onClick={() => {
                  setSelectedProfileId(prof.id);
                  setScanComplete(false);
                  setScanLogs([]);
                }}
                className={`p-3 rounded border text-xs cursor-pointer select-none transition-all flex items-center justify-between ${
                  selectedProfileId === prof.id
                    ? 'border-emerald-500/50 bg-emerald-950/15'
                    : 'border-slate-900 bg-slate-900/30 hover:border-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-full bg-slate-900 border border-slate-800">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-200">{prof.operatorName}</span>
                    <span className="text-[10px] text-slate-500 uppercase">{prof.role}</span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <span className={`px-2 py-0.5 rounded border text-[9px] font-extrabold ${getRiskColor(prof.risk)}`}>
                    {prof.risk}
                  </span>
                  <span className="text-[9px] text-slate-400">Score: {prof.behaviorScore}/100</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Target Analysis Panel */}
      <div className="lg:col-span-7 flex flex-col gap-4">
        <div className="border border-slate-800 bg-slate-950 p-4 rounded flex-1 flex flex-col justify-between">
          {selectedProfile ? (
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-start border-b border-slate-900 pb-2">
                <div className="flex flex-col">
                  <span className="font-display font-medium text-slate-100 text-sm">
                    {selectedProfile.operatorName}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest mt-0.5">
                    BSAU Profile ID: {selectedProfile.id}
                  </span>
                </div>
                <button
                  id="btn-trigger-cerberus-scan"
                  onClick={executeBehavioralScan}
                  disabled={isScanning}
                  className="flex items-center gap-1.5 py-1 px-3 rounded border border-emerald-500/50 bg-emerald-950/20 text-emerald-300 hover:bg-emerald-500 hover:text-slate-950 text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5" /> Execute Keystroke Velocity Scan
                </button>
              </div>

              {/* Behavior parameters */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div className="bg-slate-900/20 border border-slate-900 p-2.5 rounded">
                  <span className="text-slate-500 block text-[9px] uppercase">Keystroke Velocity Index:</span>
                  <span className={`font-mono text-xs font-bold ${selectedProfile.behaviorScore < 50 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {selectedProfile.behaviorScore < 50 ? "ABNORMAL SPIKES" : "UNIFORM FLOW"}
                  </span>
                </div>
                <div className="bg-slate-900/20 border border-slate-900 p-2.5 rounded">
                  <span className="text-slate-500 block text-[9px] uppercase">Lateral Shift Clock:</span>
                  <span className="font-mono text-xs font-bold text-slate-300">
                    {selectedProfile.lateralSpeed}
                  </span>
                </div>
                <div className="bg-slate-900/20 border border-slate-900 p-2.5 rounded col-span-2 md:col-span-1">
                  <span className="text-slate-500 block text-[9px] uppercase">File Ingress Index:</span>
                  <span className="font-mono text-xs font-bold text-slate-300">
                    {selectedProfile.fileAccessCount} logs / session
                  </span>
                </div>
              </div>

              {/* Anomalies listed */}
              <div>
                <span className="text-slate-500 block text-[10px] uppercase mb-1 border-b border-slate-900 pb-0.5">Security Anomaly Log:</span>
                {selectedProfile.anomaliesDetected.length === 0 ? (
                  <span className="text-emerald-500/80 text-[11px] flex items-center gap-1 font-bold mt-1">
                    <CheckCircle2 className="w-4 h-4" /> Integrity check passed. Anomaly count: 0
                  </span>
                ) : (
                  <div className="flex flex-col gap-1.5 mt-1.5">
                    {selectedProfile.anomaliesDetected.map((anom, i) => (
                      <span key={i} className="text-rose-400 text-[11px] bg-rose-500/10 border border-rose-500/20 px-2 py-1 rounded flex items-center gap-1.5">
                        <AlertOctagon className="w-4 h-4 animate-pulse shrink-0" /> {anom}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Cognitive assessment notes */}
              <div>
                <span className="text-slate-500 block text-[10px] uppercase mb-1 border-b border-slate-900 pb-0.5">Deception Directive Assessment:</span>
                <p className="text-slate-300 text-[11px] lead-relaxed bg-slate-950 border border-slate-900 p-2.5 rounded">
                  {selectedProfile.assessment}
                </p>
              </div>

              {/* Trigger dynamic lure bridge */}
              {selectedProfile.risk === RiskLevel.CRITICAL || selectedProfile.risk === RiskLevel.HIGH ? (
                <div className="bg-amber-950/15 border border-amber-500/35 p-3 rounded flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-500 animate-pulse shrink-0" />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-amber-300 uppercase">Deploy Targeted WE-FORGE Canary Lure</span>
                      <span className="text-[10px] text-slate-400">Feed malicious actor customized false data to prove leak vector.</span>
                    </div>
                  </div>
                  <button
                    id="btn-bridge-to-acts"
                    onClick={() => onTriggerLureForOperator(selectedProfile.operatorName)}
                    className="py-1 px-3 bg-amber-500 text-slate-950 hover:bg-amber-400 font-bold text-xs rounded transition-all cursor-pointer whitespace-nowrap self-end md:self-center"
                  >
                    Load Counter Decoy
                  </button>
                </div>
              ) : null}

              {/* Audit Scan screen */}
              <div>
                <span className="text-slate-500 block text-[10px] uppercase mb-1">Audit execution trail:</span>
                <div className="bg-slate-950 border border-slate-900 p-3 rounded text-[10px] text-slate-400 h-28 overflow-y-auto font-mono terminal-crt">
                  {scanLogs.length === 0 ? (
                    <span className="text-slate-700 italic">No audit scan initiated.</span>
                  ) : (
                    <div className="flex flex-col gap-1">
                      {scanLogs.map((log, i) => {
                        let col = "text-slate-400";
                        if (log.includes("[BSAU] [CERBERUS]")) col = "text-cyan-400";
                        else if (log.includes("RECOMMENDATION:")) col = "text-emerald-400 font-semibold";
                        return <span key={i} className={`font-mono ${col}`}>{log}</span>;
                      })}
                      {isScanning && <span className="text-amber-400 animate-pulse font-bold">&gt;&gt; SCAN IN PROGRESS... DO NOT CYCLE TERMINAL</span>}
                    </div>
                  )}
                </div>
              </div>

            </div>
          ) : (
            <div className="text-center py-12 text-slate-500">
              Select an active network profile to begin behavioral footprint analysis.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
