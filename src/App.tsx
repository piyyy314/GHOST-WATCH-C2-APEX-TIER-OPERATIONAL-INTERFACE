import { useState, useEffect } from 'react';
import {
  Lure,
  LureStatus,
  ThreatEvent,
  ThreatLevel,
  NetworkNode,
  NetworkLink,
  NodeType,
  BSAUProfile,
  RiskLevel
} from './types';
import {
  INITIAL_LURES,
  INITIAL_THREATS,
  INITIAL_NODES,
  INITIAL_LINKS,
  INITIAL_BSAU_PROFILES
} from './mockData';
import { OntologyEditor } from './components/ontology';
import { ActsFactory } from './components/acts';
import { CadlManager } from './components/cadl';
import { CerberusScanner } from './components/cerberus';
import { PqcMatrix } from './components/pqc';
import { OmegaContingency } from './components/omega';
import { ShieldMonitor } from './components/shield';

import { GhostWatchBridge } from './components/ghost_watch_bridge';
import { temporalBinder } from './lib/temporal_binder';

import {
  Terminal,
  Activity,
  Layers,
  ShieldAlert,
  ShieldCheck,
  KeyRound,
  AlertOctagon,
  Clock,
  Radio,
  Cpu,
  RefreshCw,
  BellRing,
  Award
} from 'lucide-react';

export default function App() {
  // App Core States
  const [lures, setLures] = useState<Lure[]>(INITIAL_LURES);
  const [threatEvents, setThreatEvents] = useState<ThreatEvent[]>(INITIAL_THREATS);
  const [nodes, setNodes] = useState<NetworkNode[]>(INITIAL_NODES);
  const [links, setLinks] = useState<NetworkLink[]>(INITIAL_LINKS);
  const [profiles, setProfiles] = useState<BSAUProfile[]>(INITIAL_BSAU_PROFILES);
  const [rootKeyHash, setRootKeyHash] = useState('8d3f7a91ce42');
  const [isWiped, setIsWiped] = useState(false);
  const [activeTab, setActiveTab] = useState<'CONSOLE' | 'ACTS' | 'ONTOLOGY' | 'CERBERUS' | 'PQC' | 'SHIELD' | 'BRIDGE' | 'OMEGA'>('CONSOLE');

  // Real-time UTC clock offset tracker
  const [timeStr, setTimeStr] = useState('2026-05-20 16:38:39 UTC');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      // Format as YYYY-MM-DD HH:MM:SS UTC
      const yyyy = now.getUTCFullYear();
      const mm = String(now.getUTCMonth() + 1).padStart(2, '0');
      const dd = String(now.getUTCDate()).padStart(2, '0');
      const hh = String(now.getUTCHours()).padStart(2, '0');
      const min = String(now.getUTCMinutes()).padStart(2, '0');
      const ss = String(now.getUTCSeconds()).padStart(2, '0');
      setTimeStr(`${yyyy}-${mm}-${dd} ${hh}:${min}:${ss} UTC`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Action: Add Lure
  const handleAddLure = (newLure: Lure) => {
    setLures((prev) => [newLure, ...prev]);

    // Graph integration: inject new node & link into Ontology
    const newNode: NetworkNode = {
      id: `NODE_LURE_${Date.now()}`,
      label: `LURE: ${newLure.name.substring(0, 20)}...`,
      type: NodeType.LURE,
      status: 'ACTIVE',
      details: `Injected decoy for target: ${newLure.targetNode}. Base token: ${newLure.dnsToken}`,
      x: 350 + Math.random() * 100,
      y: 150 + Math.random() * 100
    };

    const newLink: NetworkLink = {
      id: `LINK_LURE_${Date.now()}`,
      source: 'NODE_CORE_C2',
      target: newNode.id,
      relationship: 'monitors'
    };

    setNodes((prev) => [...prev, newNode]);
    setLinks((prev) => [...prev, newLink]);

    // SIEM Log integration
    const newLog: ThreatEvent = {
      id: `EVT-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      level: ThreatLevel.INFO,
      source: 'Identifier Injection Engine',
      description: `Watermarked Canary Lure registered: ${newLure.id}`,
      actionTaken: `Token DNS binding generated for ${newLure.dnsToken}`
    };
    setThreatEvents((prev) => [newLog, ...prev]);
  };

  // Action: Add general Node (manual ontological mapping)
  const handleAddNode = (newNode: NetworkNode) => {
    setNodes((prev) => [...prev, newNode]);
    // Log
    const newLog: ThreatEvent = {
      id: `EVT-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      level: ThreatLevel.INFO,
      source: 'Palantir Model Engine',
      description: `Ontology object class successfully mapped: ${newNode.label}`,
      actionTaken: 'Database entity integrity check ... PASSED'
    };
    setThreatEvents((prev) => [newLog, ...prev]);
  };

  // Action: Add general Link (manual ontological relationship mapping)
  const handleAddLink = (newLink: NetworkLink) => {
    setLinks((prev) => [...prev, newLink]);
    // Log
    const newLog: ThreatEvent = {
      id: `EVT-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      level: ThreatLevel.INFO,
      source: 'Palantir Model Engine',
      description: `Synthesized link relation: Source [${newLink.source}] -> Target [${newLink.target}]`,
      actionTaken: 'Graph node matrix recalculated'
    };
    setThreatEvents((prev) => [newLog, ...prev]);
  };

  // Trigger Action on inspect
  const handleTriggerAction = (actionName: string, targetNodeId: string) => {
    const timeNow = new Date().toISOString().replace('T', ' ').slice(0, 19);
    
    // Check if rotating keys
    if (actionName === 'ForceKeyRotation') {
      const newRand = Math.floor(Math.random() * 999999).toString(16);
      setRootKeyHash(newRand);
      alert(`ML-KEM-768 Root Secret rotated successfully over LoRa 915.0 MHz mesh.`);
      const l: ThreatEvent = {
        id: `EVT-${Date.now()}`,
        timestamp: timeNow,
        level: ThreatLevel.INFO,
        source: 'PQC Core Engine',
        description: `Enforced ML-KEM Key rotation for node [${targetNodeId}]`,
        actionTaken: `NIST FIPS 203 keys updated. Hash updated to: ${newRand}`
      };
      setThreatEvents(prev => [l, ...prev]);
      return;
    }

    const newEvent: ThreatEvent = {
      id: `EVT-${Date.now()}`,
      timestamp: timeNow,
      level: ThreatLevel.CRITICAL,
      source: 'Aegis Active Interceptor',
      description: `Manual Action [${actionName}] executed against Node: [${targetNodeId}]`,
      actionTaken: actionName === 'NeutralizeSession' ? 'Connection dropped & credentials scrubbed' : 'Virtual honeypot isolation activated'
    };
    setThreatEvents((prev) => [newEvent, ...prev]);
    alert(`Kinetic Directive [${actionName}] triggered on node [${targetNodeId}]. Command packet dispatched in 915.0 MHz band.`);

    if (actionName === 'NeutralizeSession') {
      // Find and update node status
      setNodes((prev) =>
        prev.map((n) => {
          if (n.id === targetNodeId) {
            return { ...n, status: 'NEUTRALIZED', details: 'Session terminated and barred' };
          }
          return n;
        })
      );
    } else if (actionName === 'QuarantineHost') {
      setNodes((prev) =>
        prev.map((n) => {
          if (n.id === targetNodeId) {
            return { ...n, status: 'ISOLATED', details: 'Redirected to AETHER honeypot' };
          }
          return n;
        })
      );
    }
  };

  // Trigger Lure Triggered status via simulation
  const handleTriggerLure = (lureId: string) => {
    setLures((prev) =>
      prev.map((l) => {
        if (l.id === lureId) {
          return { ...l, status: LureStatus.TRIGGERED, triggeredCount: l.triggeredCount + 1, lastSeenIp: '185.220.101.5 (Tor Proxy)' };
        }
        return l;
      })
    );

    // Synchronize nodes if present
    setNodes((prev) =>
      prev.map((n) => {
        if (n.id === 'NODE_LURE_1') {
          return { ...n, status: 'TRIGGERED', details: 'Adversary exfiltration footprint captured' };
        }
        return n;
      })
    );
  };

  // Cerberus update Risk Level action
  const handleUpdateRisk = (profileId: string, riskValue: RiskLevel, newScore: number) => {
    setProfiles((prev) =>
      prev.map((p) => {
        if (p.id === profileId) {
          return {
            ...p,
            risk: riskValue,
            behaviorScore: newScore,
            assessment: `CRITICAL DETAILED ANOMALISTIC DRIFT DETECTED: Manual analysis strongly urges deployment of standard Barium Meal trap and execution of ML-KEM Key rotation.`
          };
        }
        return p;
      })
    );
  };

  // Cerberus bridge to actos
  const handleTriggerLureForOperator = (operatorName: string) => {
    setActiveTab('ACTS');
    alert(`Identifier Injection Engine calibrated for target operator: ${operatorName}`);
  };

  // Wipe operation
  const handleTriggerWipe = () => {
    setIsWiped(true);
    setLures([]);
    setThreatEvents([
      {
        id: 'SYS-WIPE',
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
        level: ThreatLevel.CRITICAL,
        source: 'HB-9982-AX-2026 Core',
        description: 'OMEGA CONTINGENCY TRIGGERED. Cryptographic elements zeroed.',
        actionTaken: 'All temporary memory frames scrubbed'
      }
    ]);
    setNodes([
      { id: "NODE_CORE_C2", label: "GW-C2 [HB-9982-AX-2026]", type: NodeType.CORE_C2, status: "COLD-ISOLATION", details: "Memory scrub complete", x: 400, y: 300 }
    ]);
    setLinks([]);
    setProfiles([]);
  };

  // Restore operation from wipe
  const handleRestoreSystem = () => {
    setIsWiped(false);
    setLures(INITIAL_LURES);
    setThreatEvents(INITIAL_THREATS);
    setNodes(INITIAL_NODES);
    setLinks(INITIAL_LINKS);
    setProfiles(INITIAL_BSAU_PROFILES);
    setRootKeyHash('7f42dce139ea');
    setActiveTab('CONSOLE');
  };

  // Calculate stats counters
  const activeLuresCount = lures.filter((l) => l.status === LureStatus.ACTIVE).length;
  const triggeredLuresCount = lures.filter((l) => l.status === LureStatus.TRIGGERED).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-slate-950 font-sans p-3 md:p-5">
      
      {/* Dynamic Cyber Header Overlay CRT style */}
      <div className="w-full max-w-7xl mx-auto flex-1 flex flex-col gap-5">
        
        {/* Global Terminal Header */}
        <header className="border border-slate-800 bg-slate-950/80 p-4 rounded flex flex-col md:flex-row md:items-center justify-between gap-3 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500"></div>
          
          <div className="flex items-center gap-3">
            <Layers className="w-7 h-7 text-emerald-400 animate-pulse shrink-0" />
            <div className="flex flex-col">
              <h1 className="font-display font-bold text-sm md:text-base tracking-widest text-emerald-300 uppercase flex items-center gap-2">
                GHOST-WATCH C2 // APEX TIER OPERATIONAL INTERFACE
              </h1>
              <span className="text-[10px] text-slate-500 font-mono tracking-wider">
                HARDWARE ANCHOR RESIDENCE ID: <span className="text-emerald-500 font-bold">{isWiped ? "SCRUBBED" : "HB-9982-AX-2026"}</span> | PLATFORM STACK: MID-2026 ACTIVE DEFENSE
              </span>
            </div>
          </div>

          {/* System status & Clock */}
          <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-slate-400">
            <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3 py-1 rounded">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>{timeStr}</span>
            </div>

            <div className={`flex items-center gap-1.5 px-3 py-1 rounded border font-bold ${
              isWiped 
                ? 'border-rose-500/50 bg-rose-950/20 text-rose-300 animate-pulse' 
                : 'border-emerald-500/30 bg-emerald-950/20 text-emerald-400'
            }`}>
              <Radio className={`w-3.5 h-3.5 ${isWiped ? '' : 'animate-ping'}`} />
              <span className="uppercase">{isWiped ? "● LOCKDOWN / COLD" : "● C2 SECURE"}</span>
            </div>
          </div>
        </header>

        {/* Dynamic C2 Stats Band */}
        {!isWiped && (
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="border border-slate-900 bg-slate-950/55 p-3 rounded flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-slate-500 font-mono text-[9px] uppercase tracking-wider">ACTIVE DECIDED LURES</span>
                <span className="font-display font-extrabold text-base md:text-lg text-emerald-400">{activeLuresCount}</span>
              </div>
              <Cpu className="w-5 h-5 text-emerald-500/50" />
            </div>

            <div className="border border-slate-900 bg-slate-950/55 p-3 rounded flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-slate-500 font-mono text-[9px] uppercase tracking-wider">CANARY INTERCEPTS</span>
                <span className="font-display font-extrabold text-base md:text-lg text-amber-400">{triggeredLuresCount}</span>
              </div>
              <Activity className="w-5 h-5 text-amber-500/50" />
            </div>

            <div className="border border-slate-900 bg-slate-950/55 p-3 rounded flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-slate-500 font-mono text-[9px] uppercase tracking-wider">PQC ROOT SCHEME</span>
                <span className="font-display font-bold text-xs text-cyan-400 uppercase select-all">ML-KEM-768</span>
              </div>
              <KeyRound className="w-5 h-5 text-cyan-500/50" />
            </div>

            <div className="border border-slate-900 bg-slate-950/55 p-3 rounded flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-slate-500 font-mono text-[9px] uppercase tracking-wider">MESH COMS FREQUENCY</span>
                <span className="font-display font-extrabold text-base md:text-lg text-fuchsia-400">915.0 MHz</span>
              </div>
              <Radio className="w-5 h-5 text-fuchsia-500/50" />
            </div>
          </section>
        )}

        {/* Horizontal Navigation Channel selector (Standard military style tabs) */}
        {!isWiped && (
          <nav className="flex flex-wrap gap-2 border-b border-slate-900 pb-2 font-mono text-xs select-none">
            <button
              id="nav-btn-console"
              onClick={() => setActiveTab('CONSOLE')}
              className={`px-4 py-2 border rounded font-bold transition-all cursor-pointer ${
                activeTab === 'CONSOLE'
                  ? 'border-emerald-500/50 bg-emerald-950/20 text-emerald-300'
                  : 'border-slate-800 bg-slate-900/10 text-slate-400 hover:border-slate-700'
              }`}
            >
              📊 Core Control Console
            </button>
            <button
              id="nav-btn-acts"
              onClick={() => setActiveTab('ACTS')}
              className={`px-4 py-2 border rounded font-bold transition-all cursor-pointer ${
                activeTab === 'ACTS'
                  ? 'border-amber-500/50 bg-amber-950/20 text-amber-300'
                  : 'border-slate-800 bg-slate-900/10 text-slate-400 hover:border-slate-700'
              }`}
            >
              ⚙️ WE-FORGE Canary Generation (ACTS)
            </button>
            <button
              id="nav-btn-ontology"
              onClick={() => setActiveTab('ONTOLOGY')}
              className={`px-4 py-2 border rounded font-bold transition-all cursor-pointer ${
                activeTab === 'ONTOLOGY'
                  ? 'border-cyan-500/50 bg-cyan-950/20 text-cyan-300'
                  : 'border-slate-800 bg-slate-900/10 text-slate-400 hover:border-slate-700'
              }`}
            >
              🌐 Palantir Ontological Target Model
            </button>
            <button
              id="nav-btn-cerberus"
              onClick={() => setActiveTab('CERBERUS')}
              className={`px-4 py-2 border rounded font-bold transition-all cursor-pointer ${
                activeTab === 'CERBERUS'
                  ? 'border-rose-500/50 bg-rose-950/20 text-rose-300'
                  : 'border-slate-800 bg-slate-900/10 text-slate-400 hover:border-slate-700'
              }`}
            >
              🐕‍🦺 Cerberus Behavior Unit (BSAU)
            </button>
            <button
              id="nav-btn-pqc"
              onClick={() => setActiveTab('PQC')}
              className={`px-4 py-2 border rounded font-bold transition-all cursor-pointer ${
                activeTab === 'PQC'
                  ? 'border-sky-500/50 bg-sky-950/20 text-sky-300'
                  : 'border-slate-800 bg-slate-900/10 text-slate-400 hover:border-slate-700'
              }`}
            >
              🛡️ Post-Quantum Crypto Matrix
            </button>
            <button
              id="nav-btn-bridge"
              onClick={() => setActiveTab('BRIDGE')}
              className={`px-4 py-2 border rounded font-bold transition-all cursor-pointer ${
                activeTab === 'BRIDGE'
                  ? 'border-cyan-500/50 bg-cyan-950/20 text-cyan-300'
                  : 'border-slate-800 bg-slate-900/10 text-slate-400 hover:border-slate-700'
              }`}
            >
              🔗 313-BIND Bridge
            </button>
            <button
              id="nav-btn-shield"
              onClick={() => setActiveTab('SHIELD')}
              className={`px-4 py-2 border rounded font-bold transition-all cursor-pointer ${
                activeTab === 'SHIELD'
                  ? 'border-rose-500/50 bg-rose-950/20 text-rose-300'
                  : 'border-slate-800 bg-slate-900/10 text-slate-400 hover:border-slate-700'
              }`}
            >
              🔒 Active Canary Shield
            </button>
            <button
              id="nav-btn-omega"
              onClick={() => setActiveTab('OMEGA')}
              className={`px-4 py-2 border rounded font-bold transition-all cursor-pointer ${
                activeTab === 'OMEGA'
                  ? 'border-rose-500/50 bg-rose-950/20 text-rose-300'
                  : 'border-slate-800 bg-slate-900/10 text-slate-400 hover:border-slate-700'
              }`}
            >
              💥 Emergency Omega Wipe
            </button>
          </nav>
        )}

        {/* Main Operational Container */}
        <main className="flex-1 min-h-[460px]">
          {isWiped ? (
            <OmegaContingency
              isWiped={isWiped}
              onTriggerWipe={handleTriggerWipe}
              onRestore={handleRestoreSystem}
            />
          ) : (
            <>
              {activeTab === 'CONSOLE' && (
                <div className="flex flex-col gap-6">
                  {/* Active CADL Engine integration within Main Console */}
                  <CadlManager
                    lures={lures}
                    onTriggerLure={handleTriggerLure}
                    onAddThreatEvent={(ev) => setThreatEvents((p) => [ev, ...p])}
                    profiles={profiles}
                  />
                </div>
              )}

              {activeTab === 'ACTS' && (
                <ActsFactory
                  lures={lures}
                  onAddLure={handleAddLure}
                />
              )}

              {activeTab === 'ONTOLOGY' && (
                <OntologyEditor
                  nodes={nodes}
                  links={links}
                  onAddNode={handleAddNode}
                  onAddLink={handleAddLink}
                  onTriggerAction={handleTriggerAction}
                />
              )}

              {activeTab === 'CERBERUS' && (
                <CerberusScanner
                  profiles={profiles}
                  onTriggerLureForOperator={handleTriggerLureForOperator}
                  onUpdateRisk={handleUpdateRisk}
                />
              )}

              {activeTab === 'PQC' && (
                <PqcMatrix
                  rootKeyHash={rootKeyHash}
                  onRotateKeys={() => {
                    const newRand = Math.floor(Math.random() * 999999).toString(16);
                    setRootKeyHash(newRand);
                  }}
                />
              )}

              {activeTab === 'SHIELD' && (
                <ShieldMonitor
                  rootKeyHash={rootKeyHash}
                  onRotateKeys={() => {
                    const newRand = Math.floor(Math.random() * 999999).toString(16);
                    setRootKeyHash(newRand);
                  }}
                  onAddThreatEvent={(ev) => setThreatEvents((p) => [ev, ...p])}
                />
              )}

              {activeTab === 'BRIDGE' && (
                <GhostWatchBridge
                  threatEvents={threatEvents}
                  onUpdateThreatEvents={setThreatEvents}
                  profiles={profiles}
                  onUpdateProfiles={setProfiles}
                  onSystemKeyRotate={() => {
                    const newRand = Math.floor(Math.random() * 999999).toString(16);
                    setRootKeyHash(newRand);
                  }}
                />
              )}

              {activeTab === 'OMEGA' && (
                <OmegaContingency
                  isWiped={isWiped}
                  onTriggerWipe={handleTriggerWipe}
                  onRestore={handleRestoreSystem}
                />
              )}
            </>
          )}
        </main>

        {/* Footer SIEM Telemetry Grid Log Block (Treads consistently on bottom of screen) */}
        {!isWiped && (
          <footer className="border border-slate-900 bg-slate-950 p-4 rounded-lg font-mono">
            <div className="flex items-center justify-between gap-2 mb-2.5 border-b border-slate-900 pb-2">
              <div className="flex items-center gap-2">
                <BellRing className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span className="font-display font-medium text-xs text-slate-300 uppercase tracking-widest">
                  Real-time active SIEM sync (LoRa telemetry)
                </span>
              </div>
              <div className="flex items-center gap-2 text-[9px]">
                <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-300 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                  313-BIND CHAIN: ACTIVE (GAP_CHECK: PASS)
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 max-h-36 overflow-y-auto pr-1">
              {threatEvents.map((evt) => {
                let textCol = 'text-slate-400';
                if (evt.level === ThreatLevel.CRITICAL) textCol = 'text-rose-400 font-bold';
                else if (evt.level === ThreatLevel.WARNING) textCol = 'text-amber-400';

                return (
                  <div
                    key={evt.id}
                    className="text-[10px] bg-slate-950/50 p-1.5 rounded border border-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-2 hover:bg-slate-900/30 font-mono"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-[9px] text-slate-600 font-semibold">{evt.timestamp}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${
                        evt.level === ThreatLevel.CRITICAL 
                          ? 'bg-rose-950 text-rose-400 border border-rose-900' 
                          : evt.level === ThreatLevel.WARNING 
                            ? 'bg-amber-950 text-amber-400 border border-amber-900' 
                            : 'bg-slate-900 text-slate-500 border border-slate-800'
                      }`}>
                        {evt.level}
                      </span>
                      {evt.bindIndex && (
                        <span className="px-1 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 text-[8px] font-bold shrink-0">
                          313-BIND:#{evt.bindIndex}
                        </span>
                      )}
                      <span className="text-[9px] text-emerald-400 uppercase select-all shrink-0">[{evt.source}]</span>
                      <span className={`truncate select-text ${textCol}`}>{evt.description}</span>
                    </div>

                    <div className="text-[9px] text-slate-500 md:text-right shrink-0 select-text">
                      <span className="text-slate-600">Action:</span> {evt.actionTaken}
                    </div>
                  </div>
                );
              })}
            </div>
          </footer>
        )}

      </div>
    </div>
  );
}
