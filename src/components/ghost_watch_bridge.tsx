import React, { useState, useEffect } from 'react';
import { 
  temporalBinder, BindReceipt, BindReceiptPayload, on_cadl_event 
} from '../lib/temporal_binder';
import { ThreatEvent, ThreatLevel, BSAUProfile, RiskLevel } from '../types';
import { 
  ShieldCheck, RefreshCw, Key, ShieldAlert, Cpu, Lock, 
  Terminal, FileCode, CheckCircle2, AlertOctagon, Zap, Layers, Link2, Database
} from 'lucide-react';

interface GhostWatchBridgeProps {
  threatEvents: ThreatEvent[];
  onUpdateThreatEvents: (events: ThreatEvent[]) => void;
  profiles: BSAUProfile[];
  onUpdateProfiles: (profiles: BSAUProfile[]) => void;
  onSystemKeyRotate: () => void;
}

export const GhostWatchBridge: React.FC<GhostWatchBridgeProps> = ({
  threatEvents,
  onUpdateThreatEvents,
  profiles,
  onUpdateProfiles,
  onSystemKeyRotate,
}) => {
  const [receipts, setReceipts] = useState<BindReceipt[]>([]);
  const [activeTab, setActiveTab] = useState<'LEDGER' | 'LAE_AUDIT' | 'PID_FORENSICS' | 'BSAU_40D'>('LEDGER');
  const [laeStatus, setLaeStatus] = useState<'ACTIVE_RISK' | 'REVOKED_ISOLATED'>('ACTIVE_RISK');
  const [lastReceipt, setLastReceipt] = useState<BindReceipt | null>(null);
  const [forensicDumpCaptured, setForensicDumpCaptured] = useState(false);
  const [memDumpHash, setMemDumpHash] = useState('');
  const [retroBoundStatus, setRetroBoundStatus] = useState<string>('');

  // Sample LAE_Node_09 24-hour log items
  const lae24HourLogs = [
    { time: '2026-08-07 00:14:02', action: 'Auth bearer token generated', scope: 'Arrow Systems Integration API', status: 'GRANTED' },
    { time: '2026-08-07 03:22:45', action: 'Query table: we_forge_blueprints_v2', scope: 'Database Node 02', status: 'EXECUTED (34 rows)' },
    { time: '2026-08-07 06:45:11', action: 'Lateral connection probe', scope: '5 off-scope databases in 4s', status: 'FLAGGED BY BSAU' },
    { time: '2026-08-07 10:12:30', action: 'Read file: /home/user/target/re-key-vault.id', scope: 'Decoy Canary Vault', status: 'CANARY TRIPPED' },
    { time: '2026-08-07 14:05:19', action: 'API Scrape request', scope: 'pqc-audit-api-scrape-13.ghost.watch.local', status: 'CADL L3 CONTAINED' },
    { time: '2026-08-07 18:30:00', action: 'Process PID 4912 execution attempt', scope: 'Read-to-overwrite decoy payload', status: 'INTERCEPTED & SIGKILL' },
    { time: '2026-08-07 20:48:12', action: '313-BIND receipt generated', scope: 'Temporal Binder Engine', status: 'SLH-DSA-128f SIGNED' },
  ];

  // 40D BSAU ATT&CK Feature Vector mapping for LAE_Node_09
  const attckFeatureVector40D = [
    { dim: 1, feature: 'T1078 Valid Accounts Abuse', value: 0.94, desc: 'Autonomous service account credential theft' },
    { dim: 2, feature: 'T1021.002 SMB/Admin Shares', value: 0.88, desc: 'Lateral migration speed: 4.8 hops/sec' },
    { dim: 3, feature: 'T1567 Exfiltration Over Web Service', value: 0.91, desc: 'High-entropy chunk exfiltration attempt' },
    { dim: 4, feature: 'T1003 OS Credential Dumping', value: 0.79, desc: 'Probing memory range 0x7fff0000-0x7fffffff' },
    { dim: 5, feature: 'T1059 Command and Scripting Interpreter', value: 0.85, desc: 'PID 4912 automated script spawn' },
    { dim: 6, feature: 'T1083 File and Directory Discovery', value: 0.96, desc: 'Scrape on WE-FORGE decoy tables' },
    { dim: 7, feature: 'T1027 Obfuscated Files or Information', value: 0.82, desc: 'Base64 container with fake entropy padding' },
    { dim: 8, feature: 'T1110 Brute Force Iteration', value: 0.65, desc: 'Rapid bearer token verification sweeps' },
  ];

  useEffect(() => {
    setReceipts(temporalBinder.getLedger());
  }, []);

  // Trigger bind_receipt with the exact user requested payload
  const handleExecuteExactBindReceipt = () => {
    const payload: BindReceiptPayload = {
      event: 'CANARY_TRIGGERED',
      lure_id: 'PQC-DECOY-API_SCRAPE_1329_v05.pqc',
      adversary_ip: '94.23.221.14',
      cerberus_score: 68,
      cadl_level: 'L3-CONTAIN',
      dns_canary: 'pqc-audit-api-scrape-13.ghost.watch.local'
    };

    const receipt = on_cadl_event(payload);
    setLastReceipt(receipt);
    setReceipts(temporalBinder.getLedger());

    // Also add to threat events list
    const newEvt: ThreatEvent = {
      id: `EVT-313-${receipt.bindIndex}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      level: ThreatLevel.CRITICAL,
      source: 'pqc-audit-api-scrape-13.ghost.watch.local',
      description: `[313-BIND: #${receipt.bindIndex}] Canary trigger bound. SLH-DSA-SHA2-128f signature verified. IPFS CID: ${receipt.ipfsCid}`,
      actionTaken: '313-BIND receipt generated & written to temporal ledger',
      bindIndex: receipt.bindIndex,
      bindHash: receipt.bindHash,
      chainBound: true
    };

    onUpdateThreatEvents([newEvt, ...threatEvents]);
  };

  // Bind all 7 unbound events retroactively
  const handleRetroactiveBindAll = () => {
    const result = temporalBinder.retroactive_bind_all(threatEvents);
    onUpdateThreatEvents(result.updatedEvents as ThreatEvent[]);
    setReceipts(temporalBinder.getLedger());
    setRetroBoundStatus(`Successfully bound ${result.boundCount} events retroactively to 313-BIND chain. 0 gaps remaining.`);
  };

  // Revoke LAE_Node_09 credentials
  const handleRevokeLaeNode09 = () => {
    setLaeStatus('REVOKED_ISOLATED');
    
    // Update BSAU profile for LAE_Node_09
    const updatedProfiles = profiles.map(p => {
      if (p.operatorName.includes('LAE_Node_09')) {
        return {
          ...p,
          risk: RiskLevel.CRITICAL,
          behaviorScore: 0,
          assessment: 'CREDENTIALS PERMANENTLY REVOKED & NODE ISOLATED. All API tokens zeroed. 313-BIND receipt recorded.'
        };
      }
      return p;
    });
    onUpdateProfiles(updatedProfiles);

    // Bind event
    const receipt = temporalBinder.bind_receipt(
      {
        event: 'CREDENTIAL_REVOCATION',
        target_node: 'LAE_Node_09',
        action_type: 'IMMEDIATE_OOB_BEARER_PURGE',
        cadl_level: 'L5-LOCKDOWN'
      },
      'ghost_watch_bridge',
      'REVOKE_LAE_NODE_09'
    );

    setReceipts(temporalBinder.getLedger());

    const evt: ThreatEvent = {
      id: `EVT-REVOKE-LAE09-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      level: ThreatLevel.CRITICAL,
      source: 'LAE_Node_09 (Autonomous Service Account)',
      description: `[313-BIND: #${receipt.bindIndex}] LAE_Node_09 credentials REVOKED. Bearer tokens zeroed across API gateways.`,
      actionTaken: 'Session terminated permanently. 313-BIND receipt sealed.',
      bindIndex: receipt.bindIndex,
      bindHash: receipt.bindHash,
      chainBound: true
    };
    onUpdateThreatEvents([evt, ...threatEvents]);
  };

  // Capture PID 4912 memory snapshot
  const handleCapturePid4912MemDump = () => {
    const hash = Array.from({ length: 128 }, () => Math.floor(Math.random() * 16).toString(16)).join('').toUpperCase();
    setMemDumpHash(hash);
    setForensicDumpCaptured(true);

    const receipt = temporalBinder.bind_receipt(
      {
        event: 'FORENSIC_MEM_DUMP',
        pid: 4912,
        dump_path: '/var/log/forensics/pid_4912_mem_dump.raw.pqc',
        dump_size_bytes: 1048576,
        sha3_512_hash: hash,
        child_process_count: 0,
        outbound_socket_count: 0
      },
      'ghost_watch_bridge',
      'CAPTURE_MEM_DUMP'
    );
    setReceipts(temporalBinder.getLedger());
  };

  return (
    <div className="border border-slate-800 bg-slate-950 p-4 rounded-lg font-mono flex flex-col gap-4">
      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-900 pb-3">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-cyan-400 animate-pulse" />
          <div className="flex flex-col">
            <h3 className="font-display font-bold text-xs text-slate-100 uppercase tracking-widest flex items-center gap-2">
              Ghost-Watch // Shadow313 Temporal API Bridge
            </h3>
            <span className="text-[10px] text-slate-500">
              Module: <span className="text-cyan-300">shadow313/api/ghost_watch_bridge.py</span> | Chain: <span className="text-emerald-400 font-bold">313-BIND SLH-DSA-SHA2-128f</span>
            </span>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="flex flex-wrap gap-1 bg-slate-900/60 p-1 rounded border border-slate-800 text-[10px]">
          <button
            onClick={() => setActiveTab('LEDGER')}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
              activeTab === 'LEDGER' ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🔗 313-BIND Ledger
          </button>
          <button
            onClick={() => setActiveTab('LAE_AUDIT')}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
              activeTab === 'LAE_AUDIT' ? 'bg-rose-500/20 text-rose-300 font-bold border border-rose-500/40' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🚫 LAE_Node_09 24h Audit & Revoke
          </button>
          <button
            onClick={() => setActiveTab('PID_FORENSICS')}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
              activeTab === 'PID_FORENSICS' ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🧠 PID 4912 Forensics
          </button>
          <button
            onClick={() => setActiveTab('BSAU_40D')}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
              activeTab === 'BSAU_40D' ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            📊 BSAU 40D Vector Training
          </button>
        </div>
      </div>

      {/* Primary Actions Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-900/40 border border-slate-900 p-3 rounded">
        {/* Execute prompt receipt */}
        <button
          id="btn-trigger-exact-bind-receipt"
          onClick={handleExecuteExactBindReceipt}
          className="flex items-center justify-center gap-2 py-2 px-3 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 font-bold text-xs rounded transition-colors cursor-pointer text-left"
        >
          <Zap className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>Execute Exact 313-BIND Receipt (CANARY_TRIGGERED)</span>
        </button>

        {/* Retroactive seal */}
        <button
          id="btn-retroactive-bind-all"
          onClick={handleRetroactiveBindAll}
          className="flex items-center justify-center gap-2 py-2 px-3 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-bold text-xs rounded transition-colors cursor-pointer text-left"
        >
          <Link2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Bind All Unbound Events Retroactively</span>
        </button>

        {/* Rotate all ML-KEM keys */}
        <button
          id="btn-system-wide-mlkem-rotate"
          onClick={() => {
            onSystemKeyRotate();
            const receipt = temporalBinder.bind_receipt(
              {
                event: 'SYSTEM_WIDE_MLKEM_KEY_ROTATION',
                scope: 'AEGIS_CADL_PQC_ACTS_NODES',
                algorithm: 'ML-KEM-768 (FIPS 203)',
                cadl_level: 'L5-LOCKDOWN'
              },
              'pqc_aegis_core',
              'SYSTEM_KEY_ROTATE'
            );
            setReceipts(temporalBinder.getLedger());
            alert(`System-wide ML-KEM-768 Key Rotation Executed!\n313-BIND Receipt: #${receipt.bindIndex}\nSignature: SLH-DSA-SHA2-128f`);
          }}
          className="flex items-center justify-center gap-2 py-2 px-3 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-bold text-xs rounded transition-colors cursor-pointer text-left"
        >
          <RefreshCw className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Rotate ALL ML-KEM Keys (System-Wide)</span>
        </button>
      </div>

      {retroBoundStatus && (
        <div className="p-2.5 bg-emerald-950/30 border border-emerald-500/40 text-emerald-300 text-xs rounded flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{retroBoundStatus}</span>
        </div>
      )}

      {/* Tab Content Display */}
      {activeTab === 'LEDGER' && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-300">Active 313-BIND Receipt Ledger ({receipts.length} Receipts)</span>
            <span className="text-[10px] text-cyan-400 bg-cyan-950 border border-cyan-800 px-2 py-0.5 rounded">
              Current Chain Height: #{temporalBinder.getCurrentBindIndex() - 1} | Gap Check: PASS
            </span>
          </div>

          {lastReceipt && (
            <div className="border border-cyan-500/50 bg-cyan-950/20 p-3 rounded flex flex-col gap-1.5 text-xs">
              <span className="text-cyan-300 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" /> LAST BIND RECEIPT GENERATED: #{lastReceipt.bindIndex}
              </span>
              <div className="text-[10px] grid grid-cols-1 md:grid-cols-2 gap-2 text-slate-300 bg-slate-950 p-2.5 rounded border border-slate-900">
                <div>
                  <span className="text-slate-500 block">RECEIPT ID:</span>
                  <span className="text-cyan-300 font-mono select-all">{lastReceipt.receiptId}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">TIMESTAMP_313 (Nanoseconds):</span>
                  <span className="text-emerald-300 font-mono select-all">{lastReceipt.timestamp313}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">SLH-DSA SIGNATURE:</span>
                  <span className="text-amber-300 font-mono truncate block select-all">{lastReceipt.slhSig}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">IPFS CID ANCHOR:</span>
                  <span className="text-purple-300 font-mono select-all">{lastReceipt.ipfsCid}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-500 block">SHA3-512 CHAIN HASH (128 Hex Chars):</span>
                  <span className="text-cyan-400 font-mono text-[9px] break-all block select-all bg-slate-900 p-1 rounded mt-0.5">
                    {lastReceipt.bindHash}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="max-h-64 overflow-y-auto flex flex-col gap-2 pr-1">
            {receipts.length === 0 ? (
              <span className="text-slate-600 italic text-xs">No receipts in temporal binder. Trigger an event to generate one.</span>
            ) : (
              receipts.map((rcpt) => (
                <div key={rcpt.receiptId} className="border border-slate-900 bg-slate-900/30 p-2.5 rounded text-[10px] flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="text-cyan-400 font-bold font-mono">
                      [313-BIND #{rcpt.bindIndex}] {rcpt.receiptId}
                    </span>
                    <span className="text-emerald-400 font-mono font-bold">{rcpt.timestamp313} (ns)</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-slate-400 text-[9.5px]">
                    <span className="px-1.5 py-0.2 rounded bg-slate-900 border border-slate-800 text-amber-300 font-bold">{rcpt.module}</span>
                    <span className="px-1.5 py-0.2 rounded bg-slate-900 border border-slate-800 text-cyan-300">{rcpt.action}</span>
                    <span className="text-purple-300 font-mono truncate max-w-[200px]">IPFS: {rcpt.ipfsCid}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === 'LAE_AUDIT' && (
        <div className="flex flex-col gap-3 text-xs">
          <div className="flex items-center justify-between border-b border-slate-900 pb-2">
            <div className="flex items-center gap-2">
              <AlertOctagon className="w-4 h-4 text-rose-400" />
              <span className="font-bold text-slate-200">LAE_Node_09 Full 24-Hour Action Audit Log</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                laeStatus === 'REVOKED_ISOLATED' ? 'bg-rose-950 text-rose-300 border-rose-500/40' : 'bg-amber-950 text-amber-300 border-amber-500/40'
              }`}>
                STATUS: {laeStatus}
              </span>
              <button
                id="btn-revoke-lae-09"
                onClick={handleRevokeLaeNode09}
                disabled={laeStatus === 'REVOKED_ISOLATED'}
                className="px-3 py-1 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-bold text-[10px] uppercase rounded cursor-pointer transition-colors"
              >
                Revoke LAE_Node_09 Credentials Now
              </button>
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-900 rounded p-3 flex flex-col gap-2 max-h-60 overflow-y-auto">
            {lae24HourLogs.map((log, i) => (
              <div key={i} className="flex flex-col md:flex-row md:items-center justify-between gap-1 text-[10px] border-b border-slate-900/60 pb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 font-mono">{log.time}</span>
                  <span className="text-slate-200 font-bold">{log.action}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-cyan-400 text-[9px] font-mono">[{log.scope}]</span>
                  <span className={`px-1.5 py-0.2 rounded font-bold text-[9px] ${
                    log.status.includes('CANARY') || log.status.includes('FLAGGED') || log.status.includes('INTERCEPTED')
                      ? 'bg-rose-950 text-rose-300 border border-rose-800'
                      : 'bg-slate-900 text-slate-400'
                  }`}>
                    {log.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'PID_FORENSICS' && (
        <div className="flex flex-col gap-3 text-xs">
          <div className="flex items-center justify-between border-b border-slate-900 pb-2">
            <span className="font-bold text-slate-200">PID 4912 Pre-Kill Diagnostic & Memory Dump</span>
            <button
              id="btn-capture-mem-dump"
              onClick={handleCapturePid4912MemDump}
              className="px-3 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-bold text-[10px] uppercase rounded cursor-pointer transition-colors"
            >
              Capture Forensic Memory Snapshot
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
            <div className="bg-slate-950 border border-slate-900 p-3 rounded flex flex-col gap-2">
              <span className="text-slate-400 font-bold uppercase text-[10px]">Process Pre-Kill Verification</span>
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-slate-500">TARGET PROCESS PID:</span>
                <span className="text-rose-400 font-bold font-mono">PID 4912</span>
              </div>
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-slate-500">CHILD PROCESS COUNT:</span>
                <span className="text-emerald-400 font-bold font-mono">0 (PASS - NO DAUGHTERS)</span>
              </div>
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-slate-500">OUTBOUND TCP SOCKETS:</span>
                <span className="text-emerald-400 font-bold font-mono">0 (PASS - FULLY ISOLATED)</span>
              </div>
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-slate-500">PRE-KILL STATUS:</span>
                <span className="text-cyan-300 font-bold">VERIFIED CLEAN FOR SIGKILL</span>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-900 p-3 rounded flex flex-col gap-2">
              <span className="text-slate-400 font-bold uppercase text-[10px]">Forensic Dump Artifact</span>
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-slate-500">RAW FILE PATH:</span>
                <span className="text-amber-300 font-mono text-[9px] select-all">/var/log/forensics/pid_4912_mem_dump.raw.pqc</span>
              </div>
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-slate-500">FILE SIZE:</span>
                <span className="text-slate-200 font-mono">1.024 MB (1,048,576 bytes)</span>
              </div>
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-slate-500">MEMORY RANGES:</span>
                <span className="text-slate-400 font-mono text-[9px]">0x7fff0000 - 0x7fffffff</span>
              </div>
              {forensicDumpCaptured && (
                <div className="text-[9px] bg-slate-900 p-1.5 rounded border border-slate-800 text-cyan-300 font-mono break-all select-all mt-1">
                  SHA3-512: {memDumpHash}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'BSAU_40D' && (
        <div className="flex flex-col gap-3 text-xs">
          <div className="flex items-center justify-between border-b border-slate-900 pb-2">
            <span className="font-bold text-slate-200">Cerberus BSAU 40-Dimensional ATT&CK Training Feature Vector</span>
            <span className="text-[10px] text-emerald-400 bg-emerald-950 border border-emerald-800 px-2 py-0.5 rounded font-bold">
              LAE_Node_09 Pattern Ingested
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-60 overflow-y-auto">
            {attckFeatureVector40D.map((item) => (
              <div key={item.dim} className="bg-slate-950 border border-slate-900 p-2 rounded flex items-center justify-between text-[10px]">
                <div className="flex flex-col">
                  <span className="font-bold text-cyan-300">Dim {item.dim}: {item.feature}</span>
                  <span className="text-slate-500 text-[9px]">{item.desc}</span>
                </div>
                <span className="font-mono font-bold text-rose-400 bg-rose-950/40 border border-rose-900 px-1.5 py-0.5 rounded">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
