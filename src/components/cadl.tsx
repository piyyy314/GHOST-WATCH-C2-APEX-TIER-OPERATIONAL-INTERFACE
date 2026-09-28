import React, { useState, useEffect, useMemo } from 'react';
import { Lure, LureStatus, ThreatEvent, ThreatLevel, BSAUProfile, RiskLevel } from '../types';
import { 
  Activity, Play, Shield, Terminal, ArrowRight, AlertTriangle, 
  Cpu, RefreshCw, Layers, Sliders, Database, Wifi, ShieldAlert, 
  Zap, Globe, Gauge, Shuffle, CheckCircle, Flame, Eye, Sparkles
} from 'lucide-react';

interface CadlProps {
  lures: Lure[];
  onTriggerLure: (lureId: string) => void;
  onAddThreatEvent: (event: ThreatEvent) => void;
  profiles?: BSAUProfile[];
}

// Sub-node definitions for AETHER Virtual Honeypot Mesh
interface AetherNode {
  id: string;
  name: string;
  ip: string;
  role: string;
  x: number;
  y: number;
  status: 'SAFE' | 'ENGAGED' | 'ISOLATING' | 'POISONING';
}

type ReconPattern = 'DIRECTORY_HARVEST' | 'QUANTUM_SNIFF' | 'API_SCRAPE' | 'LORA_WIRETAP';
type TopologyMode = 'ELASTIC_MESH' | 'DEEP_HONEYGRID' | 'SHADOW_RECURSIVE' | 'STATIC_ANCHOR';

export const CadlManager: React.FC<CadlProps> = ({ lures, onTriggerLure, onAddThreatEvent, profiles }) => {
  const [selectedLureId, setSelectedLureId] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [activeLevel, setActiveLevel] = useState<number | null>(null);
  const [stepOutput, setStepOutput] = useState<string[]>([]);
  const [isManualStep, setIsManualStep] = useState(false);
  const [isAutoScaleActive, setIsAutoScaleActive] = useState(true);

  // AETHER Honeypot States
  const [topologyMode, setTopologyMode] = useState<TopologyMode>('ELASTIC_MESH');
  const [reconPattern, setReconPattern] = useState<ReconPattern>('QUANTUM_SNIFF');
  const [aetherCpu, setAetherCpu] = useState(2);
  const [aetherPayloads, setAetherPayloads] = useState<string[]>([]);
  const [isTopologyAdapting, setIsTopologyAdapting] = useState(false);
  const [topologyMessage, setTopologyMessage] = useState<string>('Static calibration stable.');

  // Proportional Reaction settings configured by operator
  const [l1Posture, setL1Posture] = useState<'LOW_PROBING' | 'STEALTH_FINGERPRINT' | 'FULL_GEOLOCATE'>('FULL_GEOLOCATE');
  const [l2Jitter, setL2Jitter] = useState<number>(1800); // ms delay
  const [l3RerouteZone, setL3RerouteZone] = useState<'PERIMETER_A' | 'FRICTION_DMZ' | 'INNER_CORE_MAZE'>('INNER_CORE_MAZE');
  const [l4PoisonThroughput, setL4PoisonThroughput] = useState<number>(350); // MB/s
  const [l5KillTrigger, setL5KillTrigger] = useState<'AUTO_SIGKILL' | 'LORAIN_ISOLATION' | 'HARDWARE_KEY_REVOKE'>('HARDWARE_KEY_REVOKE');

  // Hardcoded sub-nodes representing virtual topography of AETHER
  const [aetherNodes, setAetherNodes] = useState<AetherNode[]>([
    { id: 'ath-gw', name: 'AETHER Edge Gateway', ip: '10.99.1.1', role: 'Transit point & firewall wrapper', x: 120, y: 100, status: 'SAFE' },
    { id: 'ath-dns', name: 'Shadow DNS Directory', ip: '10.99.1.25', role: 'Canary query collector', x: 250, y: 50, status: 'SAFE' },
    { id: 'ath-vault', name: 'Decoy Bait Vault', ip: '10.99.1.80', role: 'High-entropy synonym storage', x: 250, y: 150, status: 'SAFE' },
    { id: 'ath-lora', name: 'Mock LoRa Gateway Hub', ip: '10.99.1.104', role: 'OOB wireless mesh twin', x: 380, y: 35, status: 'SAFE' },
    { id: 'ath-cred', name: 'Spoofed Credentials Vault', ip: '10.99.1.135', role: 'Quantum entropy generator', x: 380, y: 165, status: 'SAFE' }
  ]);

  const adversaryIps = useMemo(() => [
    "185.220.101.5 (Tor Proxy)", 
    "94.23.221.14 (Targeted VPN Exit)", 
    "45.138.22.91 (Compromised Botnet node)"
  ], []);

  // Proportional Threat Escalation calculations based on Cerberus behavior scores
  const currentRiskProfile = useMemo(() => {
    if (!profiles || profiles.length === 0) return null;
    const chosenLure = lures.find(l => l.id === selectedLureId);
    if (chosenLure) {
      const targetNodeLower = chosenLure.targetNode.toLowerCase();
      // Look for a profile whose operatorName or id matches/contains targetNode
      const matched = profiles.find(p => 
        p.operatorName.toLowerCase().includes(targetNodeLower) ||
        targetNodeLower.includes(p.operatorName.toLowerCase()) ||
        p.id.toLowerCase() === targetNodeLower
      );
      if (matched) return matched;
    }
    // Fallback: search for the highest risk level profile scanned by Cerberus
    let highestProfile = profiles[0];
    for (const p of profiles) {
      if (p.behaviorScore < highestProfile.behaviorScore) {
        highestProfile = p;
      }
    }
    return highestProfile;
  }, [profiles, selectedLureId, lures]);

  // Translate Cerberus score to 0-100 risk score (where lower behavior score means higher threat risk)
  const riskScore = useMemo(() => {
    if (!currentRiskProfile) return 40; // Default baseline risk score if no profile is active
    return Math.max(0, Math.min(100, 100 - currentRiskProfile.behaviorScore));
  }, [currentRiskProfile]);

  // Dynamic defense parameters scaled proportionally by RiskScore
  const dynamicDefenseParams = useMemo(() => {
    // 1. Latency Jitter scaled proportionally: e.g. delay of 300ms to 5500ms
    const jitterVal = Math.min(6000, Math.max(300, Math.round(riskScore * 55)));
    
    // 2. Isolation Sandbox target calculated by threat severity
    const zoneVal = riskScore < 35 
      ? 'PERIMETER_A' 
      : riskScore < 65 
        ? 'FRICTION_DMZ' 
        : 'INNER_CORE_MAZE';
        
    // 3. Poison saturation rate scaled proportionally: 50MB/s to 950MB/s
    const poisonVal = Math.min(1000, Math.max(50, Math.round(riskScore * 10)));
    
    // 4. Primary strategy: grace delay/throttling vs connection drops & hard lockouts
    // If risk score >= 50, favor aggressive blockages, otherwise graceful latency lag
    const strategyVal = riskScore >= 50 
      ? 'CONNECTION_DROP & REVOCATION' 
      : 'LATENCY_INJECTION & HOVER-CONTAIN';

    return {
      jitter: jitterVal,
      zone: zoneVal,
      poisonThroughput: poisonVal,
      primaryStrategy: strategyVal
    };
  }, [riskScore]);

  // Update selected lure defaults
  useEffect(() => {
    if (selectedLureId === '' && lures.length > 0) {
      setSelectedLureId(lures[0].id);
    }
  }, [lures, selectedLureId]);

  // Real-time network topology adaptation logic (Evasion technique)
  const handleAdaptTopology = () => {
    setIsTopologyAdapting(true);
    setTopologyMessage('Recalculating AETHER routing tables, physical MAC wrappers, and link parameters...');
    
    setTimeout(() => {
      // Rotate coordinates slightly or shuffle them depending on mode
      setAetherNodes(prev => prev.map(node => {
        let modifierX = 0;
        let modifierY = 0;
        
        if (topologyMode === 'ELASTIC_MESH') {
          modifierX = (Math.random() - 0.5) * 45;
          modifierY = (Math.random() - 0.5) * 45;
        } else if (topologyMode === 'DEEP_HONEYGRID') {
          modifierX = (Math.random() - 0.5) * 70;
          modifierY = (Math.random() - 0.5) * 20;
        } else if (topologyMode === 'SHADOW_RECURSIVE') {
          // Circular rotation around center
          const angle = Math.random() * Math.PI * 2;
          const radius = 40 + Math.random() * 20;
          return {
            ...node,
            x: Math.round(250 + radius * Math.cos(angle)),
            y: Math.round(100 + radius * Math.sin(angle))
          };
        }

        // Clamp coordinates to visual viewport
        const newX = Math.max(80, Math.min(420, Math.round(node.x + modifierX)));
        const newY = Math.max(30, Math.min(170, Math.round(node.y + modifierY)));

        return { ...node, x: newX, y: newY };
      }));

      setIsTopologyAdapting(false);
      setTopologyMessage(`Adapted virtual overlay to mode [${topologyMode}]. All path bindings rotated!`);

      // Trigger standard threat warning log
      const timeNow = new Date().toISOString().replace('T', ' ').slice(0, 19);
      const ev: ThreatEvent = {
        id: `EVT-TOPOLOGY-${Date.now()}`,
        timestamp: timeNow,
        level: ThreatLevel.INFO,
        source: 'AETHER Honeypot Core',
        description: `Evasion triggered. Re-mapped physical link layout to mode: ${topologyMode}`,
        actionTaken: 'Topology scrambling complete. Adversary active trackers randomized.'
      };
      onAddThreatEvent(ev);
    }, 1200);
  };

  // Generate synthetic payload dumps based on current reconnaissance patterns
  const getSyntheticPayloadText = (pattern: ReconPattern, count: number): string => {
    const hexChars = '0123456789abcdef';
    const generateHex = (len: number) => Array.from({ length: len }, () => hexChars[Math.floor(Math.random() * 16)]).join('');
    
    switch (pattern) {
      case 'QUANTUM_SNIFF':
        return `[ML-KEM-768 CLONE TRACE] SHA-384 High-Entropy Seed Block: 0x${generateHex(32)}... verified: true. Lattice constraints: d=12, k=${Math.floor(Math.random() * 8 + 4)}. Nonce: ${generateHex(8)}`;
      case 'DIRECTORY_HARVEST':
        const files = ['manifest_rekey_master.key', 'restoration_mnemonic_plate_01.id', 'confidential_contracts.txt', 'internal_telemetry_out.sql'];
        const mockFile = files[Math.floor(Math.random() * files.length)];
        return `[WE-FORGE BYPASS] Read request on decoy path /secure/v2/home/${mockFile} - synonyms shift coefficient applied. Footprint beacon logged.`;
      case 'API_SCRAPE':
        const apis = ['/api/v2/vault/rotate-secret', '/api/v1/auth/mnemonics', '/api/cyber/acts/inject', '/api/lora/frequency/gateways'];
        return `[ROUTE SPOOF] Intruder GET ${apis[Math.floor(Math.random() * apis.length)]} -> Redirection response payload HTTP 200 OK. Body: {"key_id": "${generateHex(12)}", "entropy_factor": 7.994}`;
      case 'LORA_WIRETAP':
        return `[MESH TELEMETRY ECHO] Gateway binding ID HB-9982-AX-2026 broadcast frame: Freq=915.22MHz, SpreadingFactor=SF7, Jitter=${Math.floor(Math.random() * 10 + 5)}ms. Noise ratio injection active.`;
    }
  };

  // Run escalation sequences proportionally
  const runEscalationSequence = () => {
    if (!selectedLureId) return;
    setIsRunning(true);
    setActiveLevel(1);
    setAetherCpu(4);
    
    const chosenLure = lures.find(l => l.id === selectedLureId);
    const attackerIp = adversaryIps[Math.floor(Math.random() * adversaryIps.length)];
    const timeNow = new Date().toISOString().replace('T', ' ').slice(0, 19);

    const introMsg = isAutoScaleActive
      ? `[CADL] [LEVEL 1 MONITOR] Incident active risk profile evaluated: ${currentRiskProfile?.operatorName || 'Unknown Device'} (ID: ${currentRiskProfile?.id || 'N/A'}). Behavior score: ${currentRiskProfile?.behaviorScore || 100}/100. Calculated threat risk score: ${riskScore}/100.`
      : `[CADL] [LEVEL 1 MONITOR] Incident Sensor handshake established for target device: [${chosenLure?.targetNode || 'NODE_UNKNOWN'}]`;

    setStepOutput([introMsg]);

    // LEVEL 1: Monitor
    setTimeout(() => {
      onTriggerLure(selectedLureId);
      
      const postureText = l1Posture === 'LOW_PROBING' 
        ? 'Passive Low-Signature Audit active' 
        : l1Posture === 'STEALTH_FINGERPRINT' 
          ? 'Stealth OS and routing Fingerprinting engaged' 
          : 'High-Precision Geographic and Telco triangulation complete';

      setStepOutput(prev => [
        ...prev,
        `[CADL] [L1 MONITOR] Incident Target Lure: '${chosenLure?.name}' (ID: ${chosenLure?.id})`,
        `[CADL] [L1 MONITOR] Source actor footprint geo-mapped to IP: ${attackerIp}`,
        `[CADL] [L1 MONITOR] Resolution telemetry trace: ${postureText}`,
        `[CADL] [L1 MONITOR] Logging reconnaissance behavior pattern: [${reconPattern}]`,
        isAutoScaleActive ? `[CADL] [L1 MONITOR] [AUTOSCALER] Target strategy prioritized: ${dynamicDefenseParams.primaryStrategy}` : `[CADL] [L1 MONITOR] Standard static response triggered.`
      ]);

      const log1: ThreatEvent = {
        id: `EVT-CADL-L1-${Date.now()}`,
        timestamp: timeNow,
        level: ThreatLevel.INFO,
        source: chosenLure?.dnsToken || 'Canary Token Sensor',
        description: `Sensors triggered by ${attackerIp} under evaluation of Cerberus Risk Score ${riskScore}/100.`,
        actionTaken: 'Aggregating metadata descriptors into Palantir graph'
      };
      onAddThreatEvent(log1);

      if (isManualStep) return; // Wait for manual approval click

      // Proceed to LEVEL 2
      escalateToLevel2(attackerIp, timeNow);
    }, 1500);
  };

  const escalateToLevel2 = (attackerIp: string, timeNow: string) => {
    setActiveLevel(2);
    const activeJitter = isAutoScaleActive ? dynamicDefenseParams.jitter : l2Jitter;

    setStepOutput(prev => [
      ...prev,
      `[CADL] [LEVEL 2] Escalating active tactical delay countermeasures.`,
      isAutoScaleActive 
        ? `[CADL] [L2 DELAY] [AUTOSCALER ACTIVE] Proportional latency injected: ${activeJitter}ms (Scaled on index score ${riskScore})`
        : `[CADL] [L2 DELAY] Active Jitter Injection active: Delay parameter set to manual standard ${activeJitter}ms.`,
      `[CADL] [L2 DELAY] Artificially degrading socket packet flow. Exfiltration speed throttled by 99.1%.`,
      `[CADL] [L2 DELAY] Adversary automated scraping tool rate-limited to 0.5 queries/sec.`
    ]);

    setAetherNodes(prev => prev.map(n => n.id === 'ath-gw' ? { ...n, status: 'ENGAGED' } : n));

    if (isManualStep) return;

    setTimeout(() => {
      escalateToLevel3(attackerIp, timeNow);
    }, 2000);
  };

  const escalateToLevel3 = (attackerIp: string, timeNow: string) => {
    setActiveLevel(3);
    setAetherCpu(38);
    
    const activeZone = isAutoScaleActive ? dynamicDefenseParams.zone : l3RerouteZone;
    const zoneName = activeZone === 'PERIMETER_A' 
      ? 'AETHER Isolated Shadow Boundary Zone' 
      : activeZone === 'FRICTION_DMZ' 
        ? 'AETHER High-Entropy Buffer Friction DMZ' 
        : 'AETHER Autonomous Deep Infinite-Friction Vault Core';

    setStepOutput(prev => [
      ...prev,
      `[CADL] [LEVEL 3] Ontology rule threshold surpassed: Sandbox Rerouting engaged.`,
      isAutoScaleActive
        ? `[CADL] [L3 REROUTE] [AUTOSCALER ACTIVE] Cerberus risk category prompts deployment of zone: [${activeZone}]`
        : `[CADL] [L3 REROUTE] Redirecting to default manual isolation sector: [${activeZone}]`,
      `[CADL] [L3 REROUTE] Target honeypot environments: [${zoneName}] established.`,
      `[CADL] [L3 REROUTE] Attacker shell seamless handshake redirected into sandboxed wrapper.`
    ]);

    setAetherNodes(prev => prev.map(n => {
      if (n.id === 'ath-dns' || n.id === 'ath-gw') return { ...n, status: 'ENGAGED' };
      return n;
    }));

    setAetherPayloads([
      getSyntheticPayloadText(reconPattern, 1),
      getSyntheticPayloadText(reconPattern, 2)
    ]);

    const log2: ThreatEvent = {
      id: `EVT-CADL-L3-${Date.now()}`,
      timestamp: timeNow,
      level: ThreatLevel.WARNING,
      source: attackerIp,
      description: `Rerouted threat signature to AETHER honeypot target [${activeZone}] based on calibrated risks.`,
      actionTaken: 'Traffic seamlessly isolated from production database.'
    };
    onAddThreatEvent(log2);

    if (isManualStep) return;

    setTimeout(() => {
      escalateToLevel4(attackerIp, timeNow);
    }, 2000);
  };

  const escalateToLevel4 = (attackerIp: string, timeNow: string) => {
    setActiveLevel(4);
    setAetherCpu(88);
    
    const activePoison = isAutoScaleActive ? dynamicDefenseParams.poisonThroughput : l4PoisonThroughput;

    setStepOutput(prev => [
      ...prev,
      `[CADL] [LEVEL 4] Initiating dynamic payload degradation & entropy trap execution.`,
      `[CADL] [L4 DEGRADE] Activating High-Entropy PQC Synthetic Injector.`,
      isAutoScaleActive
        ? `[CADL] [L4 DEGRADE] [AUTOSCALER ACTIVE] Siphoning false data payloads at risk-proportional rate: ${activePoison} MB/sec (Saturating link)`
        : `[CADL] [L4 DEGRADE] Siphoning fake data payloads at standard configured rate: ${activePoison} MB/sec.`,
      `[CADL] [L4 DEGRADE] Injecting customized dummy structures tailored to adversary strategy: [${reconPattern}].`,
      `[CADL] [L4 DEGRADE] Exhausting adversary decryption compute. Entropy rating: 7.998 bits.`
    ]);

    setAetherNodes(prev => prev.map(n => {
      if (n.id === 'ath-vault' || n.id === 'ath-cred') return { ...n, status: 'POISONING' };
      return { ...n, status: 'ENGAGED' };
    }));

    setAetherPayloads(prev => [
      ...prev,
      `[INJECTION STREAM] ${activePoison} MB/sec pipeline initialized...`,
      getSyntheticPayloadText(reconPattern, 3),
      getSyntheticPayloadText(reconPattern, 4),
      `[POI-SATURATION] Saturated actor analytics buffers with pseudorandom dummy blocks.`
    ]);

    if (isManualStep) return;

    setTimeout(() => {
      escalateToLevel5(attackerIp, timeNow);
    }, 2500);
  };

  const escalateToLevel5 = (attackerIp: string, timeNow: string) => {
    setActiveLevel(5);
    setAetherCpu(0);

    const activeTriggerText = l5KillTrigger === 'AUTO_SIGKILL'
      ? 'Forced Host socket PID SIGKILL dispatch'
      : l5KillTrigger === 'LORAIN_ISOLATION'
        ? 'LoRa Gateway out-of-band sector drop & mesh null-routing'
        : 'Sovereign hybrid hardware key revocation (ML-KEM/ML-DSA root shift)';

    const dynamicDropTriggerText = isAutoScaleActive && riskScore >= 50
      ? `AUTO_CONNECTION_DROP & HARSH_REVOCATION (Escalated on Cerberus score ${riskScore}/100)`
      : activeTriggerText;

    setStepOutput(prev => [
      ...prev,
      `[CADL] [LEVEL 5] THREAT CONTAINMENT CRITICAL: Forceful drop and neutralization engaged.`,
      `[CADL] [L5 NEUTRALIZE] Executing dynamic policy: ${dynamicDropTriggerText}`,
      `[CADL] [L5 NEUTRALIZE] Issuing direct physical firewall block and gateway embargo.`,
      `[CADL] [L5 NEUTRALIZE] Automated intercept completed successfully. Exfiltration potential REDUCED to 0.00%.`,
      `[CADL] [SYS-STATUS] Threat isolated. Secure root integrity re-established.`
    ]);

    setAetherNodes(prev => prev.map(node => ({ ...node, status: 'SAFE' })));

    const log3: ThreatEvent = {
      id: `EVT-CADL-L5-${Date.now()}`,
      timestamp: timeNow,
      level: ThreatLevel.CRITICAL,
      source: 'AETHER Neutralizer Control',
      description: `Target neutralized via dynamic escalation. Session terminated permanently.`,
      actionTaken: 'Interceptors stood down. Firewall block active.'
    };
    onAddThreatEvent(log3);
    setIsRunning(false);
  };

  // Helper styles for CADL stage cards 
  const getLevelStyle = (lvl: number) => {
    if (activeLevel === null) return 'border-slate-850 bg-slate-950/40 text-slate-500';
    if (activeLevel === lvl) {
      if (lvl === 5) return 'border-rose-500/80 bg-rose-950/20 text-rose-300 ring-1 ring-rose-500/50 animate-pulse';
      if (lvl === 4) return 'border-fuchsia-500/80 bg-fuchsia-950/20 text-fuchsia-300 ring-1 ring-fuchsia-500/50';
      return 'border-amber-500 bg-amber-950/20 text-amber-300 ring-1 ring-amber-500/40';
    }
    if (activeLevel > lvl) return 'border-emerald-500/45 bg-emerald-950/10 text-emerald-400';
    return 'border-slate-900 bg-slate-950/10 text-slate-700';
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 font-mono">
      {/* 1. Configuration Panel - Column Left (5 Span) */}
      <div className="xl:col-span-5 flex flex-col gap-5">
        
        {/* Honeypot & Reconnaissance Evasion configuration */}
        <div className="border border-slate-800 bg-slate-950 p-4 rounded-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-1 bg-slate-900 border-l border-b border-slate-800 rounded-bl">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          
          <div className="flex items-center gap-2 border-b border-slate-900 pb-2.5 mb-3.5">
            <Sliders className="w-4.5 h-4.5 text-cyan-400" />
            <h3 className="font-display font-medium text-slate-200 text-xs tracking-wider uppercase">
              AETHER Honeypot & Evasion Controller
            </h3>
          </div>

          <p className="text-[10.5px] text-slate-500 leading-relaxed mb-4">
            AETHER is a dynamic cloud-twin decoy sandbox. Calibrate the adversary reconnaissance sensors and topology morph parameters to deploy advanced proactive defences.
          </p>

          <div className="flex flex-col gap-3.5 text-xs">
            {/* Choose Trigger Decoy */}
            <div>
              <label className="text-slate-405 block mb-1 text-[11px] font-semibold text-slate-400">Select Target Canary Decoy (Activator)</label>
              <select
                id="select-simulation-lure"
                value={selectedLureId}
                onChange={(e) => setSelectedLureId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-slate-200 focus:outline-none focus:border-cyan-500 cursor-pointer text-xs"
              >
                <option value="">-- Select Active Canary --</option>
                {lures.map(l => (
                  <option key={l.id} value={l.id}>{l.name} [{l.status}]</option>
                ))}
              </select>
            </div>

            {/* Adversary Reconnaissance Strategy */}
            <div>
              <label className="text-slate-400 block mb-1 text-[11px] font-semibold">Adversary Reconnaissance Pattern</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  id="recon-btn-quant"
                  type="button"
                  onClick={() => setReconPattern('QUANTUM_SNIFF')}
                  className={`p-2 border rounded text-left transition-colors cursor-pointer ${
                    reconPattern === 'QUANTUM_SNIFF'
                      ? 'border-fuchsia-500 bg-fuchsia-950/20 text-fuchsia-300'
                      : 'border-slate-800 bg-slate-900 hover:border-slate-700 text-slate-400'
                  }`}
                >
                  <p className="font-bold text-[10px]">Quantum Harvest</p>
                  <span className="text-[8.5px] opacity-70 block leading-tight">Key space sniffing</span>
                </button>

                <button
                  id="recon-btn-dir"
                  type="button"
                  onClick={() => setReconPattern('DIRECTORY_HARVEST')}
                  className={`p-2 border rounded text-left transition-colors cursor-pointer ${
                    reconPattern === 'DIRECTORY_HARVEST'
                      ? 'border-amber-500 bg-amber-950/20 text-amber-300'
                      : 'border-slate-800 bg-slate-900 hover:border-slate-700 text-slate-400'
                  }`}
                >
                  <p className="font-bold text-[10px]">Dir Harvesting</p>
                  <span className="text-[8.5px] opacity-70 block leading-tight">Canary file lookups</span>
                </button>

                <button
                  id="recon-btn-scrape"
                  type="button"
                  onClick={() => setReconPattern('API_SCRAPE')}
                  className={`p-2 border rounded text-left transition-colors cursor-pointer ${
                    reconPattern === 'API_SCRAPE'
                      ? 'border-cyan-500 bg-cyan-950/20 text-cyan-300'
                      : 'border-slate-800 bg-slate-900 hover:border-slate-700 text-slate-400'
                  }`}
                >
                  <p className="font-bold text-[10px]">API/Registry Scraping</p>
                  <span className="text-[8.5px] opacity-70 block leading-tight">Crawling system paths</span>
                </button>

                <button
                  id="recon-btn-lora"
                  type="button"
                  onClick={() => setReconPattern('LORA_WIRETAP')}
                  className={`p-2 border rounded text-left transition-colors cursor-pointer ${
                    reconPattern === 'LORA_WIRETAP'
                      ? 'border-sky-500 bg-sky-950/20 text-sky-300'
                      : 'border-slate-800 bg-slate-900 hover:border-slate-700 text-slate-400'
                  }`}
                >
                  <p className="font-bold text-[10px]">LoRa Wiretapping</p>
                  <span className="text-[8.5px] opacity-70 block leading-tight">Over-the-air packet snooping</span>
                </button>
              </div>
            </div>

            {/* Real-time Network Topology Adaptation Mode Selection */}
            <div className="border-t border-slate-900 pt-3.5 mt-1">
              <div className="flex items-center justify-between mb-2">
                <label className="text-slate-300 block text-[11px] font-semibold">Real-Time Evasion Adaptation Matrix</label>
                <span className="text-[8px] bg-cyan-500/10 text-cyan-400 px-1.5 py-0.5 rounded uppercase font-bold animate-pulse">Evasion Module</span>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <select
                  id="select-topology-mode"
                  value={topologyMode}
                  onChange={(e) => setTopologyMode(e.target.value as TopologyMode)}
                  className="bg-slate-900 border border-slate-800 rounded p-1.5 text-slate-200 focus:outline-none focus:border-cyan-500 cursor-pointer text-xs col-span-2"
                >
                  <option value="ELASTIC_MESH">Elastic Decoy Mesh (Micro-Scrambling nodes)</option>
                  <option value="DEEP_HONEYGRID">Frictional Deep Honeygrid (Linear shift coordinate system)</option>
                  <option value="SHADOW_RECURSIVE">Shadow Recursive Ghosting (Circular dynamic orbits)</option>
                  <option value="STATIC_ANCHOR">Static Target Anchor (Unshifted original mapping)</option>
                </select>
              </div>

              <button
                id="btn-adapt-topology"
                type="button"
                onClick={handleAdaptTopology}
                disabled={isTopologyAdapting}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 border border-cyan-500/40 bg-cyan-950/10 hover:bg-cyan-500 text-cyan-300 hover:text-slate-950 text-[11px] font-bold rounded transition-colors cursor-pointer select-none"
              >
                <Shuffle className={`w-3.5 h-3.5 ${isTopologyAdapting ? 'animate-spin' : ''}`} />
                Scramble Virtual Topology overlay map (Adapt Routing)
              </button>
              <span className="text-[8.5px] block text-slate-500 italic mt-1.5 text-center truncate uppercase">
                {topologyMessage}
              </span>
            </div>
          </div>
        </div>

        {/* Proportional threat escalation rules configuration panel */}
        <div className="border border-slate-800 bg-slate-950 p-4 rounded-lg flex flex-col gap-3.5">
          <div className="flex items-center gap-2 border-b border-slate-900 pb-2 mb-1">
            <Zap className="w-4 h-4 text-amber-400" />
            <h4 className="font-display font-medium text-xs text-slate-200 uppercase tracking-widest">
              Proportional Defensive Constraints
            </h4>
          </div>

          <p className="text-[10px] text-slate-500 leading-normal">
            Fine-tune physical intercept settings for proportional reaction response bounds corresponding to CADL levels.
          </p>

          <div className="flex flex-col gap-3 text-xs leading-normal">
            
            {/* L1 & L2 settings */}
            <div className="grid grid-cols-2 gap-3.5">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">L1 Logging Pose</label>
                <select
                  id="select-l1-posture"
                  value={l1Posture}
                  onChange={(e) => setL1Posture(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-800 rounded p-1 text-[11px] text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  <option value="LOW_PROBING">Stealth probing audit</option>
                  <option value="STEALTH_FINGERPRINT">OS payload signature ID</option>
                  <option value="FULL_GEOLOCATE">Triangulate IP coordinates</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1">L2 Feedback Lag</label>
                <select
                  id="select-l2-jitter"
                  value={l2Jitter}
                  onChange={(e) => setL2Jitter(parseInt(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded p-1 text-[11px] text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  <option value="500">500ms jitter lag (Low)</option>
                  <option value="1800">1800ms jitter lag (Proportional)</option>
                  <option value="4500">4500ms complete lock-delay</option>
                </select>
              </div>
            </div>

            {/* L3 & L4 settings */}
            <div className="grid grid-cols-2 gap-3.5">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">L3 Isolation Sector</label>
                <select
                  id="select-l3-zone"
                  value={l3RerouteZone}
                  onChange={(e) => setL3RerouteZone(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-800 rounded p-1 text-[11px] text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="PERIMETER_A">Boundary perimeter</option>
                  <option value="FRICTION_DMZ">Friction DMZ buffer</option>
                  <option value="INNER_CORE_MAZE">Infinite-Friction Core</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1">L4 Poison Rate</label>
                <select
                  id="select-l4-poison"
                  value={l4PoisonThroughput}
                  onChange={(e) => setL4PoisonThroughput(parseInt(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded p-1 text-[11px] text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="50">50 MB/sec stream</option>
                  <option value="350">350 MB/sec saturate</option>
                  <option value="850">850 MB/sec peak flood</option>
                </select>
              </div>
            </div>

            {/* L5 neutralizer settings */}
            <div>
              <label className="text-[10px] text-slate-400 block mb-1">L5 CITRON TREE Sovereign Lockdown Trigger</label>
              <select
                id="select-l5-trigger"
                value={l5KillTrigger}
                onChange={(e) => setL5KillTrigger(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-800 rounded p-1 text-[11px] text-slate-200 focus:outline-none focus:border-rose-500"
              >
                <option value="AUTO_SIGKILL">Automated target task SIGKILL dispatch</option>
                <option value="LORAIN_ISOLATION">OOB LoRa telemetry sector isolation null-route</option>
                <option value="HARDWARE_KEY_REVOKE">Lattice Hardware Cryptographic Revocation Key Rotation</option>
              </select>
            </div>

          </div>
        </div>
      </div>

      {/* 2. Interactive Operational Monitor Console - Column Right (7 Span) */}
      <div className="xl:col-span-7 flex flex-col gap-4">
        
        {/* Interactive Defense Stepper & Control */}
        <div className="border border-slate-800 bg-slate-950 p-4 rounded-lg flex flex-col gap-4 flex-1">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-900 pb-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-emerald-400" />
              <span className="font-display font-medium text-xs text-slate-200 uppercase tracking-wider">
                CADL Interactive Shield Escalation Engine
              </span>
            </div>

            {/* Control Toggles: Cerberus Auto-Scale vs Manual Step */}
            <div className="flex flex-wrap items-center gap-4 bg-slate-900/50 border border-slate-800 rounded px-2.5 py-1 text-[11px]">
              <div className="flex items-center gap-1.5 cursor-pointer select-none" onClick={() => setIsAutoScaleActive(!isAutoScaleActive)}>
                <input
                  id="checkbox-cerberus-autoscale"
                  type="checkbox"
                  checked={isAutoScaleActive}
                  onChange={() => {}} // toggled on div click
                  className="accent-cyan-500 pointer-events-none"
                />
                <span className="text-cyan-400 font-bold">Cerberus Proportional Auto-Scale</span>
              </div>
              <div className="flex items-center gap-1.5 cursor-pointer select-none" onClick={() => setIsManualStep(!isManualStep)}>
                <input
                  id="checkbox-manual-escalation"
                  type="checkbox"
                  checked={isManualStep}
                  onChange={() => {}} // toggled on div click
                  className="accent-emerald-500 pointer-events-none"
                />
                <span className="text-slate-400 font-bold">Manual Step Override</span>
              </div>
            </div>
          </div>

          {/* Stepper display bar for the five standard levels */}
          <div className="grid grid-cols-5 gap-2 select-none">
            {[
              { lvl: 1, label: 'L1 Monitor', desc: isAutoScaleActive ? `Risk: ${riskScore}/100` : 'Fingerprinting active' },
              { lvl: 2, label: 'L2 Delay', desc: isAutoScaleActive ? `${dynamicDefenseParams.jitter}ms delay` : `${l2Jitter}ms jitter rate` },
              { lvl: 3, label: 'L3 Reroute', desc: isAutoScaleActive ? `Zone: ${dynamicDefenseParams.zone}` : 'Sinks to AETHER shadow' },
              { lvl: 4, label: 'L4 Poison', desc: isAutoScaleActive ? `${dynamicDefenseParams.poisonThroughput}MB/s flood` : `${l4PoisonThroughput}MB/s stream` },
              { lvl: 5, label: 'L5 Ban', desc: isAutoScaleActive ? (riskScore >= 50 ? 'Hard Drop' : 'Jitter Hold') : 'Citron Terminal' }
            ].map(({ lvl, label, desc }) => (
              <div 
                key={lvl} 
                className={`border p-2 rounded flex flex-col items-center text-center justify-between text-[10px] min-h-[60px] transition-all duration-300 ${getLevelStyle(lvl)}`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-extrabold text-xs">0{lvl}</span>
                  {activeLevel !== null && activeLevel === lvl && (
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping inline-block" />
                  )}
                  {activeLevel !== null && activeLevel > lvl && (
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  )}
                </div>
                <div className="flex flex-col mt-1">
                  <span className="font-bold tracking-tight uppercase leading-tight">{label}</span>
                  <span className="text-[8px] opacity-75 leading-tight truncate max-w-[100px]">{desc}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Active Cerberus Threat Profiler feedback block */}
          {isAutoScaleActive && (
            <div className="border border-cyan-500/30 bg-cyan-950/10 p-3 rounded flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-cyan-950 border border-cyan-500/40 text-cyan-400 rounded-full animate-pulse">
                  <Gauge className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-slate-200">
                    Active Audit Threat Node: <span className="text-cyan-300 font-mono text-[11px] select-all">{currentRiskProfile?.operatorName || 'System Baselined'}</span>
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    Scanned Behavior Risk: <span className="text-rose-400 font-bold">{riskScore}/100</span> | Core Mode: <span className="text-cyan-400 font-bold uppercase">{dynamicDefenseParams.primaryStrategy}</span>
                  </span>
                </div>
              </div>

              {/* Proportional Defense Details */}
              <div className="flex items-center gap-4 text-[10px] bg-slate-950/75 border border-slate-900 rounded p-1.5 font-mono">
                <div className="flex flex-col">
                  <span className="text-slate-500">SCALED JITTER</span>
                  <span className="text-amber-400 font-bold">{dynamicDefenseParams.jitter}ms</span>
                </div>
                <div className="h-6 w-px bg-slate-950" />
                <div className="flex flex-col">
                  <span className="text-slate-500">TARGET ZONE</span>
                  <span className="text-cyan-400 font-bold uppercase">{dynamicDefenseParams.zone}</span>
                </div>
                <div className="h-6 w-px bg-slate-950" />
                <div className="flex flex-col">
                  <span className="text-slate-500">FLOOD RATE</span>
                  <span className="text-fuchsia-400 font-bold">{dynamicDefenseParams.poisonThroughput}MB/s</span>
                </div>
              </div>
            </div>
          )}

          {/* Core Handshake Log output screen */}
          <div className="relative flex-1 flex flex-col">
            <div className="flex items-center justify-between bg-slate-900 px-3 py-1.5 border border-slate-800 border-b-0 rounded-t text-[10px] text-slate-400">
              <span className="font-semibold text-cyan-400"># ACTIVE CYBER TELEMETRY FEED</span>
              {isRunning && (
                <div className="flex items-center gap-1 text-rose-450 text-[9px] animate-pulse">
                  <RefreshCw className="w-2.5 h-2.5 animate-spin" /> RUNNING INTERCEPT
                </div>
              )}
            </div>
            
            <div className="bg-slate-950 border border-slate-800 p-3 rounded-b text-xs leading-relaxed text-slate-300 overflow-y-auto h-52 font-mono terminal-crt select-text mb-2 border-t-0">
              {stepOutput.length === 0 ? (
                <div className="flex h-full flex-col gap-2 items-center justify-center text-slate-600 italic text-center p-4">
                  <Activity className="w-7 h-7 text-slate-800 animate-pulse" />
                  <span>Awaiting Canary activation anomaly... Select an active lure on the left and click 'Launch Intrusion Simulation' to test dynamic defense.</span>
                </div>
              ) : (
                <div className="flex flex-col gap-1.5">
                  {stepOutput.map((log, index) => {
                    let logColor = "text-slate-350";
                    if (log.includes("[LEVEL 1]") || log.includes("[L1")) logColor = "text-emerald-400";
                    else if (log.includes("[LEVEL 2]") || log.includes("[L2")) logColor = "text-amber-400";
                    else if (log.includes("[LEVEL 3]") || log.includes("[L3")) logColor = "text-cyan-400";
                    else if (log.includes("[LEVEL 4]") || log.includes("[L4")) logColor = "text-fuchsia-400";
                    else if (log.includes("[LEVEL 5]") || log.includes("[L5") || log.includes("[SYS-STATUS")) logColor = "text-rose-405 font-bold text-rose-300";

                    return (
                      <div key={index} className={`font-mono text-[10.5px] leading-relaxed flex items-start gap-1 ${logColor}`}>
                        <span className="text-slate-600 select-none">&gt;&gt;</span>
                        <span className="select-text">{log}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Launch actions */}
            <div className="flex gap-2">
              <button
                id="btn-simulate-intrusion"
                onClick={runEscalationSequence}
                disabled={isRunning || !selectedLureId}
                className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded border border-rose-500/40 bg-rose-950/20 hover:bg-rose-500 text-rose-300 hover:text-slate-950 font-bold transition-all disabled:opacity-50 cursor-pointer text-xs uppercase"
              >
                <Flame className="w-4 h-4 mb-0.5 animate-pulse text-rose-400 hover:text-slate-950" />
                Launch Dynamic Intrusion Response
              </button>

              {isManualStep && isRunning && activeLevel !== null && activeLevel < 5 && (
                <button
                  id="btn-manual-authorize-step"
                  onClick={() => {
                    const chosenLure = lures.find(l => l.id === selectedLureId);
                    const attackerIp = adversaryIps[0];
                    const nextLvl = (activeLevel + 1);
                    const timeNow = new Date().toISOString().replace('T', ' ').slice(0, 19);
                    
                    setStepOutput(prev => [...prev, `[MANUAL_OVERRIDE] Authorized step escalation manually. Calibrating Level: 0${nextLvl}...`]);
                    if (nextLvl === 2) escalateToLevel2(attackerIp, timeNow);
                    else if (nextLvl === 3) escalateToLevel3(attackerIp, timeNow);
                    else if (nextLvl === 4) escalateToLevel4(attackerIp, timeNow);
                    else if (nextLvl === 5) escalateToLevel5(attackerIp, timeNow);
                  }}
                  className="px-4 py-2 border border-amber-500 bg-amber-950/10 text-amber-300 rounded font-bold text-xs hover:bg-amber-500 hover:text-slate-950 cursor-pointer transition-colors"
                >
                  Authorize Step L0{(activeLevel + 1)} &gt;&gt;
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 3. AETHER Shadow Honeypot and Live SVG Topology Adapter Map */}
        <div className="border border-slate-800 bg-slate-950 p-4 rounded-lg flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-slate-900 pb-2">
            <div className="flex items-center gap-2">
              <Cpu className="w-4.5 h-4.5 text-fuchsia-400" />
              <h4 className="font-display font-medium text-xs text-slate-200 uppercase tracking-widest">
                AETHER EVASION TOPOLOGY ADAPTER & RECON FEED
              </h4>
            </div>
            <span className="text-[10px] text-slate-500 font-mono text-[9px] flex items-center gap-1.5">
              ACTIVE MATRIX: {activeLevel !== null && activeLevel >= 3 
                ? <span className="text-rose-400 font-bold animate-pulse uppercase flex items-center gap-1 select-none"><Globe className="w-3 h-3 text-rose-400 animate-spin" /> ATTACKER TRAPPED</span> 
                : <span className="text-slate-600 uppercase">CALIBRATED COLD</span>
              }
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            
            {/* Visual Vector SVG Topopology Map */}
            <div className="md:col-span-5 bg-slate-950 border border-slate-900 rounded p-2.5 flex flex-col justify-between relative overflow-hidden select-none min-h-[170px]">
              <div className="absolute top-1 left-2 font-mono text-[8px] text-slate-500 uppercase tracking-wider">
                AETHER deciduos mesh (SVG model)
              </div>

              {/* Live drawing map of simulated routing topology */}
              <div className="w-full flex-1 mt-3">
                <svg width="100%" height="130" viewBox="0 0 500 200" className="opacity-90 overflow-visible">
                  {/* Drawing adaptive connectivity paths */}
                  <g stroke="#3f3f46" strokeWidth="1" strokeDasharray="3 3">
                    {aetherNodes.map((n1, i) => 
                      aetherNodes.slice(i + 1).map((n2) => (
                        <line 
                          key={`${n1.id}-${n2.id}`} 
                          x1={n1.x} 
                          y1={n1.y} 
                          x2={n2.x} 
                          y2={n2.y} 
                          className={
                            activeLevel !== null && activeLevel >= 3 && 
                            n1.status !== 'SAFE' && n2.status !== 'SAFE'
                              ? 'stroke-cyan-500/60 stroke-[1.5]'
                              : 'stroke-slate-800'
                          }
                        />
                      ))
                    )}
                  </g>

                  {/* Highlight dynamic tunnel reroute line inside AETHER sandbox once redirected */}
                  {activeLevel !== null && activeLevel >= 3 && (
                    <g>
                      {/* Interactive exfiltration trail representing traffic going through AETHER Edges */}
                      <path 
                        d={`M 15 ${100} Q 50 ${60}, ${aetherNodes[0].x} ${aetherNodes[0].y} T ${aetherNodes[2].x} ${aetherNodes[2].y}`}
                        fill="transparent"
                        stroke="#f43f5e"
                        strokeWidth="2"
                        strokeDasharray="4 4"
                        className="animate-[dash_2s_linear_infinite]"
                      />
                      {/* Red pulse on initial entry node */}
                      <circle cx="15" cy="100" r="4" fill="#ef4444" className="animate-ping" />
                      <circle cx="15" cy="100" r="3.5" fill="#f43e5e" />
                      <text x="3" y="125" fill="#ef4444" fontSize="9" fontFamily="monospace">Intruder Link</text>
                    </g>
                  )}

                  {/* Draw Nodes coordinates */}
                  {aetherNodes.map((node) => {
                    let nodeColor = 'fill-[#475569]'; // standard safe gray
                    let strokeColor = 'stroke-slate-700';
                    let labelColor = 'fill-slate-400';
                    let outerPulse = null;

                    if (node.status === 'ENGAGED') {
                      nodeColor = 'fill-cyan-500';
                      strokeColor = 'stroke-cyan-400';
                      labelColor = 'fill-cyan-300';
                      outerPulse = <circle cx={node.x} cy={node.y} r="8" fill="transparent" stroke="#22d3ee" strokeWidth="1" className="animate-ping" />;
                    } else if (node.status === 'POISONING') {
                      nodeColor = 'fill-fuchsia-500';
                      strokeColor = 'stroke-fuchsia-450';
                      labelColor = 'fill-fuchsia-300';
                      outerPulse = <circle cx={node.x} cy={node.y} r="9" fill="transparent" stroke="#df00df" strokeWidth="1" className="animate-ping" />;
                    }

                    return (
                      <g key={node.id} className="transition-transform duration-500">
                        {outerPulse}
                        <circle cx={node.x} cy={node.y} r="5" className={`${nodeColor} ${strokeColor} stroke-2`} />
                        <text 
                          x={node.x} 
                          y={node.y - 10} 
                          textAnchor="middle" 
                          fontSize="9" 
                          fontWeight="bold"
                          className={`${labelColor} select-none pointer-events-none`}
                        >
                          {node.id.toUpperCase()}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Status footer for adapter graph */}
              <div className="text-[8px] text-slate-500 border-t border-slate-900 pb-0.5 mt-1 flex justify-between uppercase">
                <span>Adapter Matrix Mode: {topologyMode}</span>
                <span className="text-cyan-400">PQC Resilient: ML-KEM</span>
              </div>
            </div>

            {/* Simulated Live Recon Feed and data poison logs */}
            <div className="md:col-span-7 bg-slate-950 border border-slate-900 p-3 rounded text-[10px] flex flex-col justify-between min-h-[170px]">
              <div>
                <span className="text-slate-500 block mb-1.5 border-b border-slate-900 pb-1 uppercase font-bold text-[9px] tracking-widest text-fuchsia-400 flex items-center justify-between">
                  <span>PQC Synthetic Decoy Data Generator Stream</span>
                  {activeLevel !== null && activeLevel === 4 && (
                    <span className="animate-pulse text-fuchsia-400">STREAMING ACTIVE</span>
                  )}
                </span>
                <div className="flex flex-col gap-1.5 max-h-24 overflow-y-auto pr-1">
                  {aetherPayloads.length === 0 ? (
                    <span className="text-slate-700 italic block py-2 text-center text-[9.5px]">
                      Honeypot buffer empty. Triggers are armed. Run intrusion simulation to engage synthetic data injectors.
                    </span>
                  ) : (
                    aetherPayloads.map((payload, i) => (
                      <div key={i} className="flex flex-col bg-slate-900/40 p-2 rounded border border-slate-900 gap-1 select-all font-mono">
                        <span className="text-[9.5px] leading-relaxed text-fuchsia-300 block font-light">
                          {payload}
                        </span>
                        {payload.includes('SHA-') && (
                          <div className="flex justify-between items-center text-[8px] text-slate-500 border-t border-slate-900/80 pt-1 mt-0.5">
                            <span>Calculated Entropy: <strong className="text-emerald-400">7.994 bits</strong></span>
                            <span>Sign: verified C2</span>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Dynamically updating Exfiltration Metrics */}
              <div className="pt-2 border-t border-slate-900 mt-2 flex flex-col gap-1 text-[9px]">
                <div className="flex justify-between text-slate-400">
                  <span>Decoy Data Poison Flooding:</span>
                  <span className={activeLevel !== null && activeLevel >= 4 ? 'text-fuchsia-400 font-bold' : 'text-slate-600'}>
                    {activeLevel !== null && activeLevel >= 4 ? `${l4PoisonThroughput} MB/sec (OVERFLOW)` : '0.00 MB/sec (CLOSED)'}
                  </span>
                </div>
                <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden">
                  <div 
                    className="bg-fuchsia-500 h-full transition-all duration-501" 
                    style={{ width: activeLevel !== null && activeLevel >= 4 ? '100%' : '0%' }}
                  />
                </div>
                <div className="flex justify-between text-[8px] text-slate-500 mt-0.5">
                  <span>Simulated Attacker Scraping Tool:</span>
                  <span>
                    {activeLevel !== null && activeLevel >= 5 
                      ? <strong className="text-emerald-400">NULL-ROUTED / CRITICAL INTERRUPTED</strong> 
                      : activeLevel !== null && activeLevel >= 2 
                        ? <strong className="text-amber-400">DELAYED JITTER JIT (1.5 req/sec Limit)</strong> 
                        : 'IDLE / PENDING MONITOR'
                    }
                  </span>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
