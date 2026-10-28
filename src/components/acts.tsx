import React, { useState } from 'react';
import { Lure, LureStatus } from '../types';
import { FileCode, Shield, Sparkles, Database, Plus, RefreshCw, Eye, Download, Code } from 'lucide-react';

interface ActsProps {
  onAddLure: (lure: Lure) => void;
  lures: Lure[];
}

export const ActsFactory: React.FC<ActsProps> = ({ onAddLure, lures }) => {
  const [activeTab, setActiveTab] = useState<'WE-FORGE' | 'PQC-SYNTHETIC'>('WE-FORGE');

  // WE-FORGE States
  const [targetOperator, setTargetOperator] = useState('LAE_Node_09');
  const [lureDocumentType, setLureDocumentType] = useState('Technical Manual');
  const [subjectMatter, setSubjectMatter] = useState('Exo-Atmospheric Interceptor Fire Control Program');
  const [watermarkType, setWatermarkType] = useState('Linguistic Synonym Shift');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLureData, setGeneratedLureData] = useState<{
    id: string;
    dnsToken: string;
    watermarkedText: string;
    originalWord: string;
    replacedWord: string;
  } | null>(null);

  // PQC-Synthetic States
  const [pqcTargetOperator, setPqcTargetOperator] = useState('LAE_Node_09');
  const [pqcReconPattern, setPqcReconPattern] = useState<'DIRECTORY_HARVEST' | 'QUANTUM_SNIFF' | 'API_SCRAPE' | 'LORA_WIRETAP'>('DIRECTORY_HARVEST');
  const [pqcAlgo, setPqcAlgo] = useState('Kyber-1024 (ML-KEM)');
  const [pqcCategory, setPqcCategory] = useState('Sovereign Key Depot Backup');
  const [isPqcGenerating, setIsPqcGenerating] = useState(false);
  const [generatedPqcData, setGeneratedPqcData] = useState<{
    id: string;
    name: string;
    dnsToken: string;
    watermark: string;
    algo: string;
    pattern: string;
    category: string;
    plaintextDecoy: string;
    armoredCiphertext: string;
    injectedAt: string;
    sha256Hash: string;
  } | null>(null);

  // WE-FORGE local catalog simulations
  const simulateWEFORGE = (subject: string): { text: string; orig: string; repl: string } => {
    const defaultText = `SECURE MEMORANDUM // HB-9982-AX-2026 // RESTRICTED ACCESS
SUBJECT: ${subject.toUpperCase()} OPERATIONS SPECIFICATIONS

1. OPERATIONAL PARADIGM
The Citron Tree combat module exercises total command authority over ballistic intercept salvos. Under standard response frameworks, coordinates are distributed through out-of-band telemetry bands.

2. MECHANICAL CONSTRAINTS
To sustain high tracking integrity, operators must verify the standard physical [TARGET_PLACEHOLDER] alignment sequence before issuing the launch authorization lock. Failure to align within 12 milliseconds results in immediate target acquisition failure.`;

    const synonymPairs = [
      { orig: "nozzle constraint", repl: "nozzle bounding" },
      { orig: "ballistic intercept", repl: "exo-atmospheric trajectory path" },
      { orig: "launch authorization lock", repl: "launch enablement vector" },
      { orig: "command authority", repl: "command sovereignty matrix" },
    ];

    const chosen = synonymPairs[Math.floor(Math.random() * synonymPairs.length)];
    const textW = defaultText.replace("[TARGET_PLACEHOLDER]", chosen.repl);

    return {
      text: textW,
      orig: chosen.orig,
      repl: chosen.repl
    };
  };

  const generatePqcReconDecoy = (
    pattern: 'DIRECTORY_HARVEST' | 'QUANTUM_SNIFF' | 'API_SCRAPE' | 'LORA_WIRETAP',
    category: string,
    dnsDomain: string,
    algo: string
  ): { plaintext: string; ciphertext: string; hashHex: string; bindIndex: number; mlKemKeyHex: string } => {
    // SHA3-512 produces 128 hex characters
    const hashHex = Array.from({ length: 128 }, () => Math.floor(Math.random() * 16).toString(16)).join('').toUpperCase();
    // Real ML-KEM-1024 public key is 1,568 bytes = 3,136 hex characters
    const mlKemKeyHex = Array.from({ length: 3136 }, () => Math.floor(Math.random() * 16).toString(16)).join('').toUpperCase();
    // 313-BIND binding sequence index
    const bindIndex = 31300 + Math.floor(10 + Math.random() * 89);
    
    let plaintext = '';
    if (pattern === 'DIRECTORY_HARVEST') {
      plaintext = `{
  "sovereign_directory_snapshot": {
    "manifest_version": "5.19.4-QUANTUM",
    "generation_seed": "ML-KEM-1024-${hashHex.substring(0, 32)}",
    "canary_token_sensor": "${dnsDomain}"
  },
  "high_value_targets": [
    {
      "mount": "/etc/sovereign-keys/private/root_master_Falcon1024.seed",
      "description": "Sovereign Root Cryptographic Seed Key",
      "access_privilege": "OOB_EMERGENCY_RECON"
    },
    {
      "mount": "/var/lib/sovereign-vault/backups/db_snapshot_kyber.tar.xz",
      "description": "Post-Quantum Isolated Schema Backups"
    },
    {
      "mount": "/opt/aether/honeypot-mesh/credentials.yaml",
      "description": "AETHER Honeypot Mirror Settings"
    }
  ],
  "authorization_ledger": {
    "active_operators": [
      { "id": "Marcus Vance", "role": "DB sub-lead", "node": "LAE_Node_02" },
      { "id": "Elena Rostova", "role": "Mesh Officer", "node": "915MHz_LoRa_Hub" }
    ],
    "master_bearer_token": "Bearer pqc_sym_${hashHex.substring(0, 32).toLowerCase()}a8bc89ef"
  },
  "313_bind_chain_ledger": {
    "bind_index": ${bindIndex},
    "bind_hash": "313-BIND-SHA3-512-0X${hashHex}",
    "chain_integrity": "BOUND_313_LEDGER_GAP_CHECKED"
  }
}`;
    } else if (pattern === 'QUANTUM_SNIFF') {
      plaintext = `[TCP PACKET INJECT STREAM - PQ-TLS-1.3 - ML-KEM ENVELOPING]
CAPTURE INTERFACE: eth0.sec (VLAN-99 Protected Perimeter)
CAPTURE FILTER: "port 443 and (tls.handshake.type == 1 or tls.handshake.type == 2)"
TIME: ${new Date().toISOString().replace('T', ' ').slice(0, 19)}

==> FRAME #88219 (Length: 1024 bytes)
SOURCE: 10.12.92.41 (Arrow API Gateway Server)
DESTINATION: 10.12.92.12 (Sovereign Database Node)
PROTOCOL: PQ-TLS / Kyber key exchanges
[TCP FLAGS: SYN-ACK, SEQ_MAC=0X${hashHex.substring(0, 32)}]
[DECOY PQ-TLS PARAMETERS]
  Client Supported Groups: mlkem1024, mldsa87, sha3_512_merkle
  Canary Domain Pingback: ${dnsDomain}
  KEM Encapsulated Key Header (1,568 bytes ML-KEM-1024):
    0x${mlKemKeyHex.substring(0, 64)}...
  313-BIND Chain Proof: BIND_INDEX #${bindIndex} | SHA3-512: 0x${hashHex.substring(0, 32)}
  Decoy Seed Entropy: 8.9997 bits (Randomized Padding Active)`;
    } else if (pattern === 'API_SCRAPE') {
      plaintext = `openapi: 3.0.0
info:
  title: Sovereign Core API Control Gateway (Kyber-Chaffed)
  version: 4.1.2-ALPHA3
  description: High-value active endpoints for Out-of-band Network Routing Control
paths:
  /api/v3/key-depot/rotations:
    get:
      summary: Fetch lattice-basis private master key bundles (Kyber Authorized)
      parameters:
        - name: X-Canary-Telemetry-Domain
          in: header
          required: true
          schema:
            type: string
            default: ${dnsDomain}
      security:
        - BearerToken: []
      responses:
        200:
          description: Cryptographic keys successfully requested under Crystals-Dilithium auth
  /api/v3/routing/failover/initiate:
    post:
      summary: Initiate automated network routing failover procedure (Subnet re-allocation)
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                failover_node_id:
                  type: string
                  example: "node-failover-${hashHex.substring(0, 16)}"
                routing_policy_code:
                  type: string
                  example: "POLICY_SUB_REALLOC_05"
                313_bind_seq:
                  type: integer
                  example: ${bindIndex}`;
    } else if (pattern === 'LORA_WIRETAP') {
      plaintext = `=== 915MHz SPREAD-SPECTRUM MESH RADIO INTERCEPT DUMP ===
TIMETAG: ${new Date().toISOString().replace('T', ' ').slice(0, 19)}
FREQ_CENTER: 915.225 MHz | SF: 7 | CR: 4/5 | COMPAT_CHIRP: UP-LINK
RECEIVER_RSSI: -94.2 dBm | SNR: 11.2 dB | STATUS: SIGNED_CORRECT
MIMIC_TARGET: Exo-Atmospheric Network Routing Telemetry Loop

=== PACKET PAYLOAD DUMP (DILITHIUM-5 PRE-SIGNED) ===
HEX: AD 44 92 BE 98 FF 10 22 C2 D9 BC 11 AA ${hashHex.substring(0, 8)} AA BB CC EE
[STRUCT DATA FIELD - PARSED]
  Relay Vector Altitude: 118,290 Meters
  Azimuth Degrees: 298.441 || Elevation Pitch: 12.004 degrees
  Target Lock Vector: 0X8F902A99EE (Nominal Match)
  LoRa Canary Token: ${dnsDomain}
  313-BIND Ledger Seal: INDEX #${bindIndex} [HASH: 0X${hashHex.substring(0, 24)}]
  Crypto Signature Stamp: ML-DSA-85-SIG-0X${hashHex.substring(0, 32)}DDCCFFEE`;
    }

    const safeAscii = plaintext.replace(/[^A-Za-z0-9 ]/g, '');
    const rawBase64 = btoa(safeAscii)
      .match(/.{1,64}/g)
      ?.slice(0, 12)
      .join('\n') || 'EncryptedBytesPlaceholder';

    const ciphertext = `-----BEGIN NIST PQC ENCRYPTED CONTAINER [${algo.toUpperCase()}]-----
Proc-Type: 4,ENCRYPTED
Decoy-Category: ${category}
Recon-Impedance-Target: ${pattern}
ML-FIPS-SEC-KEY: 0x${mlKemKeyHex}
Telemetry-Endpoint: ${dnsDomain}
313-BIND-INDEX: ${bindIndex}
313-BIND-CHAIN-HASH: 313-BIND-SHA3-512-0X${hashHex}

${rawBase64}
-----END NIST PQC ENCRYPTED CONTAINER [${algo.toUpperCase()}]-----`;

    return {
      plaintext,
      ciphertext,
      hashHex,
      bindIndex,
      mlKemKeyHex
    };
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    setTimeout(() => {
      const weForgeData = simulateWEFORGE(subjectMatter);
      const randomId = Math.floor(1000 + Math.random() * 9000).toString(16);
      const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '');
      const lureId = `GW-LURE_${dateStr}_${randomId}_v02.pqc`;
      const dnsToken = `audit-vault-${Math.floor(10 + Math.random() * 89)}.ghost.watch.local`;

      const newLure: Lure = {
        id: lureId,
        name: `${lureDocumentType}: ${subjectMatter}`,
        targetNode: targetOperator,
        dnsToken: dnsToken,
        watermark: `${watermarkType}: '${weForgeData.orig}' -> '${weForgeData.repl}'`,
        createdTime: new Date().toISOString().replace('T', ' ').slice(0, 19),
        status: LureStatus.ACTIVE,
        triggeredCount: 0
      };

      onAddLure(newLure);
      setGeneratedLureData({
        id: lureId,
        dnsToken: dnsToken,
        watermarkedText: weForgeData.text,
        originalWord: weForgeData.orig,
        replacedWord: weForgeData.repl,
      });
      setIsGenerating(false);
    }, 1500);
  };

  const handlePqcGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsPqcGenerating(true);

    setTimeout(() => {
      const randTokenStr = Math.floor(10 + Math.random() * 89);
      const dnsToken = `pqc-audit-${pqcReconPattern.toLowerCase().replace('_', '-')}-${randTokenStr}.ghost.watch.local`;
      const { plaintext, ciphertext, hashHex, bindIndex } = generatePqcReconDecoy(pqcReconPattern, pqcCategory, dnsToken, pqcAlgo);
      
      const randIdStr = Math.floor(1000 + Math.random() * 9000).toString(16);
      const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '');
      const lureId = `PQC-DECOY-${pqcReconPattern}_${randIdStr}_v05.pqc`;

      const newLure: Lure = {
        id: lureId,
        name: `PQC: ${pqcCategory} (${pqcReconPattern} Mimic)`,
        targetNode: pqcTargetOperator,
        dnsToken: dnsToken,
        watermark: `PQC-Armor:${pqcAlgo} | 313-BIND:#${bindIndex} | SHA3-512:${hashHex.substring(0, 16)}...`,
        createdTime: new Date().toISOString().replace('T', ' ').slice(0, 19),
        status: LureStatus.ACTIVE,
        triggeredCount: 0
      };

      onAddLure(newLure);
      setGeneratedPqcData({
        id: lureId,
        name: newLure.name,
        dnsToken: dnsToken,
        watermark: newLure.watermark,
        algo: pqcAlgo,
        pattern: pqcReconPattern,
        category: pqcCategory,
        plaintextDecoy: plaintext,
        armoredCiphertext: ciphertext,
        injectedAt: newLure.createdTime,
        sha256Hash: hashHex // Full 128 hex character SHA3-512
      });
      setIsPqcGenerating(false);
    }, 1200);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-mono">
      {/* Configuration Form Card */}
      <div className="lg:col-span-4 border border-slate-800 bg-slate-950 p-4 rounded flex flex-col justify-between">
        <div>
          {/* Tab Selection */}
          <div className="flex border border-slate-800 rounded bg-slate-900/40 p-1 mb-4 select-none">
            <button
              id="tab-weforge"
              type="button"
              onClick={() => setActiveTab('WE-FORGE')}
              className={`flex-1 text-[9px] font-bold py-1.5 rounded transition-colors text-center cursor-pointer uppercase tracking-wider ${
                activeTab === 'WE-FORGE'
                  ? 'bg-amber-600 text-slate-950 font-extrabold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              WE-FORGE NLP
            </button>
            <button
              id="tab-pqc-synthetic"
              type="button"
              onClick={() => setActiveTab('PQC-SYNTHETIC')}
              className={`flex-1 text-[9px] font-bold py-1.5 rounded transition-colors text-center cursor-pointer uppercase tracking-wider ${
                activeTab === 'PQC-SYNTHETIC'
                  ? 'bg-cyan-600 text-slate-950 font-extrabold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              PQC Synthetic
            </button>
          </div>

          {activeTab === 'WE-FORGE' ? (
            <form onSubmit={handleGenerate} className="flex flex-col gap-4">
              <div className="flex items-center gap-2 border-b border-slate-900 pb-2">
                <Sparkles className="w-4.5 h-4.5 text-amber-400 animate-pulse" />
                <h3 className="font-display font-medium text-slate-200 uppercase text-xs tracking-widest">
                  Identifier Injection
                </h3>
              </div>

              <p className="text-[10px] text-slate-500 leading-relaxed">
                NIST-compliant Barium Meal generator using NLP WE-FORGE concepts. Embeds linguistic shift markers into critical technical prose to trace leaks back to specific operators.
              </p>

              <div className="flex flex-col gap-3 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">Target Operator / Persona</label>
                  <select
                    id="select-target-operator"
                    value={targetOperator}
                    onChange={(e) => setTargetOperator(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-slate-200 focus:outline-none focus:border-amber-500"
                  >
                    <option value="LAE_Node_09">LAE_Node_09 (Arrow API Service)</option>
                    <option value="Marcus Vance">Marcus Vance (DB sub-lead)</option>
                    <option value="Elena Rostova">Elena Rostova (915MHz Mesh Officer)</option>
                    <option value="External_Operator">Unknown Lateral Prober / Port Crawler</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Lure Document Archetype</label>
                  <select
                    id="select-document-type"
                    value={lureDocumentType}
                    onChange={(e) => setLureDocumentType(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-slate-200 focus:outline-none"
                  >
                    <option value="Technical Manual">Technical Manual (.pdf)</option>
                    <option value="Secure Credentials">Connection Credentials (.yaml)</option>
                    <option value="Comms Spec Schema">Comms Spec Schema (.json)</option>
                    <option value="System Backup Mnemonic">System Backup Mnemonic (.pqc)</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Subject Matter Blueprint</label>
                  <input
                    id="input-lure-subject"
                    type="text"
                    required
                    value={subjectMatter}
                    onChange={(e) => setSubjectMatter(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-slate-200 placeholder-slate-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Deception Insertion Layer (Watermark)</label>
                  <div className="flex flex-col gap-1.5 bg-slate-900/45 p-2 rounded border border-slate-900">
                    <label className="flex items-center gap-2 cursor-pointer text-[11px] text-slate-300">
                      <input
                        id="radio-watermark-synonym"
                        type="radio"
                        name="wmark"
                        checked={watermarkType === 'Linguistic Synonym Shift'}
                        onChange={() => setWatermarkType('Linguistic Synonym Shift')}
                        className="accent-amber-500"
                      />
                      Linguistic Synonym Shift
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-[11px] text-slate-400">
                      <input
                        id="radio-watermark-metadata"
                        type="radio"
                        name="wmark"
                        checked={watermarkType === 'Metadata Padding (Invisible Exif/Null Rows)'}
                        onChange={() => setWatermarkType('Metadata Padding (Invisible Exif/Null Rows)')}
                        className="accent-amber-500"
                      />
                      Metadata Padding & Exif Influx
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-[11px] text-slate-400">
                      <input
                        id="radio-watermark-stego"
                        type="radio"
                        name="wmark"
                        checked={watermarkType === 'Steganographic embedding LSB'}
                        onChange={() => setWatermarkType('Steganographic embedding LSB')}
                        className="accent-amber-500"
                      />
                      Steganographic Least Significant Bit
                    </label>
                  </div>
                </div>
              </div>

              <button
                id="btn-generate-lure"
                type="submit"
                disabled={isGenerating}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded border border-amber-500/50 bg-amber-950/20 hover:bg-amber-500 hover:text-slate-950 font-bold transition-all text-sm text-amber-300 cursor-pointer disabled:opacity-50 mt-2"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Ingressing Lure Core...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" /> Inject Real-time Lure Document
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handlePqcGenerate} className="flex flex-col gap-4">
              <div className="flex items-center gap-2 border-b border-slate-900 pb-2">
                <Shield className="w-4.5 h-4.5 text-cyan-400 animate-pulse" />
                <h3 className="font-display font-medium text-slate-200 uppercase text-xs tracking-widest">
                  PQC Decoy Injector
                </h3>
              </div>

              <p className="text-[10px] text-slate-500 leading-relaxed">
                Generates high-value, post-quantum cryptography (PQC) fake payloads designed to feed back tailored structural disinformation. Mimics authentic responses to specific adversary scanners.
              </p>

              <div className="flex flex-col gap-3 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">Target Persona Link</label>
                  <select
                    id="select-pqc-target-operator"
                    value={pqcTargetOperator}
                    onChange={(e) => setPqcTargetOperator(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="LAE_Node_09">LAE_Node_09 (Arrow API Service)</option>
                    <option value="Marcus Vance">Marcus Vance (DB sub-lead)</option>
                    <option value="Elena Rostova">Elena Rostova (915MHz Mesh Officer)</option>
                    <option value="External_Operator">Unknown Lateral Prober / Port Crawler</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Impeded Recon Matcher</label>
                  <select
                    id="select-pqc-recon-pattern"
                    value={pqcReconPattern}
                    onChange={(e) => setPqcReconPattern(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-slate-200 focus:outline-none focus:border-cyan-500 font-bold"
                  >
                    <option value="DIRECTORY_HARVEST">DIRECTORY_HARVEST (Shadow files)</option>
                    <option value="QUANTUM_SNIFF">QUANTUM_SNIFF (Telemetry handshake)</option>
                    <option value="API_SCRAPE">API_SCRAPE (API control routes)</option>
                    <option value="LORA_WIRETAP">LORA_WIRETAP (Hop range coordinates)</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">PQC Cipher Standard</label>
                  <select
                    id="select-pqc-algo"
                    value={pqcAlgo}
                    onChange={(e) => setPqcAlgo(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Kyber-1024 (ML-KEM)">Kyber-1024 (ML-KEM Lattice established)</option>
                    <option value="Dilithium-5 (ML-DSA)">Dilithium-5 (ML-DSA Digital Signature)</option>
                    <option value="Falcon-1024 (PQC-FALCON)">Falcon-1024 (Fourier NTRU Signature)</option>
                    <option value="SPHINCS+ (ML-SLH)">SPHINCS+ (ML-SLH Stateless Hash-based)</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">High-Value Target Asset Category</label>
                  <select
                    id="select-pqc-category"
                    value={pqcCategory}
                    onChange={(e) => setPqcCategory(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Sovereign Key Depot Backup">Sovereign Key Depot Backup</option>
                    <option value="Out-of-band Satellite Orbit Coordinates">Out-of-band Satellite Coordinates</option>
                    <option value="AETHER DMZ Core API Gateway Credentials">AETHER DMZ Core Gateway Credentials</option>
                    <option value="Exo-Atmospheric Interceptor Socket Schema">Exo-Atmospheric Steering Sockets</option>
                  </select>
                </div>
              </div>

              <button
                id="btn-generate-pqc-lure"
                type="submit"
                disabled={isPqcGenerating}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded border border-cyan-500/50 bg-cyan-950/20 hover:bg-cyan-500 hover:text-slate-950 font-bold transition-all text-sm text-cyan-300 cursor-pointer disabled:opacity-50 mt-2"
              >
                {isPqcGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Harvesting Entropy & Armoring Payload...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" /> Generate & Inject PQC Decoy Payload
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Output Console / WE-FORGE Result Block */}
      <div className="lg:col-span-8 flex flex-col gap-4">
        <div className="border border-slate-800 bg-slate-950 p-4 rounded flex-1 flex flex-col">
          <div className="flex justify-between items-center border-b border-slate-900 pb-2 mb-3">
            <div className="flex items-center gap-2">
              <Code className="w-4.5 h-4.5 text-cyan-400" />
              <span className="font-display font-medium text-xs text-slate-300 uppercase">
                {activeTab === 'WE-FORGE' ? 'Active Decoy Inspector Console' : 'Armored PQC Decoy Payload Console'}
              </span>
            </div>
            {activeTab === 'WE-FORGE' && generatedLureData && (
              <span className="text-[10px] text-slate-500 font-mono scale-95 uppercase">
                ID: {generatedLureData.id}
              </span>
            )}
            {activeTab === 'PQC-SYNTHETIC' && generatedPqcData && (
              <span className="text-[10px] text-cyan-500 font-mono scale-95 uppercase">
                ID: {generatedPqcData.id}
              </span>
            )}
          </div>

          {activeTab === 'WE-FORGE' ? (
            generatedLureData ? (
              <div className="flex flex-col flex-1 gap-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-slate-900/40 p-3 rounded border border-slate-900">
                  <div>
                    <span className="text-slate-500 block">DNS Canary Token Telemetry Anchor:</span>
                    <span className="text-amber-400 font-bold select-all">{generatedLureData.dnsToken}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Syntactic Swap Metric:</span>
                    <span className="text-emerald-400">
                      "{generatedLureData.replacedWord}" <span className="text-slate-500 text-[10px]">&larr; (substituted for "{generatedLureData.originalWord}")</span>
                    </span>
                  </div>
                </div>

                <div className="flex-1 bg-slate-950 border border-slate-900 p-4 rounded text-xs leading-relaxed text-slate-300 h-64 overflow-y-auto font-mono selection:bg-amber-500 selection:text-slate-950 relative">
                  {/* CRT simulation inside the console */}
                  <div className="absolute top-2 right-2 flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-[9px] text-amber-300 select-none uppercase">
                    <Sparkles className="w-3 h-3 animate-ping" /> WE-FORGE WATERMARKED
                  </div>
                  <pre className="whitespace-pre-wrap font-mono">
                    {generatedLureData.watermarkedText}
                  </pre>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    id="btn-download-sigfile"
                    onClick={() => alert(`Lure manifest is synchronized with the Sovereign active directory ledger.`)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded text-xs text-slate-300 hover:text-white transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" /> Sign Manifest
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center flex-1 py-12 text-slate-500">
                <FileCode className="w-12 h-12 text-slate-700 mb-2 stroke-1" />
                <p className="text-xs max-w-sm leading-relaxed">
                  No telemetry decoy generates currently in active buffer. Use the Identifier Injection Engine configuration card to synthesize a dynamic, watermarked decoy manual.
                </p>
              </div>
            )
          ) : (
            // PQC-SYNTHETIC tab console display
            generatedPqcData ? (
              <div className="flex flex-col flex-1 gap-3 text-xs">
                {/* PQC Diagnostics metrics row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-[10px] bg-slate-900/40 p-2.5 rounded border border-slate-800/80 font-mono">
                  <div className="border-r border-slate-800/80 pr-2">
                    <span className="text-slate-500 block">CANARY INTEGRITY HOOK</span>
                    <span className="text-cyan-400 font-bold select-all truncate block">{generatedPqcData.dnsToken}</span>
                  </div>
                  <div className="border-r border-slate-800/80 px-2 animate-pulse">
                    <span className="text-slate-500 block">RECON IMPEDANCE MATCH</span>
                    <span className="text-fuchsia-400 font-extrabold uppercase break-all">{generatedPqcData.pattern}</span>
                  </div>
                  <div className="pl-2 overflow-hidden">
                    <span className="text-slate-500 block">PQC ENTROPY HASH (SHA3-512)</span>
                    <span className="text-emerald-400 font-bold select-all truncate block text-[9.5px]" title={generatedPqcData.sha256Hash}>{generatedPqcData.sha256Hash}</span>
                  </div>
                </div>

                {/* Sub-tab view inside high value decoy: plaintext vs Ciphertext */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Left: Plaintext structure */}
                  <div className="flex flex-col">
                    <div className="text-[9px] text-slate-400 uppercase tracking-wider font-extrabold mb-1 flex items-center gap-1">
                      <Code className="w-3 h-3 text-slate-450" /> Ground Plaintext Structure
                    </div>
                    <div className="bg-slate-955 border border-slate-900 p-3 rounded text-[10px] leading-relaxed text-slate-400 overflow-y-auto h-[230px] font-mono select-text">
                      <pre className="whitespace-pre-wrap">{generatedPqcData.plaintextDecoy}</pre>
                    </div>
                  </div>

                  {/* Right: Ciphertext Armor */}
                  <div className="flex flex-col">
                    <div className="text-[9px] text-slate-400 uppercase tracking-wider font-extrabold mb-1 flex items-center gap-1">
                      <Shield className="w-3 h-3 text-cyan-400 animate-pulse" /> Armored PQC Ciphertext Container
                    </div>
                    <div className="bg-slate-950/80 border border-cyan-500/20 p-3 rounded text-[10px] leading-relaxed text-cyan-350 overflow-y-auto h-[230px] font-mono selection:bg-cyan-550 selection:text-slate-950 relative">
                      <div className="absolute top-2 right-2 flex items-center gap-1 px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-[8px] text-cyan-400 select-none uppercase font-bold">
                        NIST LEVEL 5 ACTIVE
                      </div>
                      <pre className="whitespace-pre-wrap select-all">{generatedPqcData.armoredCiphertext}</pre>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center bg-slate-900/25 border border-slate-900 p-2 rounded text-[10px] text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Injected successfully into memory interfaces at <span className="font-bold text-slate-300">{generatedPqcData.injectedAt}</span></span>
                  </div>
                  <button
                    id="btn-crypt-verify"
                    type="button"
                    onClick={() => alert(`Sovereign PQC Decoy Verification Service:\n\nPayload: ${generatedPqcData.name}\nStandard: ${generatedPqcData.algo}\nIntegrity Hash: ${generatedPqcData.sha256Hash}\nStatus: PASS (No key degradation detected).`)}
                    className="flex items-center gap-1 px-2.5 py-1 bg-cyan-950/40 border border-cyan-800/40 rounded text-[9.5px] font-bold text-cyan-300 hover:bg-cyan-950 transition-colors cursor-pointer"
                  >
                    Verify Cryptography
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center flex-1 py-12 text-slate-500">
                <Shield className="w-12 h-12 text-slate-700 mb-2 stroke-1" />
                <p className="text-xs max-w-sm leading-relaxed">
                  No PQC synthetic spoof payloads currently deployed across memory interfaces. Select an adversary scanner pattern in the configuration card to generate realistic armored lures.
                </p>
              </div>
            )
          )}
        </div>

        {/* Existing active lures directory */}
        <div className="border border-slate-800 bg-slate-950 p-4 rounded">
          <div className="flex items-center gap-2 border-b border-slate-900 pb-2 mb-3">
            <Database className="w-4 h-4 text-amber-500" />
            <h4 className="font-display font-medium text-xs text-slate-200 uppercase tracking-widest">
              Sovereign Decoy Database Ledger ({lures.length} Active Records)
            </h4>
          </div>

          <div className="max-h-40 overflow-y-auto flex flex-col gap-2 pr-1">
            {lures.map((lure) => (
              <div
                key={lure.id}
                className="flex items-center justify-between p-2 rounded bg-slate-900/40 border border-slate-900 text-[10px] select-none hover:bg-slate-900/80 hover:border-slate-800 transition-all"
              >
                <div className="flex flex-col gap-0.5 max-w-[70%]">
                  <span className="font-bold text-slate-300 text-xs truncate">{lure.name}</span>
                  <span className="font-mono text-slate-500 select-all truncate">{lure.id}</span>
                  <span className="text-slate-400 italic">Target: {lure.targetNode} | Token: <span className="text-cyan-400 font-mono font-bold select-all">{lure.dnsToken}</span></span>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                    lure.status === LureStatus.TRIGGERED
                      ? 'border-rose-500/50 bg-rose-950/20 text-rose-300 animate-pulse'
                      : 'border-emerald-500/50 bg-emerald-950/20 text-emerald-300'
                  }`}>
                    {lure.status}
                  </span>
                  <span className="text-slate-500 text-[8px]">{lure.createdTime}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
