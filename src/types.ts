export enum LureStatus {
  ACTIVE = 'ACTIVE',
  TRIGGERED = 'TRIGGERED',
  EXPIRED = 'EXPIRED'
}

export enum ThreatLevel {
  INFO = 'INFO',
  WARNING = 'WARNING',
  CRITICAL = 'CRITICAL'
}

export enum NodeType {
  LURE = 'LURE',
  ADVERSARY = 'ADVERSARY',
  DEVICE = 'DEVICE',
  CORE_C2 = 'CORE_C2'
}

export enum RiskLevel {
  LOW = 'LOW',
  MID = 'MID',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export interface Lure {
  id: string; // e.g. GW-TERMINAL_20260415_001_v02.pqc
  name: string;
  targetNode: string;
  dnsToken: string;
  watermark: string; // Linguistic shift e.g. "synonym: propulsion -> acceleration"
  createdTime: string;
  status: LureStatus;
  lastSeenIp?: string;
  triggeredCount: number;
}

export interface ThreatEvent {
  id: string;
  timestamp: string;
  level: ThreatLevel;
  source: string;
  description: string;
  actionTaken: string;
  bindIndex?: number;
  bindHash?: string;
  chainBound?: boolean;
}

export interface NetworkNode {
  id: string;
  label: string;
  type: NodeType;
  status?: string;
  details?: string;
  x: number;
  y: number;
}

export interface NetworkLink {
  id: string;
  source: string;
  target: string;
  relationship: string;
}

export interface BSAUProfile {
  id: string;
  operatorName: string;
  role: string;
  behaviorScore: number; // 0-100 where lower behaviorScore is better or worse? Let's say Score is 0-100, where 100 is stable and < 50 is critical anomaly
  risk: RiskLevel;
  lateralSpeed: string; // e.g. "0.02 hops/sec" (Normal) or "4.5 hops/sec" (Abnormal)
  fileAccessCount: number;
  anomaliesDetected: string[];
  assessment: string;
}

export interface CryptoKeyStatus {
  keyId: string;
  algorithm: string; // "ML-KEM-768" or "ML-DSA-65" etc.
  fingerprint: string;
  generationTime: string;
  strength: string;
}
