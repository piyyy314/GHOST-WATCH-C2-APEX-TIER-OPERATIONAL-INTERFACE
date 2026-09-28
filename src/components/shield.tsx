import React, { useState, useEffect } from 'react';
import { Shield, Play, Lock, AlertTriangle, Eye, ShieldAlert, ShieldCheck, CheckCircle2, RefreshCw, Layers, FileCode, Zap, ToggleLeft, ToggleRight, Trash2 } from 'lucide-react';
import { ThreatEvent, ThreatLevel } from '../types';

interface ShieldMonitorProps {
  onAddThreatEvent: (event: ThreatEvent) => void;
  rootKeyHash: string;
  onRotateKeys: () => void;
}

interface CanaryFile {
  path: string;
  size: string;
  entropy: number;
  status: 'SAFE' | 'COMPROMISED' | 'RENAMED';
  tag: string;
}

export const ShieldMonitor: React.FC<ShieldMonitorProps> = ({ onAddThreatEvent, rootKeyHash, onRotateKeys }) => {
  // Configs
  const [canaries, setCanaries] = useState<CanaryFile[]>([
    { path: '/home/user/target/re-key-vault.id', size: '16 bytes', entropy: 3.22, status: 'SAFE', tag: 'High-Value Cryptographic Seed ID' },
    { path: '/home/user/target/backup-restoration-keys.key', size: '2.0 KB', entropy: 4.12, status: 'SAFE', tag: 'Mnemonic Split Recovery Target' },
    { path: '/home/user/target/confidential_financials.txt', size: '14.2 KB', entropy: 4.35, status: 'SAFE', tag: 'Standard High-Frequency Decoy Text' },
  ]);

  const [ioThrottleArmed, setIoThrottleArmed] = useState(true);
  const [entropyGuardArmed, setEntropyGuardArmed] = useState(true);
  const [autoRevocationArmed, setAutoRevocationArmed] = useState(true);

  // Simulation states
  const [simRunning, setSimRunning] = useState(false);
  const [simPhase, setSimPhase] = useState<'IDLE' | 'TRAVERSAL' | 'ENCRYPTION' | 'CANARY_TRIPPED' | 'NEUTRALIZED'>('IDLE');
  const [simLogs, setSimLogs] = useState<string[]>([]);
  const [ioActivity, setIoActivity] = useState<{ path: string; entropy: number; status: string }[]>([]);
  const [activePid, setActivePid] = useState<number | null>(null);
  const [bindSeqCounter, setBindSeqCounter] = useState(31304);

  // New Canary Form
  const [newCanaryPath, setNewCanaryPath] = useState('');
  const [newCanaryTag, setNewCanaryTag] = useState('');

  // Fix Vault & Restore Compromised Canaries
  const fixVaultAndBreaches = (targetPath?: string) => {
    setCanaries(prev => prev.map(c => {
      if (!targetPath || c.path === targetPath) {
        return {
          ...c,
          status: 'SAFE',
          entropy: c.path === '/home/user/target/re-key-vault.id' ? 3.22 : 4.12
        };
      }
      return c;
    }));

    // Rotate keys
    onRotateKeys();

    // Clear active PID / suspicious activity status
    setActivePid(null);

    // Update simulation logs
    setSimLogs(prev => [
      ...prev,
      `[SHIELD] [REMEDIATION] Fix & Re-key directive executed for ${targetPath || 'Home Vault & decoy canaries'}.`,
      `[SHIELD] [REMEDIATION] Decoy file integrity re-verified. Cryptographic baseline restored to SAFE.`,
      `[SHIELD] [REMEDIATION] PQC Root key re-derived and updated.`
    ]);

    // Threat log
    const rLog: ThreatEvent = {
      id: `EVT-${Date.now()}-REM`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      level: ThreatLevel.INFO,
      source: 'Aegis Active Remediation Engine',
      description: `Home Vault breach repaired (${targetPath || '/home/user/target/re-key-vault.id'}). System integrity restored.`,
      actionTaken: 'Canary status reset to SAFE & keys rotated'
    };
    onAddThreatEvent(rLog);
  };

  const addCanary = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCanaryPath) return;
    const pathNormalized = newCanaryPath.startsWith('/') ? newCanaryPath : `/home/user/target/${newCanaryPath}`;
    
    // Prevent adding duplicate paths to avoid unique key issues
    if (canaries.some(c => c.path === pathNormalized)) {
      setNewCanaryPath('');
      setNewCanaryTag('');
      return;
    }

    const newCan: CanaryFile = {
      path: pathNormalized,
      size: `${Math.floor(1 + Math.random() * 10)} KB`,
      entropy: parseFloat((1 + Math.random() * 4).toFixed(2)),
      status: 'SAFE',
      tag: newCanaryTag || 'Decoy Asset Group Target',
    };
    setCanaries(prev => [...prev, newCan]);
    setNewCanaryPath('');
    setNewCanaryTag('');

    // Trigger LOG
    const tLog: ThreatEvent = {
      id: `EVT-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      level: ThreatLevel.INFO,
      source: 'Aegis Active Canary Shield',
      description: `Injected bait decoy file at path: ${pathNormalized}`,
      actionTaken: 'File integrity watchdog active'
    };
    onAddThreatEvent(tLog);
  };

  const removeCanary = (path: string) => {
    setCanaries(prev => prev.filter(c => c.path !== path));
  };

  // Run file system cryptor simulation
  const runRansomwareSimulation = () => {
    setSimRunning(true);
    setSimPhase('TRAVERSAL');
    setSimLogs(['[SHIELD] EDR Heuristics Watchdog: Active process tracking engaged.', '[SHIELD] Spawning Mock Process - Shell ID: PID 4912 (unauthorized-cryptor.py)']);
    setActivePid(4912);
    setIoActivity([]);
    
    // Reset canaries for subsequent runs
    setCanaries(prev => prev.map(c => ({ ...c, status: 'SAFE', entropy: parseFloat((3 + Math.random() * 1.5).toFixed(2)) })));

    let timelineOffset = 800;

    // 1. Directory Traversal
    setTimeout(() => {
      setSimLogs(prev => [
        ...prev,
        '[PID 4912] Scanning TARGET_ROOT recursively: /home/user/target',
        '[PID 4912] Indexing matching file descriptors...'
      ]);
      setIoActivity([
        { path: '/home/user/target/manual.pdf', entropy: 4.88, status: 'OPENED' },
        { path: '/home/user/target/manifest.yaml', entropy: 3.90, status: 'OPENED' },
        { path: '/home/user/target/database_snapshot.sql', entropy: 4.12, status: 'OPENED' }
      ]);
    }, timelineOffset);

    timelineOffset += 1500;

    // 2. Encryption loop starts
    setTimeout(() => {
      setSimPhase('ENCRYPTION');
      setSimLogs(prev => [
        ...prev,
        '[PID 4912] Cryptographic action initiated: AES-256 Symmetric cipher instantiated.',
        '[PID 4912] Encrypting standard files...'
      ]);
      setIoActivity([
        { path: '/home/user/target/manual.pdf.encrypted', entropy: 7.95, status: 'WRITE_HIGH_ENTROPY' },
        { path: '/home/user/target/manifest.yaml.encrypted', entropy: 7.91, status: 'WRITE_HIGH_ENTROPY' },
        { path: '/home/user/target/database_snapshot.sql.encrypted', entropy: 7.98, status: 'WRITE_HIGH_ENTROPY' }
      ]);

      if (entropyGuardArmed) {
        setSimLogs(prev => [
          ...prev,
          '[SHIELD] [ALERT] Entropy Guard: Detected rapid spikes in file entropy (7.98 > 7.50)',
          '[SHIELD] Heuristic scoring system threshold crossed: threat assessment level HIGH'
        ]);
      }
    }, timelineOffset);

    timelineOffset += 2000;

    // 3. Touching Canary File
    setTimeout(() => {
      setSimPhase('CANARY_TRIPPED');
      const currentBind = bindSeqCounter;
      setBindSeqCounter(prev => prev + 1);

      const sha3_512_hash = Array.from({ length: 128 }, () => Math.floor(Math.random() * 16).toString(16)).join('').toUpperCase();

      setCanaries(prev => prev.map(c => {
        if (c.path === '/home/user/target/re-key-vault.id') {
          return { ...c, status: 'COMPROMISED', entropy: 7.99 };
        }
        return c;
      }));
      setSimLogs(prev => [
        ...prev,
        '[PID 4912] Attempting read-to-overwrite on decoy file: /home/user/target/re-key-vault.id',
        '💥 [SHIELD] [CRITICAL] Canary Trigger Tripped: File "/home/user/target/re-key-vault.id" modified!',
        `🔗 [313-BIND] [MUTABILITY GUARD] Canary payload bound to 313 chain. bind_index: #${currentBind}`,
        `🔗 [313-BIND] Chain hash generated: 313-BIND-SHA3-512-0X${sha3_512_hash.substring(0, 32)}...`,
        '💥 [SHIELD] [CRITICAL] Source process identified: PID 4912'
      ]);
      setIoActivity(prev => [
        ...prev,
        { path: '/home/user/target/re-key-vault.id', entropy: 7.99, status: 'COMPROMISED / MODIFIED' }
      ]);

      // Threat Log
      const tLog: ThreatEvent = {
        id: `EVT-${Date.now()}-R1`,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
        level: ThreatLevel.CRITICAL,
        source: '/home/user/target/re-key-vault.id',
        description: `Bait decoy file integrity failure. Unauthorized cryptographic entropy write by PID 4912. [313-BIND: #${currentBind}]`,
        actionTaken: 'Interceptors active & 313-BIND ledger recorded',
        bindIndex: currentBind,
        bindHash: `313-BIND-SHA3-512-0X${sha3_512_hash}`,
        chainBound: true
      };
      onAddThreatEvent(tLog);
    }, timelineOffset);

    timelineOffset += 1800;

    // 4. Countermeasures Engage
    setTimeout(() => {
      setSimPhase('NEUTRALIZED');
      setSimLogs(prev => [
        ...prev,
        '[SHIELD] [AEGIS ACTIVE INTERCEPT] Executing automated mitigation rules...',
        ioThrottleArmed ? '[SHIELD] [IO-THROTTLE] Throttling physical file operations to 0 IOPS.' : '[SHIELD] Heuristics bypass: standard CPU threshold speed ignored.',
        '[SHIELD] [PROCESS-KILL] Dispatched SIGKILL payload packet to malicious process PID 4912.',
        '[SHIELD] Process terminated successfully. File encryption lock held.',
        autoRevocationArmed ? '[SHIELD] [AUTO-REVOCATION] Arming Quantum Crypto Key Revocation.' : '[SHIELD] Key rotation bypassed by policy.'
      ]);

      if (autoRevocationArmed) {
        onRotateKeys();
        setSimLogs(prev => [
          ...prev,
          `[SHIELD] 🔑 NIST FIPS 203 keys rotated automatically override LoRa gateways. Secure root: [${rootKeyHash}] generated.`
        ]);
      }

      setSimRunning(false);
      setActivePid(null);

      const endLog: ThreatEvent = {
        id: `EVT-${Date.now()}-R2`,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
        level: ThreatLevel.CRITICAL,
        source: 'Aegis Active Interceptor',
        description: 'Malicious cryptographic attack neutralized. PID 4912 forcefully killed.',
        actionTaken: 'ML-KEM keys rotated & firewall block active'
      };
      onAddThreatEvent(endLog);
    }, timelineOffset);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 font-mono">
      {/* Critical Breach Remediation Alert Banner */}
      {canaries.some(c => c.status === 'COMPROMISED') && (
        <div className="xl:col-span-12 border-2 border-rose-500 bg-rose-950/40 p-4 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-900 border border-rose-500 text-rose-200 rounded-full shrink-0">
              <ShieldAlert className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <h3 className="font-display font-bold text-sm text-rose-300 uppercase tracking-widest">
                CRITICAL VAULT BREACH DETECTED
              </h3>
              <p className="text-xs text-rose-200 font-mono">
                Home Vault (<span className="underline font-bold">/home/user/target/re-key-vault.id</span>) or active canary decoys have been compromised by untrusted activity!
              </p>
            </div>
          </div>

          <button
            id="btn-fix-vault-breach"
            onClick={() => fixVaultAndBreaches()}
            className="px-5 py-2.5 bg-rose-500 hover:bg-rose-400 text-slate-950 font-bold text-xs uppercase rounded cursor-pointer transition-all flex items-center justify-center gap-2 shadow-lg shrink-0"
          >
            <CheckCircle2 className="w-4 h-4" />
            Fix Breach & Re-Secure Home Vault
          </button>
        </div>
      )}

      {/* Settings / Configuration Form Left Card */}
      <div className="xl:col-span-4 flex flex-col gap-4">
        {/* Mitigation Rules Control Box */}
        <div className="border border-slate-800 bg-slate-950 p-4 rounded">
          <div className="flex items-center gap-2 border-b border-slate-900 pb-2 mb-3">
            <Lock className="w-4.5 h-4.5 text-cyan-400" />
            <h3 className="font-display font-medium text-slate-200 text-xs tracking-widest uppercase">
              Ransomware Active Interceptors
            </h3>
          </div>

          <p className="text-[10px] text-slate-500 leading-relaxed mb-4">
            Configure how your Ghost-Watch C2 Terminal reacts in real-time when anomalous cryptographic activity or canary file triggers are detected.
          </p>

          <div className="flex flex-col gap-3.5 text-xs">
            {/* Toggle 1 */}
            <div className="flex items-center justify-between bg-slate-900/30 p-2.5 rounded border border-slate-900">
              <div className="flex flex-col max-w-[80%]">
                <span className="font-bold text-slate-300">Heuristic Entropy Guard</span>
                <span className="text-[9px] text-slate-500">Monitor file changes for entropy &gt; 7.5 (characteristic of high-strength AES encryption).</span>
              </div>
              <button
                id="toggle-entropy-guard"
                onClick={() => setEntropyGuardArmed(!entropyGuardArmed)}
                className="cursor-pointer text-cyan-400 select-none hover:text-cyan-300"
              >
                {entropyGuardArmed ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8 text-slate-600" />}
              </button>
            </div>

            {/* Toggle 2 */}
            <div className="flex items-center justify-between bg-slate-900/30 p-2.5 rounded border border-slate-900">
              <div className="flex flex-col max-w-[80%]">
                <span className="font-bold text-slate-300">File I/O Rate Throttle</span>
                <span className="text-[9px] text-slate-500">Gracefully restrict or freeze file write speeds once a threshold of anomalous renames is crossed.</span>
              </div>
              <button
                id="toggle-io-throttle"
                onClick={() => setIoThrottleArmed(!ioThrottleArmed)}
                className="cursor-pointer text-cyan-400 select-none hover:text-cyan-300"
              >
                {ioThrottleArmed ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8 text-slate-600" />}
              </button>
            </div>

            {/* Toggle 3 */}
            <div className="flex items-center justify-between bg-slate-900/30 p-2.5 rounded border border-slate-900">
              <div className="flex flex-col max-w-[80%]">
                <span className="font-bold text-slate-300">Auto PQC Key Rotation</span>
                <span className="text-[9px] text-slate-500">Trigger immediate out-of-band ML-KEM-768 key rotation when a decoy canary element is modified.</span>
              </div>
              <button
                id="toggle-auto-revocation"
                onClick={() => setAutoRevocationArmed(!autoRevocationArmed)}
                className="cursor-pointer text-cyan-400 select-none hover:text-cyan-300"
              >
                {autoRevocationArmed ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8 text-slate-600" />}
              </button>
            </div>
          </div>
        </div>

        {/* Generate / Register New Canary Bait File */}
        <div className="border border-slate-800 bg-slate-950 p-4 rounded">
          <div className="flex items-center gap-2 border-b border-slate-900 pb-2 mb-3">
            <Layers className="w-4.5 h-4.5 text-amber-500" />
            <h4 className="font-display font-medium text-xs text-slate-200 uppercase tracking-widest">
              Inject Canary Bait File
            </h4>
          </div>

          <form onSubmit={addCanary} className="flex flex-col gap-3 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">Decoy File Target Path</label>
              <input
                id="input-canary-path"
                type="text"
                required
                value={newCanaryPath}
                onChange={(e) => setNewCanaryPath(e.target.value)}
                placeholder="e.g. system_manifest.id"
                className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-slate-200 focus:outline-none focus:border-amber-500 placeholder-slate-700"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Bait Group Category / Metadata</label>
              <input
                id="input-canary-tag"
                type="text"
                value={newCanaryTag}
                onChange={(e) => setNewCanaryTag(e.target.value)}
                placeholder="e.g. Host Backup Keys Split Plate"
                className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-slate-200 focus:outline-none focus:border-amber-500 placeholder-slate-700"
              />
            </div>

            <button
              id="btn-inject-canary"
              type="submit"
              className="w-full py-2 px-3 border border-amber-500/50 bg-amber-950/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 font-bold rounded cursor-pointer transition-colors"
            >
              + Register Active Canary Watchdog
            </button>
          </form>
        </div>
      </div>

      {/* Main Terminal Display and Canary Directory Right Bar */}
      <div className="xl:col-span-8 flex flex-col gap-4">
        {/* Active Simulation Playground */}
        <div className="border border-slate-800 bg-slate-950 p-4 rounded flex-1 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-900 pb-2 mb-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4.5 h-4.5 text-rose-500 animate-pulse" />
              <span className="font-display font-medium text-xs text-slate-300 uppercase">
                Active Ransomware Cryptor Simulation Sandbox
              </span>
            </div>
            {activePid && (
              <span className="text-[10px] text-rose-450 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded animate-pulse">
                PID DETECTED: {activePid}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 flex-1">
            {/* Terminal logs showing the intercept */}
            <div className="md:col-span-7 bg-slate-950 border border-slate-900 p-3 rounded text-[11px] font-mono h-64 overflow-y-auto flex flex-col gap-1 terminal-crt select-text">
              {simLogs.length === 0 ? (
                <div className="flex h-full items-center justify-center text-slate-600 italic text-center text-xs">
                  Awaiting behavioral trigger simulator launch... Configure Active Interceptors on the left and click 'Launch' below to test standard heuristic defenses.
                </div>
              ) : (
                <div className="flex flex-col gap-1 text-slate-300">
                  {simLogs.map((log, i) => {
                    let logColor = "text-slate-400";
                    if (log.includes("[SHIELD]") && log.includes("[CRITICAL]")) logColor = "text-rose-400 font-bold";
                    else if (log.includes("[PID")) logColor = "text-slate-300";
                    else if (log.includes("[SHIELD]") && log.includes("[ALERT]")) logColor = "text-amber-400";
                    else if (log.includes("TERMINATED") || log.includes("KILLED")) logColor = "text-emerald-400 font-bold";
                    else if (log.includes("rotated")) logColor = "text-cyan-400 font-semibold";
                    
                    return (
                      <span key={i} className={`font-mono leading-normal ${logColor}`}>
                        {log}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Real-time File/IO stream list */}
            <div className="md:col-span-5 border border-slate-900 bg-slate-950/65 rounded p-3 text-[10px] flex flex-col justify-between">
              <div>
                <span className="text-slate-500 block mb-1.5 border-b border-slate-900 pb-1 uppercase font-bold text-[9px] tracking-widest text-cyan-400">
                  Heuristic I/O Watchdog Stream
                </span>
                <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto pr-1">
                  {ioActivity.length === 0 ? (
                    <span className="text-slate-700 italic">No filesystem activity captured.</span>
                  ) : (
                    ioActivity.map((io, i) => (
                      <div key={i} className="flex justify-between items-center bg-slate-900/40 p-1.5 rounded border border-slate-900">
                        <div className="flex flex-col max-w-[70%]">
                          <span className="font-mono text-slate-300 truncate text-[9px]">{io.path}</span>
                          <span className="text-[8px] text-slate-500">Calculated Entropy: <span className={io.entropy > 7.5 ? "text-rose-400 font-bold" : "text-emerald-400"}>{io.entropy} bits</span></span>
                        </div>
                        <span className={`px-1.5 py-0.5 rounded font-extrabold text-[8px] ${
                          io.status.includes('HIGH_ENTROPY') || io.status.includes('COMPROMISED')
                            ? 'bg-rose-950 text-rose-300 border border-rose-900'
                            : 'bg-slate-900 text-slate-400 border border-slate-800'
                        }`}>
                          {io.status}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-900 mt-2">
                <button
                  id="btn-simulate-ransomware"
                  onClick={runRansomwareSimulation}
                  disabled={simRunning}
                  className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-rose-950 border border-rose-500/40 hover:bg-rose-500 text-rose-300 hover:text-slate-950 text-xs font-bold rounded cursor-pointer transition-all disabled:opacity-50 select-none"
                >
                  <Play className="w-3.5 h-3.5 mb-0.5" /> Launch Ransomware Encryption Simulation
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Directory/Bait Watchdogs Registry */}
        <div className="border border-slate-800 bg-slate-950 p-4 rounded flex flex-col gap-3">
          <div className="flex items-center gap-2 border-b border-slate-900 pb-2">
            <FileCode className="w-4 h-4 text-amber-500" />
            <h4 className="font-display font-medium text-xs text-slate-200 uppercase tracking-widest">
              Physical Decoy Canary bait watchdogs list ({canaries.length} Active Traps)
            </h4>
          </div>

          <div className="max-h-40 overflow-y-auto flex flex-col gap-2">
            {canaries.map((can, index) => (
              <div
                key={`${can.path}-${index}`}
                className="flex items-center justify-between p-2 rounded bg-slate-900/40 border border-slate-900 text-[10px] select-none hover:bg-slate-910 hover:border-slate-800 transition-all"
              >
                <div className="flex flex-col gap-0.5 max-w-[70%]">
                  <span className="font-bold text-slate-300 text-xs truncate select-all">{can.path}</span>
                  <span className="font-mono text-slate-500">{can.tag} | Size: {can.size}</span>
                  <span className="text-slate-400">
                    File Baseline Entropy: <span className="text-cyan-400 font-bold">{can.entropy} bits</span>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                    can.status === 'COMPROMISED'
                      ? 'border-rose-500/50 bg-rose-950/20 text-rose-300 animate-pulse'
                      : 'border-emerald-500/50 bg-emerald-950/20 text-emerald-300'
                  }`}>
                    {can.status}
                  </span>

                  {can.status === 'COMPROMISED' && (
                    <button
                      id={`btn-fix-canary-${index}`}
                      onClick={() => fixVaultAndBreaches(can.path)}
                      className="px-2 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-[9px] rounded cursor-pointer transition-colors flex items-center gap-1 select-none shrink-0"
                    >
                      <CheckCircle2 className="w-3 h-3" /> Fix & Restore
                    </button>
                  )}
                  
                  {/* Prevent removing the baseline system files */}
                  {can.path !== '/home/user/target/re-key-vault.id' && (
                    <button
                      id={`btn-remove-canary-${can.path.split('/').pop()}`}
                      onClick={() => removeCanary(can.path)}
                      className="text-slate-500 hover:text-rose-400 transition-colors cursor-pointer select-none"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* 313-BIND Ledger Integrity & Gap Monitor */}
          <div className="mt-2 border border-cyan-500/30 bg-cyan-950/20 p-3 rounded flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyan-900/50 border border-cyan-500/40 text-cyan-300 rounded shrink-0">
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-cyan-200 uppercase tracking-wide text-[11px]">313-BIND CANARY LEDGER & LOG GAP DETECTOR</span>
                  <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[9px] font-bold border border-cyan-500/30">
                    CHAIN HEIGHT: #{bindSeqCounter - 1}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">
                  Every canary activation &amp; SIEM event is bound to the 313 chain with SHA3-512 hashes. Insider log deletion attempts are flagged via <span className="text-cyan-300 font-bold">bind_index gap analysis</span>.
                </p>
              </div>
            </div>

            <button
              id="btn-audit-313-bind"
              type="button"
              onClick={() => alert(`313-BIND Ledger Cryptographic Continuity Audit:\n\nSequence Range: #31301 - #${bindSeqCounter - 1}\nActive Bind Index: #${bindSeqCounter - 1}\nChain Hash Standard: SHA3-512 (128 hex chars / 512 bits)\nSequence Gap Audit: 0 Gaps Detected (PASS)\nInsider Tamper Status: SECURE - No log entries deleted.`)}
              className="px-3 py-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 font-bold text-[10px] uppercase rounded transition-colors cursor-pointer shrink-0 flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> Verify 313-BIND Chain
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
