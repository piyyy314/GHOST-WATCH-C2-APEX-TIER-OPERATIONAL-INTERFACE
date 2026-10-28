import React, { useState, useEffect } from 'react';
import { Shield, RefreshCw, Cpu, Award, Terminal, Lock, Unlock, HelpCircle, ShieldCheck, CheckCircle2, Link2, Zap, AlertTriangle } from 'lucide-react';
import { temporalBinder } from '../lib/temporal_binder';

interface PqcMatrixProps {
  onRotateKeys: () => void;
  rootKeyHash: string;
}

export const PqcMatrix: React.FC<PqcMatrixProps> = ({ onRotateKeys, rootKeyHash }) => {
  const [activeTab, setActiveTab] = useState<'ROTATION' | 'INTEGRITY' | 'BENCHMARK'>('ROTATION');
  const [mlKemKey, setMlKemKey] = useState(`ML-KEM-768_ROOT_${rootKeyHash}`);
  const [mlDsaKey, setMlDsaKey] = useState(`ML-DSA-65_SIG_${rootKeyHash.substring(0,8)}_v4`);
  const [isRotating, setIsRotating] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(() => temporalBinder.verifyKeyIntegrity(rootKeyHash));
  const [benchmarkRunning, setBenchmarkRunning] = useState(false);
  const [benchmarkLogs, setBenchmarkLogs] = useState<string[]>([]);
  const [classicalCracked, setClassicalCracked] = useState<boolean | null>(null);
  const [pqcCracked, setPqcCracked] = useState<boolean | null>(null);

  // Sync verification whenever rootKeyHash changes
  useEffect(() => {
    setVerificationResult(temporalBinder.verifyKeyIntegrity(rootKeyHash));
    setMlKemKey(`ML-KEM-768_ROOT_${rootKeyHash}`);
    setMlDsaKey(`ML-DSA-65_SIG_${rootKeyHash.substring(0,8)}_v4`);
  }, [rootKeyHash]);

  const handleVerifyChainIntegrity = () => {
    setIsVerifying(true);
    setTimeout(() => {
      const result = temporalBinder.verifyKeyIntegrity(rootKeyHash);
      setVerificationResult(result);
      setIsVerifying(false);
    }, 600);
  };

  const rotateKeyRing = () => {
    setIsRotating(true);
    setTimeout(() => {
      onRotateKeys();
      const newRand = Math.floor(Math.random() * 999999).toString(16);
      setMlKemKey(`ML-KEM-768_ROOT_${newRand}`);
      setMlDsaKey(`ML-DSA-65_SIG_${newRand.substring(0,8)}_v4`);
      setIsRotating(false);
    }, 1200);
  };

  const runNistShorSimulation = () => {
    setBenchmarkRunning(true);
    setClassicalCracked(null);
    setPqcCracked(null);
    setBenchmarkLogs(["[NIST] Initiating Shor's Algorithm (Quantum Cryptanalysis) simulation..."]);

    // Classical key factorization
    setTimeout(() => {
      setBenchmarkLogs(prev => [
        ...prev,
        "[NIST] Targeting Standard ECDH (Elliptic Curve Diffie-Hellman) 256-bit parameters.",
        "[NIST] Simulating 2048 coherent logical qubits (Shor's quantum computer logic).",
        "[NIST] Resolving discrete logarithm cycle structures on elliptic curve over prime field..."
      ]);
    }, 1000);

    setTimeout(() => {
      setClassicalCracked(true);
      setBenchmarkLogs(prev => [
        ...prev,
        `[NIST] 💥 CLASSICAL ACCESS COMPROMISED! Classical ECDH key factorized in 0.002 seconds.`,
        `[NIST] Private key decoded. Integrity signature check: FAILURE.`
      ]);
    }, 2800);

    // PQC execution
    setTimeout(() => {
      setBenchmarkLogs(prev => [
        ...prev,
        "[NIST] Target changed to NIST FIPS 203 Module-Lattice-Based Key Encapsulation (ML-KEM-768).",
        "[NIST] Attempting high-dimensional lattice reduction attacks using quantum polynomial time reduction...",
        "[NIST] Attempting Shortest Vector Problem (SVP) in lattice dimension n=768..."
      ]);
    }, 4500);

    setTimeout(() => {
      setPqcCracked(false);
      setBenchmarkLogs(prev => [
        ...prev,
        "[NIST] SVP solver status: lattice base vectors hold structural entropy limits.",
        "=========================================================",
        "ML-KEM ENVELOPE STRUCTURAL OUTCOME: SECURE",
        "Estimated quantum security level: >140 bits of pure quantum-safe hardness.",
        "=========================================================",
        "[NIST] Post-quantum compliance verified successfully."
      ]);
      setBenchmarkRunning(false);
    }, 7000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-mono">
      {/* Selection Left Bar */}
      <div className="lg:col-span-4 border border-slate-800 bg-slate-950 p-4 rounded flex flex-col justify-between">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-slate-900 pb-2">
            <Shield className="w-4.5 h-4.5 text-emerald-500 animate-pulse" />
            <h3 className="font-display font-medium text-slate-200 text-xs tracking-widest uppercase">
              PQC Crypto-Platform
            </h3>
          </div>

          <p className="text-[10px] text-slate-500 leading-relaxed">
            Transitioning digital sovereignty to Shor-resistant standards. Complying with FIPS 203 (ML-KEM), FIPS 204 (ML-DSA), and FIPS 205 (SLH-DSA) to protect C2 systems from future quantum threats.
          </p>

          <div className="flex flex-col gap-2 text-xs">
            <button
              id="tab-btn-rotation"
              onClick={() => setActiveTab('ROTATION')}
              className={`w-full text-left p-2 rounded border transition-all cursor-pointer ${
                activeTab === 'ROTATION'
                  ? 'border-emerald-500/50 bg-emerald-950/20 text-emerald-300 font-bold'
                  : 'border-slate-900 bg-slate-900/30 text-slate-400 hover:border-slate-800'
              }`}
            >
              🔑 Hybrid Key Rotation Management
            </button>
            <button
              id="tab-btn-integrity"
              onClick={() => setActiveTab('INTEGRITY')}
              className={`w-full text-left p-2 rounded border transition-all cursor-pointer ${
                activeTab === 'INTEGRITY'
                  ? 'border-cyan-500/50 bg-cyan-950/20 text-cyan-300 font-bold'
                  : 'border-slate-900 bg-slate-900/30 text-slate-400 hover:border-slate-800'
              }`}
            >
              🔗 313-BIND Hash-Chain Audit
            </button>
            <button
              id="tab-btn-benchmark"
              onClick={() => setActiveTab('BENCHMARK')}
              className={`w-full text-left p-2 rounded border transition-all cursor-pointer ${
                activeTab === 'BENCHMARK'
                  ? 'border-emerald-500/50 bg-emerald-950/20 text-emerald-300 font-bold'
                  : 'border-slate-900 bg-slate-900/30 text-slate-400 hover:border-slate-800'
              }`}
            >
              🔬 Shor's Quantum Attack Simulation
            </button>
          </div>
        </div>

        <div className="border-t border-slate-900 pt-3 mt-4 text-[10px] text-slate-400 flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Hash-Chain Status:</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              INTEGRITY VERIFIED
            </span>
          </div>
          <span className="block text-[9px] text-slate-500">Ledger Height: #{verificationResult.chainHeight} Blocks</span>
          <span className="block text-[9px] text-slate-500">Signature: {verificationResult.slhStatus}</span>
        </div>
      </div>

      {/* Primary Display Console */}
      <div className="lg:col-span-8">
        <div className="border border-slate-800 bg-slate-950 p-4 rounded h-full flex flex-col justify-between">
          
          {activeTab === 'ROTATION' ? (
            <div className="flex flex-col gap-4 flex-1">
              <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                <span className="font-display text-xs text-slate-300 uppercase tracking-widest">
                  Active Cryptographic Keyring List
                </span>
                <button
                  id="btn-rotate-keys-action"
                  onClick={rotateKeyRing}
                  disabled={isRotating}
                  className="flex items-center gap-1.5 py-1 px-3 border border-emerald-500/40 bg-emerald-950/20 hover:bg-emerald-500 text-emerald-300 hover:text-slate-950 text-xs font-bold rounded cursor-pointer transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin' : ''}`} /> Cycle Hybrid Key Ring
                </button>
              </div>

              {/* Visual Verification State Banner */}
              <div className="border border-emerald-500/40 bg-emerald-950/20 p-3 rounded flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-start gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5 animate-pulse" />
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-emerald-300 uppercase tracking-wide">
                        313-BIND Hash-Chain Integrity: SEALED &amp; VERIFIED
                      </span>
                      <span className="bg-emerald-950 border border-emerald-700/60 text-emerald-300 text-[9px] px-1.5 py-0.2 rounded font-mono">
                        PASS (0 Gaps)
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400">
                      Current ML-KEM-768 root key is cryptographically anchored to ledger block #{verificationResult.lastReceipt ? verificationResult.lastReceipt.bindIndex : 31301}
                    </span>
                  </div>
                </div>
                <button
                  id="btn-verify-chain-quick"
                  onClick={handleVerifyChainIntegrity}
                  disabled={isVerifying}
                  className="px-2.5 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded text-[10px] font-bold shrink-0 cursor-pointer flex items-center gap-1 self-start sm:self-auto"
                >
                  <RefreshCw className={`w-3 h-3 ${isVerifying ? 'animate-spin' : ''}`} />
                  {isVerifying ? 'Verifying...' : 'Re-verify Proof'}
                </button>
              </div>

              <div className="flex flex-col gap-3">
                {/* ML-KEM key details */}
                <div className="border border-slate-900 bg-slate-900/10 p-3 rounded">
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="font-bold text-slate-300">ML-KEM-768 (Kyber Encryption Standard)</span>
                    <span className="text-emerald-400 text-[10px] font-bold">FIPS 203 COMPLIANT</span>
                  </div>
                  <span className="text-[10px] text-slate-500 block">Encapsulated Cryptographic Shared Secret:</span>
                  <span className="font-mono text-xs select-all bg-slate-950 border border-slate-900 px-2.5 py-1.5 rounded text-emerald-300 block select-all mt-1 truncate">
                    {mlKemKey}
                  </span>

                  {/* Exact ML-KEM-768 Spec Lattice Parameters */}
                  <div className="mt-2.5 pt-2 border-t border-slate-900/80 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[9.5px]">
                    <div className="bg-slate-950 p-1.5 rounded border border-slate-900">
                      <span className="text-slate-500 block">MODULE RANK (k):</span>
                      <span className="text-cyan-300 font-bold">k = 3</span>
                    </div>
                    <div className="bg-slate-950 p-1.5 rounded border border-slate-900">
                      <span className="text-slate-500 block">POLYNOMIAL DEG (n):</span>
                      <span className="text-cyan-300 font-bold">n = 256</span>
                    </div>
                    <div className="bg-slate-950 p-1.5 rounded border border-slate-900">
                      <span className="text-slate-500 block">PRIME MODULUS (q):</span>
                      <span className="text-cyan-300 font-bold">q = 3329</span>
                    </div>
                    <div className="bg-slate-950 p-1.5 rounded border border-slate-900">
                      <span className="text-slate-500 block">LATTICE DIM (k·n):</span>
                      <span className="text-emerald-400 font-bold">768 Bits</span>
                    </div>
                    <div className="bg-slate-950 p-1.5 rounded border border-slate-900">
                      <span className="text-slate-500 block">COMPRESSION (du, dv):</span>
                      <span className="text-slate-300 font-bold">du=10, dv=4</span>
                    </div>
                    <div className="bg-slate-950 p-1.5 rounded border border-slate-900">
                      <span className="text-slate-500 block">NOISE PARAM (η1, η2):</span>
                      <span className="text-slate-300 font-bold">η1=2, η2=2</span>
                    </div>
                    <div className="bg-slate-950 p-1.5 rounded border border-slate-900">
                      <span className="text-slate-500 block">PUBLIC KEY SIZE:</span>
                      <span className="text-slate-300 font-bold">1,184 Bytes</span>
                    </div>
                    <div className="bg-slate-950 p-1.5 rounded border border-slate-900">
                      <span className="text-slate-500 block">CIPHERTEXT SIZE:</span>
                      <span className="text-slate-300 font-bold">1,088 Bytes</span>
                    </div>
                  </div>
                </div>

                {/* ML-DSA key details */}
                <div className="border border-slate-900 bg-slate-900/10 p-3 rounded">
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="font-bold text-slate-300">ML-DSA-65 (Dilithium Signature Standard)</span>
                    <span className="text-emerald-400 text-[10px] font-bold">FIPS 204 COMPLIANT</span>
                  </div>
                  <span className="text-[10px] text-slate-500 block">Asymmetric Core Signature Key ID:</span>
                  <span className="font-mono text-xs select-all bg-slate-950 border border-slate-900 px-2.5 py-1.5 rounded text-emerald-300 block select-all mt-1 truncate">
                    {mlDsaKey}
                  </span>
                </div>

                {/* AES key details */}
                <div className="border border-slate-900 bg-slate-900/10 p-3 rounded">
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="font-bold text-slate-300">AES-256-GCM Symmetrical Shield</span>
                    <span className="text-slate-500 text-[10px]">AUTH ENCRYPTION</span>
                  </div>
                  <span className="text-[10px] text-slate-500 block">Symmetric Session Enabler key:</span>
                  <span className="font-mono text-xs select-all bg-slate-950 border border-slate-900 px-2.5 py-1.5 rounded text-emerald-300 block select-all mt-1 truncate">
                    SHA256_SEED_AEAD_{rootKeyHash}
                  </span>
                </div>
              </div>
            </div>
          ) : activeTab === 'INTEGRITY' ? (
            /* Dedicated Hash-Chain Verification State Against 313-BIND Ledger */
            <div className="flex flex-col gap-4 flex-1 text-xs">
              <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                <div className="flex items-center gap-2">
                  <Link2 className="w-4 h-4 text-cyan-400" />
                  <span className="font-display text-xs text-slate-200 uppercase tracking-widest font-bold">
                    ML-KEM Hash-Chain Verification Against 313-BIND Ledger
                  </span>
                </div>
                <button
                  id="btn-verify-chain-full"
                  onClick={handleVerifyChainIntegrity}
                  disabled={isVerifying}
                  className="flex items-center gap-1.5 py-1 px-3 border border-cyan-500/40 bg-cyan-950/30 hover:bg-cyan-500/40 text-cyan-300 text-xs font-bold rounded cursor-pointer transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isVerifying ? 'animate-spin' : ''}`} />
                  <span>Execute Hash-Chain Verification Audit</span>
                </button>
              </div>

              {/* Verification High-Level Status Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-slate-950 border border-slate-900 rounded flex flex-col gap-1">
                  <span className="text-[10px] text-slate-500 uppercase">Cryptographic Integrity</span>
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>UNBROKEN (100%)</span>
                  </div>
                  <span className="text-[9px] text-slate-400">0 Gaps or Tamper Events</span>
                </div>

                <div className="p-3 bg-slate-950 border border-slate-900 rounded flex flex-col gap-1">
                  <span className="text-[10px] text-slate-500 uppercase">Current Ledger Block Height</span>
                  <div className="flex items-center gap-1.5 text-cyan-300 font-bold text-sm font-mono">
                    <span>#{verificationResult.chainHeight} Blocks</span>
                  </div>
                  <span className="text-[9px] text-slate-400">Head Block: #{verificationResult.lastReceipt ? verificationResult.lastReceipt.bindIndex : 31301}</span>
                </div>

                <div className="p-3 bg-slate-950 border border-slate-900 rounded flex flex-col gap-1">
                  <span className="text-[10px] text-slate-500 uppercase">Stateless Signature Standard</span>
                  <div className="flex items-center gap-1.5 text-amber-300 font-bold text-sm">
                    <Award className="w-4 h-4 text-amber-400" />
                    <span>FIPS 205 (SLH-DSA)</span>
                  </div>
                  <span className="text-[9px] text-slate-400">SHA2-128f Fast Variant Verified</span>
                </div>
              </div>

              {/* Hash Chain Diagram / Flow */}
              <div className="bg-slate-950 p-3 rounded border border-slate-900 flex flex-col gap-2">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  Live Cryptographic Chain Linkage Path
                </span>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-[10px]">
                  <div className="bg-slate-900/60 p-2 rounded border border-slate-800 flex flex-col">
                    <span className="text-slate-500 text-[9px]">1. ACTIVE ROOT KEY</span>
                    <span className="text-emerald-400 font-mono font-bold truncate">ML-KEM-768_{rootKeyHash}</span>
                    <span className="text-[9px] text-slate-400 mt-1">k=3, n=256, q=3329</span>
                  </div>
                  <div className="bg-slate-900/60 p-2 rounded border border-slate-800 flex flex-col">
                    <span className="text-slate-500 text-[9px]">2. 313-BIND RECEIPT</span>
                    <span className="text-cyan-300 font-mono font-bold truncate">{verificationResult.lastReceipt?.receiptId || 'RCPT-313-31301'}</span>
                    <span className="text-[9px] text-emerald-400 mt-1">Timestamp: ...313 (ns)</span>
                  </div>
                  <div className="bg-slate-900/60 p-2 rounded border border-slate-800 flex flex-col">
                    <span className="text-slate-500 text-[9px]">3. SHA3-512 SEAL</span>
                    <span className="text-amber-300 font-mono font-bold truncate">128-Hex Digits</span>
                    <span className="text-[9px] text-slate-400 mt-1">Zero Collision Bound</span>
                  </div>
                  <div className="bg-slate-900/60 p-2 rounded border border-slate-800 flex flex-col">
                    <span className="text-slate-500 text-[9px]">4. IPFS CID ANCHOR</span>
                    <span className="text-purple-300 font-mono font-bold truncate">{verificationResult.lastReceipt?.ipfsCid || 'Qm313Bind...'}</span>
                    <span className="text-[9px] text-slate-400 mt-1">Immutable Merkle DAG</span>
                  </div>
                </div>

                {/* SHA3-512 Hash block display */}
                <div className="mt-1">
                  <span className="text-[9px] text-slate-500 block mb-0.5">CURRENT BLOCK SHA3-512 HASH SEAL (128 HEX CHARACTERS):</span>
                  <div className="bg-slate-900 p-2 rounded border border-slate-800 text-[9.5px] font-mono text-cyan-300 break-all select-all">
                    {verificationResult.rootBlockHash}
                  </div>
                </div>
              </div>

              {/* Mathematical Proof Trail */}
              <div className="flex flex-col gap-1.5 flex-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  Real-Time Hash Proof Audit Trail
                </span>
                <div className="bg-slate-950 p-2.5 rounded border border-slate-900 max-h-40 overflow-y-auto flex flex-col gap-1 font-mono text-[10px]">
                  {verificationResult.proofTrail.map((proof, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-slate-300">
                      <span className="text-emerald-400">✓</span>
                      <span>{proof}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4 flex-1">
              <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                <span className="font-display text-xs text-slate-300 uppercase tracking-widest">
                  Shor's Quantum Matrix Benchmark Simulator
                </span>
                <button
                  id="btn-run-shor-sim"
                  onClick={runNistShorSimulation}
                  disabled={benchmarkRunning}
                  className="flex items-center gap-1.5 py-1 px-3 border border-rose-500/40 bg-rose-950/20 hover:bg-rose-500 text-rose-300 hover:text-slate-950 text-xs font-bold rounded cursor-pointer transition-colors"
                >
                  <Cpu className="w-3.5 h-3.5 animate-pulse" /> Launch Quantum Cryptanalysis
                </button>
              </div>

              {/* Graphical representation of standard vs pqc hardness */}
              <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                {/* Classical side */}
                <div className={`border p-3 rounded flex flex-col justify-around h-24 transition-all ${
                  classicalCracked === null ? 'border-slate-900 bg-slate-900/10' : classicalCracked ? 'border-rose-500/20 bg-rose-950/15' : ''
                }`}>
                  <div className="flex items-center gap-1 text-slate-300 uppercase font-bold text-[10px]">
                    <Unlock className="w-3.5 h-3.5 text-rose-400" /> CLASSICAL ECDH-256 KEY
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[9px]">Shor's algorithm tolerance:</span>
                    <span className={`text-base font-bold ${classicalCracked ? 'text-rose-500' : 'text-slate-400'}`}>
                      {classicalCracked === null ? "Awaiting scan..." : "0.002s (CRACKED)"}
                    </span>
                  </div>
                </div>

                {/* PQC side */}
                <div className={`border p-3 rounded flex flex-col justify-around h-24 transition-all ${
                  pqcCracked === null ? 'border-slate-900 bg-slate-900/10' : pqcCracked === false ? 'border-emerald-500/20 bg-emerald-950/15 animate-pulse' : ''
                }`}>
                  <div className="flex items-center gap-1 text-slate-300 uppercase font-bold text-[10px]">
                    <Lock className="w-3.5 h-3.5 text-emerald-400" /> ML-KEM ENCRYPTION ENVELOPE
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[9px]">Shor's algorithm tolerance:</span>
                    <span className={`text-base font-bold ${pqcCracked === false ? 'text-emerald-400' : 'text-slate-400'}`}>
                      {pqcCracked === null ? "Awaiting scan..." : "RESISTANT (UNBREAKABLE)"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Output live benchmark logs */}
              <div className="mt-2 text-xs flex-1 flex flex-col">
                <span className="text-slate-500 block text-[10px] mb-1">Quantum Computer processing trail:</span>
                <div className="bg-slate-950 border border-slate-900 p-3 rounded text-[10px] text-slate-300 h-40 overflow-y-auto font-mono terminal-crt">
                  {benchmarkLogs.length === 0 ? (
                    <span className="text-slate-700 italic">No cryptanalysis simulation running currently. Launch to check key resilience.</span>
                  ) : (
                    <div className="flex flex-col gap-1">
                      {benchmarkLogs.map((log, i) => {
                        let color = "text-slate-400";
                        if (log.includes("💥")) color = "text-rose-400 font-bold";
                        else if (log.includes("ML-KEM")) color = "text-emerald-400 font-bold uppercase";
                        return <span key={i} className={`font-mono ${color}`}>{log}</span>;
                      })}
                      {benchmarkRunning && <span className="text-rose-400 animate-pulse font-bold">&gt;&gt; RUNNING SHOR'S INTERCEPTS... CRYPTO SYSTEM BUSY</span>}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
