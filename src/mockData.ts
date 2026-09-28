import { Lure, LureStatus, ThreatEvent, ThreatLevel, NetworkNode, NodeType, NetworkLink, BSAUProfile, RiskLevel } from './types';

export const INITIAL_LURES: Lure[] = [
  {
    id: "GW-LURE_20260510_7f3a_v02.pqc",
    name: "Lithium-Ion Space-Frame Propulsion Manual",
    targetNode: "LAE_Node_09",
    dnsToken: "audit-vault-49.ghost.watch.local",
    watermark: "synonym-shift: 'nozzle constraint' -> 'nozzle bounding'",
    createdTime: "2026-05-10 14:22:05",
    status: LureStatus.ACTIVE,
    triggeredCount: 0
  },
  {
    id: "GW-LURE_20260512_8a2d_v02.pqc",
    name: "Submarine Acoustic Signature Profile v1.9",
    targetNode: "NSITA_Agent_Alpha",
    dnsToken: "sonar-telemetry-11.ghost.watch.local",
    watermark: "metadata-padding: HEX key ID in Exif header",
    createdTime: "2026-05-12 09:12:44",
    status: LureStatus.TRIGGERED,
    lastSeenIp: "185.220.101.5 (Tor Exit Node)",
    triggeredCount: 3
  },
  {
    id: "GW-LURE_20260515_3c92_v02.pqc",
    name: "Exo-Atmospheric Interceptor Guidance Schema",
    targetNode: "Arrow-3_Integration_Core",
    dnsToken: "guidance-sync-82.ghost.watch.local",
    watermark: "steganography-LSB: secret telemetry key embedded in cover banner",
    createdTime: "2026-05-15 16:45:12",
    status: LureStatus.ACTIVE,
    triggeredCount: 0
  },
  {
    id: "GW-LURE_20260518_cfa1_v02.pqc",
    name: "Citron Tree Battle Management Credentials",
    targetNode: "Director_Emulator_P-01",
    dnsToken: "credential-relay-93.ghost.watch.local",
    watermark: "linguistic-syntax: altered word order in licensing clause",
    createdTime: "2026-05-18 21:02:19",
    status: LureStatus.ACTIVE,
    triggeredCount: 0
  }
];

export const INITIAL_THREATS: ThreatEvent[] = [
  {
    id: "EVT-20260519-001",
    timestamp: "2026-05-19 23:14:02",
    level: ThreatLevel.INFO,
    source: "Green Pine Sensor 12",
    description: "Scan on 915.0 MHz band. Automated low-power probe filtered [313-BIND: #31301]",
    actionTaken: "Bypassed - logging physical coordinates",
    bindIndex: 31301,
    bindHash: "313-BIND-SHA3-512-0XA1B2C3D4E5F67890123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0",
    chainBound: true
  },
  {
    id: "EVT-20260520-011",
    timestamp: "2026-05-20 04:33:12",
    level: ThreatLevel.WARNING,
    source: "sonar-telemetry-11.ghost.watch.local",
    description: "Canary token clicked for Lure 'Submarine Acoustic Signature Profile v1.9' [313-BIND: #31302]",
    actionTaken: "Escalated to CADL L2. Injected synthetic latency (1200ms)",
    bindIndex: 31302,
    bindHash: "313-BIND-SHA3-512-0XB2C3D4E5F67890123456789ABCDEF0123456789ABCDEF0123456789ABCDEF1",
    chainBound: true
  },
  {
    id: "EVT-20260520-042",
    timestamp: "2026-05-20 04:35:45",
    level: ThreatLevel.CRITICAL,
    source: "185.220.101.5",
    description: "Multi-point query of watermarked documents showing rapid lateral shift [313-BIND: #31303]",
    actionTaken: "CADL L3: Port redirect to AETHER Honeypot environment active",
    bindIndex: 31303,
    bindHash: "313-BIND-SHA3-512-0XC3D4E5F67890123456789ABCDEF0123456789ABCDEF0123456789ABCDEF2",
    chainBound: true
  }
];

export const INITIAL_NODES: NetworkNode[] = [
  { id: "NODE_CORE_C2", label: "GW-C2 [HB-9982-AX-2026]", type: NodeType.CORE_C2, status: "ONLINE", details: "Core Apex Command Console", x: 400, y: 300 },
  { id: "NODE_LURE_1", label: "LURE: Submarine Acoustics v1.9", type: NodeType.LURE, status: "TRIGGERED", details: "Watermarked text file", x: 250, y: 180 },
  { id: "NODE_LURE_2", label: "LURE: Propulsion Manual", type: NodeType.LURE, status: "ACTIVE", details: "Watermarked PDF", x: 550, y: 180 },
  { id: "NODE_LURE_3", label: "LURE: Guidance Interceptor", type: NodeType.LURE, status: "ACTIVE", details: "Steganographic image", x: 550, y: 420 },
  { id: "NODE_ADVERSARY_1", label: "APT-42 / Tor-Exit 185.x", type: NodeType.ADVERSARY, status: "ISOLATED", details: "State-sponsored actor, lateral flow detected", x: 150, y: 300 },
  { id: "NODE_DEVICE_1", label: "Green Pine Sensor", type: NodeType.DEVICE, status: "MONITORING", details: "Network sensor checking port probes", x: 400, y: 120 },
  { id: "NODE_DEVICE_2", label: "David's Sling BMC Interface", type: NodeType.DEVICE, status: "SECURE", details: "Command node mapping intercept launchers", x: 280, y: 420 },
];

export const INITIAL_LINKS: NetworkLink[] = [
  { id: "LINK_1", source: "NODE_CORE_C2", target: "NODE_DEVICE_1", relationship: "telem-harvest" },
  { id: "LINK_2", source: "NODE_CORE_C2", target: "NODE_DEVICE_2", relationship: "command-link" },
  { id: "LINK_3", source: "NODE_CORE_C2", target: "NODE_LURE_1", relationship: "monitors" },
  { id: "LINK_4", source: "NODE_CORE_C2", target: "NODE_LURE_2", relationship: "monitors" },
  { id: "LINK_5", source: "NODE_CORE_C2", target: "NODE_LURE_3", relationship: "monitors" },
  { id: "LINK_6", source: "NODE_ADVERSARY_1", target: "NODE_LURE_1", relationship: "exfiltrated" },
  { id: "LINK_7", source: "NODE_ADVERSARY_1", target: "NODE_CORE_C2", relationship: "lateral-pivot-blocked" },
];

export const INITIAL_BSAU_PROFILES: BSAUProfile[] = [
  {
    id: "BSAU-091",
    operatorName: "Marcus Vance",
    role: "Database Administrator Sub-Lead",
    behaviorScore: 88,
    risk: RiskLevel.LOW,
    lateralSpeed: "0.14 hops/minute",
    fileAccessCount: 34,
    anomaliesDetected: ["Slight deviation in login hours (+2h)"],
    assessment: "Operator status is stable. Marginal drift is within standard parameters."
  },
  {
    id: "BSAU-092",
    operatorName: "LAE_Node_09 (Autonomous Service Account)",
    role: "Database Reader for Arrow Systems Integration",
    behaviorScore: 32,
    risk: RiskLevel.HIGH,
    lateralSpeed: "4.8 hops/second",
    fileAccessCount: 1420,
    anomaliesDetected: [
      "Rapid iteration on WE-FORGE document tables",
      "Lateral connections to 5 off-scope databases in 4 seconds"
    ],
    assessment: "Extremely fast algorithmic queries matching industrial espionage templates. Hostile takeover suspected. Targeted lures successfully ingested."
  },
  {
    id: "BSAU-093",
    operatorName: "Elena Rostova",
    role: "Comms Encryption Officer (915MHz Mesh)",
    behaviorScore: 97,
    risk: RiskLevel.LOW,
    lateralSpeed: "0.01 hops/minute",
    fileAccessCount: 11,
    anomaliesDetected: [],
    assessment: "Exemplary behavior compliance profile. Highly clean access fingerprint."
  }
];
